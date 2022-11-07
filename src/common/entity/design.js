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
exports.Design = void 0;
var typeorm_1 = require("typeorm");
var merchant_1 = require("./merchant");
var product_1 = require("./product");
var Design = /** @class */ (function () {
    function Design() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Design.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return merchant_1.Merchant; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", merchant_1.Merchant)
    ], Design.prototype, "merchant");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return product_1.Product; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", product_1.Product)
    ], Design.prototype, "product");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Design.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Design.prototype, "priceCents");
    Design = __decorate([
        (0, typeorm_1.Entity)()
    ], Design);
    return Design;
}());
exports.Design = Design;
