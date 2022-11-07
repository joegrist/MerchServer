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
exports.listDesignsForMerchant = void 0;
var dataSource_1 = require("../../../common/dataSource");
var design_1 = require("../../../common/entity/design");
var designView_1 = require("../../../common/entity/designView");
var productVariation_1 = require("../../../common/entity/productVariation");
var dto_1 = require("./dto");
var designs = dataSource_1.ds.getRepository(design_1.Design);
var views = dataSource_1.ds.getRepository(designView_1.DesignView);
var variations = dataSource_1.ds.getRepository(productVariation_1.ProductVariation);
function listDesignsForMerchant(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var slug, designList, result, _loop_1, _i, designList_1, design;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    slug = request.params["slug"];
                    if (!slug)
                        throw new Error("id parameter was not numeric");
                    return [4 /*yield*/, designs.find({
                            where: { merchant: { slug: slug } },
                            relations: ["merchant", "product"]
                        })];
                case 1:
                    designList = _a.sent();
                    result = new Array();
                    _loop_1 = function (design) {
                        var dto, viewList, variationList;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    dto = new dto_1.PurchaseableDTO();
                                    dto.id = design.id;
                                    dto.name = design.name;
                                    dto.merchantSlug = design.merchant.slug;
                                    dto.purchaseableId = design.id;
                                    dto.purchaseableName = design.name;
                                    dto.thumbnail = "".concat(design.id, "/src.png");
                                    dto.priceCents = design.priceCents;
                                    dto.productId = design.product.id;
                                    dto.productName = design.product.name;
                                    return [4 /*yield*/, views.find({
                                            where: { design: { id: design.id } },
                                            relations: ["view"]
                                        })];
                                case 1:
                                    viewList = _b.sent();
                                    return [4 /*yield*/, variations.find({
                                            where: { product: { id: design.product.id } }
                                        })];
                                case 2:
                                    variationList = _b.sent();
                                    dto.views = viewList.map(function (view) {
                                        var v = new dto_1.PurchaseableViewDTO();
                                        v.id = view.id;
                                        v.background = view.background;
                                        v.name = view.view.name;
                                        v.thumbnail = "".concat(design.id, "/preview/").concat(view.view.name, ".png");
                                        return v;
                                    });
                                    dto.variations = variationList.map(function (variation) {
                                        var pv = new dto_1.PurchaseableVariationsDTO();
                                        pv.id = variation.id;
                                        pv.name = variation.name;
                                        pv.options = variation.variationsCommaSeparated;
                                        return pv;
                                    });
                                    result.push(dto);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, designList_1 = designList;
                    _a.label = 2;
                case 2:
                    if (!(_i < designList_1.length)) return [3 /*break*/, 5];
                    design = designList_1[_i];
                    return [5 /*yield**/, _loop_1(design)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    response.send(result);
                    return [2 /*return*/];
            }
        });
    });
}
exports.listDesignsForMerchant = listDesignsForMerchant;
