import {Request, Response} from "express";
import { View } from "typeorm/schema-builder/view/View";
import {ds} from "../../../common/dataSource"
import {Design} from "../../../common/entity/design";
import {DesignView} from "../../../common/entity/designView";

class DesignViewDTO {
    id: number
    thumbnail: string
    name: string
    background: number
}

class DesignDTO {
    id: number
    merchantId: number
    productId: number
    name: string
    thumbnail: string
    views: DesignViewDTO[]
}

export async function listDesignsForMerchant(request: Request, response: Response) {

    const designs = ds.getRepository(Design)
    const views = ds.getRepository(DesignView)
    let id = parseInt(request.params["merchantId"])
    if (!id) throw new Error("id parameter was not numeric")

    const designList = await designs.find({
        where: { merchant: { id: id } },
        relations: ["merchant", "product"]
    })

    let result = new Array<DesignDTO>()
    for (const design of designList) {
        const dto = new DesignDTO()
        dto.id = design.id
        dto.name = design.name
        dto.merchantId = design.merchant.id
        dto.productId = design.product.id
        dto.thumbnail = `${design.id}/src.png`
        const viewList = await views.find({
            where: { design: { id: design.id } },
            relations: ["view"]
        })
        dto.views = viewList.map((view) => {
             const v = new DesignViewDTO
             v.id = view.id
             v.background = view.background
             v.name = view.view.name
             v.thumbnail = `${design.id}/preview/${view.view.name}.png`
             return v
         })
        result.push(dto)
    }
    response.send(result)
}