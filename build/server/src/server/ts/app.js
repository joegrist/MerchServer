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
require("reflect-metadata");
var dataSource_1 = require("../../common/dataSource");
var express = require("express");
var bodyParser = require("body-parser");
var info_1 = require("./controller/info");
var merchant_1 = require("./controller/merchant");
var designs_1 = require("./controller/designs");
var customer_1 = require("./controller/customer");
var config_1 = require("../../config/config");
dataSource_1.ds.initialize().then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var app;
    return __generator(this, function (_a) {
        config_1.log.log("Database Connected");
        app = express();
        // for parsing application/json
        app.use(bodyParser.json());
        // for parsing application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));
        // register all application routes
        app.get("/", function (request, response, next) {
            config_1.log.log("".concat(request.path, " -> appInfo"));
            (0, info_1.appInfo)(request, response)
                .then(function () { return next; })["catch"](function (err) { return next(err); });
        });
        app.get("/merchants", function (request, response, next) {
            config_1.log.log("".concat(request.path, " -> listAllMerchants"));
            (0, merchant_1.listAllMerchants)(request, response)
                .then(function () { return next; })["catch"](function (err) { return next(err); });
        });
        app.get("/merchant/:slug/designs", function (request, response, next) {
            config_1.log.log("".concat(request.path, " -> listDesignsForMerchant"));
            (0, designs_1.listDesignsForMerchant)(request, response)
                .then(function () { return next; })["catch"](function (err) { return next(err); });
        });
        app.get("/customer/:email", function (request, response, next) {
            config_1.log.log("".concat(request.path, " -> getCustomer"));
            (0, customer_1.getCustomer)(request, response)
                .then(function () { return next; })["catch"](function (err) { return next(err); });
        });
        app.post("/customer/:email/purchase", function (request, response, next) {
            config_1.log.log("".concat(request.path, " -> addEditCartItem"));
            (0, customer_1.addEditCartItem)(request, response)
                .then(function () { return next; })["catch"](function (err) { return next(err); });
        });
        app.post("/customer/:email/buy", function (request, response, next) {
            config_1.log.log("".concat(request.path, " -> buy"));
            (0, customer_1.buy)(request, response)
                .then(function () { return next; })["catch"](function (err) { return next(err); });
        });
        app.post("/customer/login", function (request, response, next) {
            config_1.log.log("".concat(request.path, " -> login"));
            (0, customer_1.login)(request, response)
                .then(function () { return next; })["catch"](function (err) { return next(err); });
        });
        // run app
        app.listen(3000);
        console.log("Express application is up and running on port 3000");
        return [2 /*return*/];
    });
}); })["catch"](function (err) {
    config_1.log.err("Error on startup", err);
});
