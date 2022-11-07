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
exports.__esModule = true;
exports.Customer = void 0;
var typeorm_1 = require("typeorm");
var address_1 = require("./address");
var crypto = require('crypto');
var Customer = /** @class */ (function () {
    function Customer() {
    }
    Customer.prototype.correctPassword = function (candidate) {
        var hash = crypto.pbkdf2Sync(candidate, this.salt, 1000, 64, "sha512").toString("hex");
        return this.password === hash;
    };
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], Customer.prototype, "email");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return address_1.Address; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", address_1.Address)
    ], Customer.prototype, "billing");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return address_1.Address; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", address_1.Address)
    ], Customer.prototype, "delivery");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "mobile");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "salt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Customer.prototype, "password");
    Customer = __decorate([
        (0, typeorm_1.Entity)()
    ], Customer);
    return Customer;
}());
exports.Customer = Customer;
