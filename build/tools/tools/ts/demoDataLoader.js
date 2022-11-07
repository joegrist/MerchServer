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
var merchant_1 = require("../../common/entity/merchant");
var product_1 = require("../../common/entity/product");
var design_1 = require("../../common/entity/design");
var view_1 = require("../../common/entity/view");
var customerDesign_1 = require("../../common/entity/customerDesign");
var designView_1 = require("../../common/entity/designView");
var config_1 = require("../../config/config");
var customer_1 = require("../../common/entity/customer");
var productVariation_1 = require("../../common/entity/productVariation");
var crypto = require('crypto');
var DemoDataLoader = /** @class */ (function () {
    function DemoDataLoader() {
        this.demoMerchantName = "Demo Inc";
        this.demoMerchantSlug = "demo";
        this.foundationMerchantName = "Van Demon Kyokushin";
        this.foundationMerchantSlug = "vdk";
        this.foundationProductName = "Mens Black Hoodie";
        this.foundationDesignName = "Gang Member Mens Hoodie";
        this.demoDesignName = "Cursor Hoodie";
        this.foundationCustomerEmail = "joe@joe.com";
    }
    DemoDataLoader.prototype.loadDemoData = function (ds) {
        return __awaiter(this, void 0, void 0, function () {
            var product, merchant1, merchant2, customer, design;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureMerchant(ds, this.demoMerchantName, this.demoMerchantSlug)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ensureMerchant(ds, this.foundationMerchantName, this.foundationMerchantSlug)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.ensureProduct(ds, this.foundationProductName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ds.getRepository(product_1.Product).findOneBy({ name: this.foundationProductName })];
                    case 4:
                        product = _a.sent();
                        return [4 /*yield*/, this.ensureView(ds, product, "Front")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.ensureView(ds, product, "Back")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.ensureVariations(ds, product)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, ds.getRepository(merchant_1.Merchant).findOneBy({ slug: this.foundationMerchantSlug })];
                    case 8:
                        merchant1 = _a.sent();
                        return [4 /*yield*/, ds.getRepository(merchant_1.Merchant).findOneBy({ slug: this.demoMerchantSlug })];
                    case 9:
                        merchant2 = _a.sent();
                        return [4 /*yield*/, this.ensureDesign(ds, merchant1, this.foundationDesignName, 0x336699)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.ensureDesign(ds, merchant2, this.demoDesignName, 0x996633)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.enureCustomer(ds, "Joe", "1234", this.foundationCustomerEmail, "password")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.enureCustomer(ds, "Craig", "5678", "craig@craig.com", "password")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, ds.getRepository(customer_1.Customer).findOneBy({ email: this.foundationCustomerEmail })];
                    case 14:
                        customer = _a.sent();
                        return [4 /*yield*/, ds.getRepository(design_1.Design).findOneBy({ name: this.demoDesignName })];
                    case 15:
                        design = _a.sent();
                        return [4 /*yield*/, this.addToCart(ds, customer, design)];
                    case 16:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureMerchant = function (ds, name, slug) {
        return __awaiter(this, void 0, void 0, function () {
            var merchants, m, merchant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        merchants = ds.getRepository(merchant_1.Merchant);
                        return [4 /*yield*/, merchants.findOneBy({ name: name })];
                    case 1:
                        m = _a.sent();
                        if (m)
                            return [2 /*return*/];
                        config_1.log.log("Adding Merchant ".concat(name));
                        merchant = new merchant_1.Merchant();
                        merchant.slug = slug;
                        merchant.name = name;
                        return [4 /*yield*/, merchants.save(merchant)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureProduct = function (ds, name) {
        return __awaiter(this, void 0, void 0, function () {
            var products, p, product;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        products = ds.getRepository(product_1.Product);
                        return [4 /*yield*/, products.findOneBy({ name: name })];
                    case 1:
                        p = _a.sent();
                        if (p)
                            return [2 /*return*/];
                        config_1.log.log("Adding Product ".concat(name));
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
    DemoDataLoader.prototype.ensureDesign = function (ds, merchant, name, background) {
        return __awaiter(this, void 0, void 0, function () {
            var designs, products, viewList, designViewList, d, product, design, views;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        designs = ds.getRepository(design_1.Design);
                        products = ds.getRepository(product_1.Product);
                        viewList = ds.getRepository(view_1.View);
                        designViewList = ds.getRepository(designView_1.DesignView);
                        return [4 /*yield*/, designs.findOneBy({ name: name })];
                    case 1:
                        d = _a.sent();
                        if (d)
                            return [2 /*return*/];
                        return [4 /*yield*/, products.findOneBy({ name: this.foundationProductName })];
                    case 2:
                        product = _a.sent();
                        config_1.log.log("Adding Design ".concat(name));
                        design = new design_1.Design();
                        design.name = name;
                        design.product = product;
                        design.merchant = merchant;
                        design.priceCents = 5000;
                        return [4 /*yield*/, designs.save(design)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, viewList.findBy({ product: product })];
                    case 4:
                        views = _a.sent();
                        views.forEach(function (view) {
                            config_1.log.log("Adding Design View ".concat(name, " ").concat(view.name));
                            var dv = new designView_1.DesignView();
                            dv.background = background;
                            dv.view = view;
                            dv.design = design;
                            designViewList.save(dv);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureView = function (ds, product, name) {
        return __awaiter(this, void 0, void 0, function () {
            var views, v, view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        views = ds.getRepository(view_1.View);
                        return [4 /*yield*/, views.findOneBy({ name: name })];
                    case 1:
                        v = _a.sent();
                        if (v)
                            return [2 /*return*/];
                        config_1.log.log("Adding View ".concat(name));
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
    DemoDataLoader.prototype.enureCustomer = function (ds, name, phone, email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var customers, salt, hash, c;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customers = ds.getRepository(customer_1.Customer);
                        salt = crypto.randomBytes(16).toString('hex');
                        hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
                        config_1.log.log("Adding Customer ".concat(name));
                        c = new customer_1.Customer();
                        c.name = name;
                        c.mobile = phone;
                        c.email = email;
                        c.salt = salt;
                        c.password = hash;
                        return [4 /*yield*/, customers.save(c)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.ensureVariations = function (ds, product) {
        return __awaiter(this, void 0, void 0, function () {
            var variations, pv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        variations = ds.getRepository(productVariation_1.ProductVariation);
                        config_1.log.log("Adding Variations to ".concat(product.name));
                        pv = new productVariation_1.ProductVariation();
                        pv.product = product;
                        pv.name = "Size";
                        pv.variationsCommaSeparated = "S,M,L,XL,XXL";
                        return [4 /*yield*/, variations.save(pv)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DemoDataLoader.prototype.addToCart = function (ds, customer, design) {
        return __awaiter(this, void 0, void 0, function () {
            var purchases, purchase;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        purchases = ds.getRepository(customerDesign_1.CustomerDesign);
                        config_1.log.log("Adding Cart Item '".concat(design.name, "' for ").concat(customer.name));
                        purchase = new customerDesign_1.CustomerDesign();
                        purchase.customer = customer;
                        purchase.design = design;
                        purchase.variation = "XL";
                        purchase.quantity = 5;
                        purchase.priceCents = design.priceCents;
                        purchase.id = (0, config_1.makeUuid)();
                        return [4 /*yield*/, purchases.save(purchase)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DemoDataLoader;
}());
exports.DemoDataLoader = DemoDataLoader;
