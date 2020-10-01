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
exports.listingResolvers = void 0;
const crypto_1 = __importDefault(require("crypto"));
const api_1 = require("../../../lib/api");
const types_1 = require("../../../lib/types");
const utils_1 = require("../../../lib/utils");
const types_2 = require("./types");
const verifyHostListingInput = ({ title, description, type, price, }) => {
    if (title.length > 100) {
        throw new Error("listing title must be under 100 characaters");
    }
    if (description.length > 5000) {
        throw new Error("listing description must be under 5000 characters");
    }
    if (type !== types_1.ListingType.Apartment && type !== types_1.ListingType.House) {
        throw new Error("listing type must be either an apartment or house");
    }
    if (price < 0) {
        throw new Error("price must be greater than 0");
    }
};
exports.listingResolvers = {
    Query: {
        listing: (_root, { id }, { db, req }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const listing = (yield db.listings.findOne({ id }));
                if (!listing) {
                    throw new Error("listing cannot be found");
                }
                const viewer = yield utils_1.authorize(db, req);
                if (viewer && viewer.id === listing.host) {
                    listing.authoried = true;
                }
                return listing;
            }
            catch (error) {
                throw new Error(`Failed to query listing: ${error}`);
            }
        }),
        listings: (_root, { location, filter, limit, page }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const query = {};
                const data = {
                    region: null,
                    total: 0,
                    result: [],
                };
                if (location) {
                    const { country, admin, city } = yield api_1.Google.geocode(location);
                    if (city)
                        query.city = city;
                    if (admin)
                        query.admin = admin;
                    if (country) {
                        query.country = country;
                    }
                    else {
                        throw new Error("no country found");
                    }
                    const cityText = city ? `${city}, ` : "";
                    const adminText = admin ? `${admin}, ` : "";
                    data.region = `${cityText}${adminText}${country}`;
                }
                let order = null;
                if (filter && filter === types_2.ListingsFilter.PRICE_LOW_TO_HIGH) {
                    order = { price: "ASC" };
                }
                if (filter && filter === types_2.ListingsFilter.PRICE_HIGH_TO_LOW) {
                    order = { price: "DESC" };
                }
                const count = yield db.listings.count(query);
                const listings = yield db.listings.find({
                    where: Object.assign({}, query),
                    order: Object.assign({}, order),
                    skip: page > 0 ? (page - 1) * limit : 0,
                    take: limit,
                });
                data.total = count;
                data.result = listings;
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query listings: ${error}`);
            }
        }),
    },
    Listing: {
        host: (listing, _args, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            const host = yield db.users.findOne({ id: listing.host });
            if (!host) {
                throw new Error("host cannot be found");
            }
            return host;
        }),
        bookingsIndex: (listing) => {
            return JSON.stringify(listing.bookingsIndex);
        },
        bookings: (listing, { limit, page }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!listing.authoried) {
                    return null;
                }
                const data = {
                    total: 0,
                    result: [],
                };
                const bookings = yield db.bookings.findByIds(listing.bookings, {
                    skip: page > 0 ? (page - 1) * limit : 0,
                    take: limit,
                });
                data.total = listing.bookings.length;
                data.result = bookings;
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query listing bookings: ${error}`);
            }
        }),
    },
    Mutation: {
        hostListing: (_root, { input }, { db, req }) => __awaiter(void 0, void 0, void 0, function* () {
            verifyHostListingInput(input);
            const viewer = yield utils_1.authorize(db, req);
            if (!viewer) {
                throw new Error("viewer cannot be found");
            }
            const { country, admin, city } = yield api_1.Google.geocode(input.address);
            if (!country || !admin || !city) {
                throw new Error("invalid address entry");
            }
            const imageUrl = yield api_1.Cloudinary.upload(input.image);
            const newListing = Object.assign(Object.assign({ id: crypto_1.default.randomBytes(16).toString("hex") }, input), { image: imageUrl, bookings: [], bookingsIndex: {}, country,
                admin,
                city, host: viewer.id });
            const insertedListing = yield db.listings.create(newListing).save();
            viewer.listings.push(insertedListing.id);
            yield viewer.save();
            return insertedListing;
        }),
    },
};
