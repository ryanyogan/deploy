"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingResolvers = exports.resolveBookingsIndex = void 0;
const crypto_1 = __importDefault(require("crypto"));
const api_1 = require("../../../lib/api");
const utils_1 = require("../../../lib/utils");
const millisecondsPerDay = 86400000;
exports.resolveBookingsIndex = (bookingsIndex, checkInDate, checkOutDate) => {
    let dateCursor = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const newBookingsIndex = Object.assign({}, bookingsIndex);
    while (dateCursor <= checkOut) {
        const y = dateCursor.getUTCFullYear(); // Year
        const m = dateCursor.getUTCMonth(); // Month
        const d = dateCursor.getUTCDate(); // Day
        if (!newBookingsIndex[y]) {
            newBookingsIndex[y] = {};
        }
        if (!newBookingsIndex[y][m]) {
            newBookingsIndex[y][m] = {};
        }
        if (!newBookingsIndex[y][m][d]) {
            newBookingsIndex[y][m][d] = true;
        }
        else {
            throw new Error("selected dates cannot overlap dates that have been booked");
        }
        dateCursor = new Date(dateCursor.getTime() + 86400000);
    }
    return newBookingsIndex;
};
exports.bookingResolvers = {
    Booking: {
        listing: (booking, _args, { db }) => {
            return db.listings.findOne({ id: booking.listing });
        },
        tenant: (booking, _args, { db }) => {
            return db.users.findOne({ id: booking.tenant });
        },
    },
    Mutation: {
        createBooking: (_root, { input }, { db, req }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { id, source, checkIn, checkOut } = input;
                const viewer = yield utils_1.authorize(db, req);
                if (!viewer) {
                    throw new Error("viewer cannot be found");
                }
                const listing = yield db.listings.findOne({ id });
                if (!listing) {
                    throw new Error("listing cannot be found");
                }
                if (listing.host === viewer.id) {
                    throw new Error("host may not book their own listing");
                }
                const today = new Date();
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                if (checkOutDate < checkInDate) {
                    throw new Error("check out date cannot be before the check in date");
                }
                if (checkInDate.getTime() > today.getTime() + 90 * millisecondsPerDay) {
                    throw new Error("check in date cannot be more than 90 days from today");
                }
                if (checkOutDate.getTime() >
                    today.getTime() + 90 * millisecondsPerDay) {
                    throw new Error("check out date cannot be more than 90 days from today");
                }
                const bookingsIndex = exports.resolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);
                const totalPrice = listing.price *
                    ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);
                const host = yield db.users.findOne({ id: listing.host });
                if (!host || !host.walletId) {
                    throw new Error("the host either cannot be found or is not connected to Stripe");
                }
                yield api_1.Stripe.charge(totalPrice, source, host.walletId);
                const newBooking = {
                    id: crypto_1.default.randomBytes(16).toString("hex"),
                    listing: listing.id,
                    tenant: viewer.id,
                    checkIn,
                    checkOut,
                };
                const insertedBooking = yield db.bookings.create(newBooking).save();
                host.income = host.income + totalPrice;
                yield host.save();
                viewer.bookings.push(insertedBooking.id);
                yield viewer.save();
                listing.bookingsIndex = bookingsIndex;
                listing.bookings.push(insertedBooking.id);
                yield listing.save();
                return insertedBooking;
            }
            catch (error) {
                throw new Error(`Failed to create a booking: ${error}`);
            }
        }),
    },
};
