import "reflect-metadata";
import { ds } from "../../common/dataSource"
import { Request, Response } from "express"
import * as express from "express"
import * as bodyParser from "body-parser"
import { appInfo } from "./controller/info"
import { listAllMerchants } from "./controller/merchant"
import { listDesignsForMerchant } from "./controller/designs"
import { getCustomer, addEditCartItem, buy } from "./controller/customer"
import { log } from "../../config/config"

ds.initialize().then(async () => {
    log.log("Database Connected")

    // create express app
    const app = express()

    // for parsing application/json
    app.use(bodyParser.json())

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }))

    // register all application routes
    app.get("/", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> appInfo`)
        appInfo(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.get("/merchants", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> listAllMerchants`)
        listAllMerchants(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.get("/merchant/:slug/designs", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> listDesignsForMerchant`)
        listDesignsForMerchant(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.get("/customer/:email", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> getCustomer`)
        getCustomer(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.post("/customer/:email/purchase", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> addEditCartItem`)
        addEditCartItem(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.post("/customer/:email/buy", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> buy`)
        buy(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    // run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000")

}).catch((err: Error) => {
    log.err(`Error on startup`, err)
})
