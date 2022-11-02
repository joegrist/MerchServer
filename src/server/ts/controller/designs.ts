import {Request, Response} from "express";
import { View } from "typeorm/schema-builder/view/View";
import {ds} from "../../../common/dataSource"
import {Design} from "../../../common/entity/design";
import {DesignView} from "../../../common/entity/designView";
import { ProductVariation } from "../../../common/entity/productVariation";

class PurchaseableViewDTO {
    id: number
    thumbnail: string
    name: string
    background: number
    purchaseableId: number
    purchaseableName: string
}

class PurchaseableVariationsDTO {
    id: number
    name: string
    variations: string[]
}

class PurchaseableDTO {
    id: number
    shopId: number
    purchaseableId: number
    purchaseableName: string
    name: string
    thumbnail: string
    priceCents: number
    views: PurchaseableViewDTO[]
    variations: PurchaseableVariationsDTO[]
}

export async function listDesignsForMerchant(request: Request, response: Response) {

    const designs = ds.getRepository(Design)
    const views = ds.getRepository(DesignView)
    const variations = ds.getRepository(ProductVariation)

    let id = parseInt(request.params["merchantId"])
    if (!id) throw new Error("id parameter was not numeric")

    const designList = await designs.find({
        where: { merchant: { id: id } },
        relations: ["merchant", "product"]
    })

    let result = new Array<PurchaseableDTO>()
    for (const design of designList) {
        const dto = new PurchaseableDTO()
        dto.id = design.id
        dto.name = design.name
        dto.shopId = design.merchant.id
        dto.purchaseableId = design.product.id
        dto.purchaseableName = design.product.name
        dto.thumbnail = `${design.id}/src.png`
        dto.priceCents = design.priceCents
        
        const viewList = await views.find({
            where: { design: { id: design.id } },
            relations: ["view"]
        })

        const variationList = await variations.find({
            where: { product: { id: design.product.id } }
        })

        dto.views = viewList.map((view) => {
             const v = new PurchaseableViewDTO()
             v.id = view.id
             v.background = view.background
             v.name = view.view.name
             v.purchaseableId = design.id
             v.purchaseableName = design.name
             v.thumbnail = `${design.id}/preview/${view.view.name}.png`
             return v
         })

         dto.variations = variationList.map((variation) => {
            const pv = new PurchaseableVariationsDTO()
            pv.id = variation.id
            pv.name = variation.name
            pv.variations = variation.variationsCommaSeparated.split(",")
            return pv
         })

        result.push(dto)
    }
    response.send(result)
}