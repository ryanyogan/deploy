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
exports.connectDatabase = void 0;
const typeorm_1 = require("typeorm");
const entity_1 = require("./entity");
exports.connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield typeorm_1.createConnection({
        type: "postgres",
        url: `${process.env.DATABASE_URL}`,
        ssl: {
            rejectUnauthorized: false,
        },
        synchronize: true,
        logging: false,
        entities: [entity_1.BookingEntity, entity_1.ListingEntity, entity_1.UserEntity],
    });
    return {
        bookings: connection.getRepository(entity_1.BookingEntity),
        listings: connection.getRepository(entity_1.ListingEntity),
        users: connection.getRepository(entity_1.UserEntity),
    };
});
