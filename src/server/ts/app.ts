import "reflect-metadata";
import { ds } from "../../common/dataSource"
import { Logger } from "../../common/logger"
import {Request, Response} from "express"
import * as express from "express"
import * as bodyParser from "body-parser"
import {appInfo} from "./controller/info"
import {listAllMerchants} from "./controller/merchant"
import {getDesign} from "./controller/design"
import {listDesignsForMerchant} from "./controller/designs"

let log = new Logger()

ds.initialize().then(async () => {
    log.log("Database Connected")

    // create express app
    const app = express()
    app.use(bodyParser.json());

    // register all application routes
    app.get("/", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> appInfo`)
        appInfo(request, response)
        .then(() => next)
        .catch(err => next(err));
     });

     app.get("/merchants", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> listAllMerchants`)
        listAllMerchants(request, response)
        .then(() => next)
        .catch(err => next(err));
     });

     app.get("/merchant/:merchantId/designs", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> listDesignsForMerchant`)
        listDesignsForMerchant(request, response)
        .then(() => next)
        .catch(err => next(err));
     });

     app.get("/design/:id", (request: Request, response: Response, next: Function) => {
        log.log(`${request.path} -> getDesign`)
        getDesign(request, response)
        .then(() => next)
        .catch(err => next(err));
     });

    // run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");

}).catch((err: Error) => {
    log.err(`Error on startup`, err)
})
