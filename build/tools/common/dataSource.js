"use strict";
exports.__esModule = true;
exports.ds = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var design_1 = require("./entity/design");
var merchant_1 = require("./entity/merchant");
var product_1 = require("./entity/product");
var view_1 = require("./entity/view");
var designView_1 = require("./entity/designView");
var customer_1 = require("./entity/customer");
var customerDesign_1 = require("./entity/customerDesign");
var address_1 = require("./entity/address");
var productVariation_1 = require("./entity/productVariation");
var config_1 = require("../config/config");
exports.ds = new typeorm_1.DataSource({
    type: "mysql",
    host: config_1.DB_HOST,
    port: config_1.DB_PORT,
    username: config_1.DB_USERNAME,
    password: config_1.DB_PASSWORD,
    database: config_1.DB_NAME,
    entities: [design_1.Design, merchant_1.Merchant, product_1.Product, view_1.View, designView_1.DesignView, customer_1.Customer, customerDesign_1.CustomerDesign, address_1.Address, productVariation_1.ProductVariation],
    synchronize: true,
    logging: false
});
