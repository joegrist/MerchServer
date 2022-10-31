import { Logger } from "../../common/logger"
import { DemoDataLoader } from "./demoDataLoader"
import { ds } from "../../common/dataSource"

let log = new Logger()
let loader = new DemoDataLoader()

ds.initialize().then(async () => {
    log.log("Database Connected")
    loader.loadDemoData(ds)

}).catch((err: Error) => {
    log.err(`Error on startup`, err)
})
