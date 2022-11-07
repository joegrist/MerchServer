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
exports.DesignView = void 0;
var typeorm_1 = require("typeorm");
var design_1 = require("./design");
var view_1 = require("./view");
var DesignView = /** @class */ (function () {
    function DesignView() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DesignView.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return design_1.Design; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", design_1.Design)
    ], DesignView.prototype, "design");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return view_1.View; }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", view_1.View)
    ], DesignView.prototype, "view");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DesignView.prototype, "background");
    DesignView = __decorate([
        (0, typeorm_1.Entity)()
    ], DesignView);
    return DesignView;
}());
exports.DesignView = DesignView;
