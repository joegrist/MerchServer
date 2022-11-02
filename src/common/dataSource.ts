import "reflect-metadata"
import { DataSource } from "typeorm"
import { serialize } from "class-transformer"

import { Design } from "./entity/design"
import { Merchant } from "./entity/merchant"
import { Product } from "./entity/product"
import { View } from "./entity/view"
import { DesignView } from "./entity/designView"
import { Customer } from "./entity/customer"
import { CustomerDesign } from "./entity/customerDesign"
import { Address } from "./entity/address"
import { ProductVariation } from "./entity/productVariation"
import { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } from "../config/config"

export const ds = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [Design, Merchant, Product, View, DesignView, Customer, CustomerDesign, Address, ProductVariation],
    synchronize: true,
    logging: false
})
