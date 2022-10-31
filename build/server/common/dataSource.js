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
exports.ds = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "merch_server",
    entities: [design_1.Design, merchant_1.Merchant, product_1.Product, view_1.View, designView_1.DesignView],
    synchronize: true,
    logging: false
});
