import { DemoDataLoader } from "./demoDataLoader"
import { ds } from "../../common/dataSource"
import { log } from "../../config/config"

let loader = new DemoDataLoader()

ds.initialize().then(async () => {
    log.log("Database Connected")
    loader.loadDemoData(ds)

}).catch((err: Error) => {
    log.err(`Error on startup`, err)
})
