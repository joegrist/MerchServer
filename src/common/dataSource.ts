import "reflect-metadata"
import { DataSource } from "typeorm"
import { serialize } from "class-transformer"

import { Design } from "./entity/design"
import { Merchant } from "./entity/merchant"
import { Product } from "./entity/product"
import { View } from "./entity/view"

export const ds = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "merch_server",
    entities: [Design, Merchant, Product, View],
    synchronize: true,
    logging: false
})
