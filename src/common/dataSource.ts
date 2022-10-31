import "reflect-metadata"
import { DataSource } from "typeorm"
import { serialize } from "class-transformer"

import { Design } from "./entity/design"
import { Merchant } from "./entity/merchant"
import { Product } from "./entity/product"
import { View } from "./entity/view"
import { DesignView } from "./entity/designView"

export const ds = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "merch_server",
    entities: [Design, Merchant, Product, View, DesignView],
    synchronize: true,
    logging: false
})
