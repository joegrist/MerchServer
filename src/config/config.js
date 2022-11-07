"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.makeUuid = exports.stripe = exports.STRIPE_BASE = exports.DB_PORT = exports.DB_HOST = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USERNAME = exports.IMAGE_DESIGN = exports.IMAGE_VIEW = exports.log = void 0;
var logger_1 = require("../common/logger");
var stripe_1 = __importDefault(require("stripe"));
var uuidv4 = require('uuid').v4;
var root = "img/";
exports.log = new logger_1.Logger();
exports.IMAGE_VIEW = "".concat(root, "view");
exports.IMAGE_DESIGN = "".concat(root, "design");
exports.DB_USERNAME = "root";
exports.DB_PASSWORD = "root";
exports.DB_NAME = "merch_server";
exports.DB_HOST = "localhost";
exports.DB_PORT = 8889;
exports.STRIPE_BASE = "https://api.stripe.com";
var STRIPE_TEST_SK = 'sk_test_51LzAupLTMDQ2GHFnvQW4fi7Mt8TxOpbxyuyURKS3ZGiEbEbvKCYNdDBEhA8IuYQr2XTCyJrsQrAwDZqUATqpO9Bk00uozWlXiI';
var STRIPE_API_VERSION = '2022-08-01';
exports.stripe = new stripe_1["default"](STRIPE_TEST_SK, { apiVersion: STRIPE_API_VERSION });
function makeUuid() {
    return uuidv4();
}
exports.makeUuid = makeUuid;
