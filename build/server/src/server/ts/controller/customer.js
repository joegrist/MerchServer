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
exports.buy = exports.addEditCartItem = exports.getCustomer = void 0;
var dataSource_1 = require("../../../common/dataSource");
var customer_1 = require("../../../common/entity/customer");
var customerDesign_1 = require("../../../common/entity/customerDesign");
var design_1 = require("../../../common/entity/design");
var dto_1 = require("./dto");
var config_1 = require("../../../config/config");
var stripe_1 = require("../stripe");
var customerRepo = dataSource_1.ds.getRepository(customer_1.Customer);
var cartRepo = dataSource_1.ds.getRepository(customerDesign_1.CustomerDesign);
var designRepo = dataSource_1.ds.getRepository(design_1.Design);
function getCustomer(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var email, customer, result, cart;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = request.params["email"];
                    if (!email)
                        throw new Error("email parameter was not found");
                    return [4 /*yield*/, customerRepo.findOneBy({ email: email })];
                case 1:
                    customer = _a.sent();
                    if (!customer)
                        throw new Error("customer email not found");
                    result = new dto_1.CustomerDTO();
                    result.cart = [];
                    result.name = customer.name;
                    result.email = customer.email;
                    result.mobile = customer.mobile;
                    return [4 /*yield*/, cartRepo.find({
                            where: { customer: { email: customer.email } },
                            relations: ["design", "customer"]
                        })];
                case 2:
                    cart = _a.sent();
                    cart.forEach(function (purchase) {
                        var p = new dto_1.PurchaseDTO();
                        var pp = new dto_1.PurchaseableDTO();
                        pp.id = purchase.design.id;
                        pp.name = purchase.design.name;
                        p.id = purchase.id;
                        p.quantity = purchase.quantity;
                        p.variation = purchase.variation;
                        p.purchaseable = pp;
                        result.cart.push(p);
                    });
                    // return loaded posts
                    response.setHeader('content-type', 'application/json');
                    response.send(result);
                    return [2 /*return*/];
            }
        });
    });
}
exports.getCustomer = getCustomer;
function addEditCartItem(request, response) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var customerEmail, id, designId, variation, quantity, customer, design, item;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    customerEmail = request.params["email"];
                    id = request.body.id;
                    designId = request.body.designId;
                    variation = request.body.variation;
                    quantity = (_a = request.body.quantity) !== null && _a !== void 0 ? _a : 0;
                    if (!designId) {
                        throw new Error("must specify design id");
                    }
                    return [4 /*yield*/, customerRepo.findOneBy({ email: customerEmail })];
                case 1:
                    customer = _b.sent();
                    return [4 /*yield*/, designRepo.findOneBy({ id: designId })];
                case 2:
                    design = _b.sent();
                    if (!customer || !design) {
                        throw new Error("could not find customer or design (or both)");
                    }
                    return [4 /*yield*/, ensureCartItem(id)];
                case 3:
                    item = _b.sent();
                    item.design = design;
                    item.customer = customer;
                    item.quantity = quantity;
                    item.priceCents = design.priceCents;
                    if (variation)
                        item.variation = variation;
                    return [4 /*yield*/, cartRepo.save(item)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, getCustomer(request, response)];
            }
        });
    });
}
exports.addEditCartItem = addEditCartItem;
function ensureCartItem(id) {
    return __awaiter(this, void 0, void 0, function () {
        var cd_1, cd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, cartRepo.findOneBy({ id: id })];
                case 1:
                    cd_1 = _a.sent();
                    if (cd_1) {
                        return [2 /*return*/, cd_1];
                    }
                    _a.label = 2;
                case 2:
                    cd = new customerDesign_1.CustomerDesign();
                    cd.id = (0, config_1.makeUuid)();
                    return [4 /*yield*/, cartRepo.save(cd)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, cd];
            }
        });
    });
}
function buy(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var customerEmail, customer, purchases, cost, payment, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    customerEmail = request.params["email"];
                    return [4 /*yield*/, customerRepo.findOneBy({ email: customerEmail })];
                case 1:
                    customer = _a.sent();
                    return [4 /*yield*/, cartRepo.findBy({ customer: { email: customer.email }, purchased: null })];
                case 2:
                    purchases = _a.sent();
                    cost = 0;
                    purchases.forEach(function (purchase) {
                        cost += purchase.priceCents;
                    });
                    payment = new stripe_1.StripePayment();
                    payment.cents = cost;
                    return [4 /*yield*/, payment.go()];
                case 3:
                    result = _a.sent();
                    if (payment.failed) {
                        config_1.log.err("Payment Fail: ".concat(result));
                        return [2 /*return*/];
                    }
                    purchases.forEach(function (purchase) {
                        purchase.purchased = new Date();
                        cartRepo.save(purchase);
                    });
                    return [2 /*return*/, getCustomer(request, response)];
            }
        });
    });
}
exports.buy = buy;
