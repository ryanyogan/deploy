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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn("text"),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], UserEntity.prototype, "token", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], UserEntity.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], UserEntity.prototype, "contact", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "walletId", void 0);
__decorate([
    typeorm_1.Column("integer"),
    __metadata("design:type", Number)
], UserEntity.prototype, "income", void 0);
__decorate([
    typeorm_1.Column("simple-array"),
    __metadata("design:type", Array)
], UserEntity.prototype, "bookings", void 0);
__decorate([
    typeorm_1.Column("simple-array"),
    __metadata("design:type", Array)
], UserEntity.prototype, "listings", void 0);
UserEntity = __decorate([
    typeorm_1.Entity("users")
], UserEntity);
exports.UserEntity = UserEntity;
