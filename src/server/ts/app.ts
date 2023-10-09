import "reflect-metadata";
import * as fs from "fs"
import * as https from "https"
import * as http from "http"
import { ds } from "../../common/dataSource"
import { Request, Response } from "express"
import * as express from "express"
import * as bodyParser from "body-parser"
import { appInfo } from "./controller/info"
import { listAllMerchants } from "./controller/merchant"
import { listDesignsForMerchant } from "./controller/designs"
import { getCustomer, addEditCartItem, updateCart, login } from "./controller/customer"
import { afterPurchase, getPaymentIntent } from "./controller/checkout"
import { config, log } from "../../config/globals"
import { orders } from "./controller/admin";


const credentials = {
    key: fs.readFileSync('ssl/api-key.pem', 'utf8'),
    cert: fs.readFileSync('ssl/api-cert.pem', 'utf8'),
    passphrase: config.API_SSL_PASSPHRASE
}

ds.initialize().then(async () => {
    log.log("Database Connected")

    // create express app
    const app = express()

    // for parsing application/json
    app.use(bodyParser.json())

    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append('Access-Control-Allow-Headers', 'Content-Type');
        next();
    })

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

    app.post("/customer/:email/cart/update", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> updateCart`)
        updateCart(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.post("/customer/:email/paymentIntent", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> getPaymentIntent`)
        getPaymentIntent(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.get("/customer/:email/afterPurchase", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> buy`)
        afterPurchase(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.post("/customer/login", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> login`)
        login(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.get("/admin/orders", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> orders`)
        orders(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    app.post("/admin/fulfil", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> orders`)
        orders(request, response)
        .then(() => next)
        .catch(err => next(err))
    })

    // run app
    http.createServer(app).listen(3333);
    https.createServer(credentials, app).listen(4444);

    log.log("Express application is up and running on ports 3333 (http) / 4444 (https)")

}).catch((err: Error) => {
    log.err(`Error on startup`, err)
})
