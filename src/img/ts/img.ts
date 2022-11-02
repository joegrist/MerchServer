import { ds } from "../../common/dataSource"
import { Logger } from "../../common/logger"
import { DesignView } from "../../common/entity/designView"
import { process } from "./generate"
import { log } from "../../config/config"

ds.initialize().then(async () => {
    log.log("Database Connected")
    const designViewRepo = ds.getRepository(DesignView)
    const dvs = await designViewRepo.find({relations: ["view", "design"]})
    dvs.forEach(dv => {
        let description = `${dv.design.name} [Design ${dv.design.id}]${dv.view.name}[View ${dv.view.id}][DesignView ${dv.id}]`
        process(description, dv.view.name, dv.view.id, dv.design.id, dv.background)
    })


}).catch((err: Error) => {
    log.err(`Error on startup`, err)
})
