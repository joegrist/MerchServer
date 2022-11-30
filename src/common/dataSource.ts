import "reflect-metadata"
import { DataSource } from "typeorm"
import { Design } from "./entity/design"
import { Merchant } from "./entity/merchant"
import { Product } from "./entity/product"
import { View } from "./entity/view"
import { DesignView } from "./entity/designView"
import { Customer } from "./entity/customer"
import { CustomerDesign } from "./entity/customerDesign"
import { Address } from "./entity/address"
import { ProductVariation } from "./entity/productVariation"
import { Supplier } from "./entity/supplier"
import { config } from "../config/globals"

export const ds = new DataSource({
    type: "mysql",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [Design, Merchant, Product, View, DesignView, Customer, CustomerDesign, Address, ProductVariation, Supplier],
    synchronize: true,
    logging: false
})
