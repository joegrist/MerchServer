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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DemoDataLoader = void 0;
var logger_1 = require("../../common/logger");
var merchant_1 = require("../../common/entity/merchant");
var product_1 = require("../../common/entity/product");
var design_1 = require("../../common/entity/design");
var view_1 = require("../../common/entity/view");
var DemoDataLoader = /** @class */ (function () {
    function DemoDataLoader() {
        this.log = new logger_1.Logger();
        this.demoMerchantName = "Demo Inc";
        this.foundationMerchantName = "Van Demon Kyokushin";
        this.foundationProductName = "Mens Black Hoodie";
        this.foundationDesignName = "Gang Member Mens Hoodie";
    }
    DemoDataLoader.prototype.loadDemoData = function (ds) {
        return __awaiter(this, void 0, void 0, function () {
            var merchantRepo, productRepo, designRepo, viewRepo, product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        merchantRepo = ds.getRepository(merchant_1.Merchant);
                        productRepo = ds.getRepository(product_1.Product);
                        designRepo = ds.getRepository(design_1.Design);
                        viewRepo = ds.getRepository(view_1.View);
                        return [4 /*yield*/, this.ensureMerchant(merchantRepo, this.demoMerchantName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ensureMerchant(merchantRepo, this.foundationMerchantName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.ensureProduct(productRepo, this.foundationProductName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.ensureDesign(merchantRepo, productRepo, designRepo, this.foundationDesignName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, productRepo.findOneBy({ name: this.foundationProductName })];
                    case 5:
                        product = _a.sent();
                        return [4 /*yield*/, this.ensureView(viewRepo, product, "Front")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.ensureView(viewRepo, product, "Back")];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureMerchant = function (merchants, name) {
        return __awaiter(this, void 0, void 0, function () {
            var m, merchant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, merchants.findOneBy({ name: name })];
                    case 1:
                        m = _a.sent();
                        if (m)
                            return [2 /*return*/];
                        this.log.log("Adding Merchant ".concat(name));
                        merchant = new merchant_1.Merchant();
                        merchant.name = name;
                        return [4 /*yield*/, merchants.save(merchant)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureProduct = function (products, name) {
        return __awaiter(this, void 0, void 0, function () {
            var p, product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, products.findOneBy({ name: name })];
                    case 1:
                        p = _a.sent();
                        if (p)
                            return [2 /*return*/];
                        this.log.log("Adding Product ".concat(name));
                        product = new product_1.Product();
                        product.name = name;
                        return [4 /*yield*/, products.save(product)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureDesign = function (merchants, products, designs, name) {
        return __awaiter(this, void 0, void 0, function () {
            var d, merchant, product, design;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, designs.findOneBy({ name: name })];
                    case 1:
                        d = _a.sent();
                        if (d)
                            return [2 /*return*/];
                        return [4 /*yield*/, merchants.findOneBy({ name: this.foundationMerchantName })];
                    case 2:
                        merchant = _a.sent();
                        return [4 /*yield*/, products.findOneBy({ name: this.foundationProductName })];
                    case 3:
                        product = _a.sent();
                        this.log.log("Adding Design ".concat(name));
                        design = new design_1.Design();
                        design.name = name;
                        design.product = product;
                        design.merchant = merchant;
                        return [4 /*yield*/, designs.save(design)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureView = function (views, product, name) {
        return __awaiter(this, void 0, void 0, function () {
            var v, view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, views.findOneBy({ name: name })];
                    case 1:
                        v = _a.sent();
                        if (v)
                            return [2 /*return*/];
                        this.log.log("Adding View ".concat(name));
                        view = new view_1.View();
                        view.product = product;
                        view.name = name;
                        view.productIllustrationHeightPx = 2000;
                        view.productIllustrationWidthPx = 1000;
                        view.printAreaOriginXPx = 100;
                        view.printAreaOriginYPx = 100;
                        view.printAreaWidthPx = 1800;
                        view.printAreaHeightPx = 800;
                        view.printAreaWidthMm = 0;
                        view.printAreaHeightMm = 0;
                        return [4 /*yield*/, views.save(view)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DemoDataLoader;
}());
exports.DemoDataLoader = DemoDataLoader;
