"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingEntity = void 0;
const typeorm_1 = require("typeorm");
const types_1 = require("../../lib/types");
let ListingEntity = class ListingEntity extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn("text"),
    __metadata("design:type", String)
], ListingEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 100 }),
    __metadata("design:type", String)
], ListingEntity.prototype, "title", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: 5000 }),
    __metadata("design:type", String)
], ListingEntity.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], ListingEntity.prototype, "image", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], ListingEntity.prototype, "host", void 0);
__decorate([
    typeorm_1.Column({ type: "enum", enum: types_1.ListingType }),
    __metadata("design:type", String)
], ListingEntity.prototype, "type", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], ListingEntity.prototype, "address", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], ListingEntity.prototype, "country", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], ListingEntity.prototype, "admin", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], ListingEntity.prototype, "city", void 0);
__decorate([
    typeorm_1.Column("simple-array"),
    __metadata("design:type", Array)
], ListingEntity.prototype, "bookings", void 0);
__decorate([
    typeorm_1.Column("simple-json"),
    __metadata("design:type", Object)
], ListingEntity.prototype, "bookingsIndex", void 0);
__decorate([
    typeorm_1.Column("integer"),
    __metadata("design:type", Number)
], ListingEntity.prototype, "price", void 0);
__decorate([
    typeorm_1.Column("integer"),
    __metadata("design:type", Number)
], ListingEntity.prototype, "numOfGuests", void 0);
ListingEntity = __decorate([
    typeorm_1.Entity("listings"),
    typeorm_1.Index(["country", "admin", "city"])
], ListingEntity);
exports.ListingEntity = ListingEntity;
