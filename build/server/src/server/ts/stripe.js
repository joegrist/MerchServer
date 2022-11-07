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
exports.StripePayment = void 0;
var uuidv4 = require('uuid').v4;
var config_1 = require("../../config/config");
var StripePayment = /** @class */ (function () {
    function StripePayment() {
        this.currency = "aud";
        this.source = "tok_amex"; // obtained with Stripe.js
        this.key = (0, config_1.makeUuid)();
        this.cents = 0;
        this.failed = false;
    }
    StripePayment.prototype.go = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.process()];
            });
        });
    };
    StripePayment.prototype.process = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            config_1.stripe.charges.create({
                amount: _this.cents / 100,
                currency: _this.currency,
                source: _this.source,
                description: "My First Test Charge (created for API docs at https://www.stripe.com/docs/api)"
            }, {
                idempotencyKey: _this.key
            }).then(function (charge) {
                config_1.log.log("Payment worked");
                _this.failed = false;
                resolve(charge);
            }, function (failReason) {
                config_1.log.err(_this.describe(failReason), failReason);
                _this.failed = true;
                reject(failReason);
            });
        });
    };
    StripePayment.prototype.describe = function (err) {
        switch (err.type) {
            case 'StripeCardError':
                // A declined card error
                return "Declined"; // => e.g. "Your card's expiration year is invalid."
            case 'StripeRateLimitError':
                return "Server too busy"; // Too many requests made to the API too quickly
            case 'StripeInvalidRequestError':
                return "Programmer Error"; // Invalid parameters were supplied to Stripe's API
            case 'StripeAPIError':
                return "Internal Error at Stripe"; // An error occurred internally with Stripe's API
            case 'StripeConnectionError':
                return "Connection Error"; // Some kind of error occurred during the HTTPS communication
            case 'StripeAuthenticationError':
                return "Programmer Error: Authentication"; // You probably used an incorrect API key
            default:
                return "Unknown Error"; // Handle any other types of unexpected errors
        }
    };
    return StripePayment;
}());
exports.StripePayment = StripePayment;
