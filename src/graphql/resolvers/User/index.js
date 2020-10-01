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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolver = void 0;
const utils_1 = require("../../../lib/utils");
exports.userResolver = {
    Query: {
        user: (_root, { id }, { db, req }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = (yield db.users.findOne({ id }));
                if (!user) {
                    throw new Error("User cannot be found");
                }
                // Is the current client viewer, the logged in user?
                const viewer = yield utils_1.authorize(db, req);
                if (viewer && viewer.id === user.id) {
                    user.authorized = true;
                }
                return user;
            }
            catch (error) {
                throw new Error(`Failed to query user: ${error}`);
            }
        }),
    },
    User: {
        hasWallet: (user) => Boolean(user.walletId),
        income: (user) => user.authorized ? user.income : null,
        bookings: (user, { limit, page }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!user.authorized) {
                    return null;
                }
                const data = {
                    total: 0,
                    result: [],
                };
                const bookings = yield db.bookings.findByIds(user.bookings, {
                    skip: page > 0 ? (page - 1) * limit : 0,
                    take: limit,
                });
                data.total = user.bookings.length;
                data.result = bookings;
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query user bookings: ${error}`);
            }
        }),
        listings: (user, { limit, page }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = {
                    total: 0,
                    result: [],
                };
                const listings = yield db.listings.findByIds(user.listings, {
                    skip: page > 0 ? (page - 1) * limit : 0,
                    take: limit,
                });
                data.total = user.listings.length;
                data.result = listings;
                return data;
            }
            catch (error) {
                throw new Error(`Failed to query user listings: ${error}`);
            }
        }),
    },
};
