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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.generate = exports.process = void 0;
var jimp_1 = __importDefault(require("jimp"));
var config_1 = require("../../config/config");
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Size = /** @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
var Frame = /** @class */ (function () {
    function Frame(x, y, width, height) {
        this.origin = new Point(x, y);
        this.size = new Size(width, height);
    }
    return Frame;
}());
function process(description, name, viewId, designId, color) {
    return __awaiter(this, void 0, void 0, function () {
        var base, artworkMask, colorMask, artwork, previewFrame, artworkFrame, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, jimp_1["default"].read("".concat(config_1.IMAGE_VIEW, "/").concat(viewId, "/base.png"))];
                case 1:
                    base = _a.sent();
                    return [4 /*yield*/, jimp_1["default"].read("".concat(config_1.IMAGE_VIEW, "/").concat(viewId, "/artwork_mask.png"))];
                case 2:
                    artworkMask = _a.sent();
                    return [4 /*yield*/, jimp_1["default"].read("".concat(config_1.IMAGE_VIEW, "/").concat(viewId, "/color_mask.png"))];
                case 3:
                    colorMask = _a.sent();
                    return [4 /*yield*/, jimp_1["default"].read("".concat(config_1.IMAGE_DESIGN, "/").concat(designId, "/src.png"))];
                case 4:
                    artwork = _a.sent();
                    previewFrame = new Frame(0, 0, 1000, 2000);
                    artworkFrame = new Frame(100, 100, 800, 1800);
                    config_1.log.log("Processing ".concat(description));
                    return [4 /*yield*/, generate(artwork, base, artworkMask, colorMask, artworkFrame, previewFrame, color, name, designId)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    config_1.log.err("Skipping ".concat(description), e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.process = process;
function generate(artwork, product, artworkMask, colorMask, artworkFrame, previewFrame, background, name, id) {
    return __awaiter(this, void 0, void 0, function () {
        var out, baseColor, productForeground;
        return __generator(this, function (_a) {
            // Scale source images for output
            product.cover(previewFrame.size.width, previewFrame.size.height);
            colorMask.cover(previewFrame.size.width, previewFrame.size.height);
            artworkMask.cover(previewFrame.size.width, previewFrame.size.height);
            artwork.contain(artworkFrame.size.width, artworkFrame.size.height);
            out = new jimp_1["default"](previewFrame.size.width, previewFrame.size.height);
            baseColor = new jimp_1["default"](previewFrame.size.width, previewFrame.size.height, background);
            productForeground = new jimp_1["default"](previewFrame.size.width, previewFrame.size.height);
            // Ugly Bit
            baseColor.mask(colorMask, 0, 0);
            product.composite(baseColor, 0, 0, { mode: jimp_1["default"].BLEND_MULTIPLY, opacitySource: 1, opacityDest: 1 });
            productForeground.composite(product, 0, 0);
            product.mask(artworkMask, 0, 0);
            artworkMask.invert();
            productForeground.mask(artworkMask, 0, 0);
            artwork.scaleToFit;
            // Composit
            out.composite(product, 0, 0);
            out.composite(artwork, artworkFrame.origin.x, artworkFrame.origin.y);
            out.composite(productForeground, 0, 0);
            // Save
            out.write("".concat(config_1.IMAGE_DESIGN, "/").concat(id, "/preview/").concat(name, ".png"));
            return [2 /*return*/];
        });
    });
}
exports.generate = generate;
