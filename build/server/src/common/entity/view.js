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
exports.View = void 0;
var typeorm_1 = require("typeorm");
var product_1 = require("./product");
var View = /** @class */ (function () {
    function View() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], View.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return product_1.Product; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", product_1.Product)
    ], View.prototype, "product");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], View.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "productIllustrationWidthPx");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "productIllustrationHeightPx");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "printAreaWidthPx");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "printAreaHeightPx");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "printAreaOriginXPx");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "printAreaOriginYPx");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "printAreaWidthMm");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], View.prototype, "printAreaHeightMm");
    View = __decorate([
        (0, typeorm_1.Entity)()
    ], View);
    return View;
}());
exports.View = View;
