import { DemoDataLoader } from "./demoDataLoader"
import { ds } from "../../common/dataSource"
import { log } from "../../config/globals"

let loader = new DemoDataLoader()

ds.initialize().then(async () => {
    log.log("Database Connected")
    await loader.loadDemoData(ds)
    process.exit()
}).catch((err: Error) => {
    log.err(`Error on startup`, err)
})
