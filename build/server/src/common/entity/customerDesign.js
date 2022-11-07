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
exports.CustomerDesign = void 0;
var typeorm_1 = require("typeorm");
var customer_1 = require("./customer");
var design_1 = require("./design");
var CustomerDesign = /** @class */ (function () {
    function CustomerDesign() {
        this.quantity = 0;
        this.priceCents = 0;
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", String)
    ], CustomerDesign.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return customer_1.Customer; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", customer_1.Customer)
    ], CustomerDesign.prototype, "customer");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return design_1.Design; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", design_1.Design)
    ], CustomerDesign.prototype, "design");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], CustomerDesign.prototype, "quantity");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], CustomerDesign.prototype, "variation");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true }),
        __metadata("design:type", Date)
    ], CustomerDesign.prototype, "purchased");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], CustomerDesign.prototype, "priceCents");
    CustomerDesign = __decorate([
        (0, typeorm_1.Entity)()
    ], CustomerDesign);
    return CustomerDesign;
}());
exports.CustomerDesign = CustomerDesign;
