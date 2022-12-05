import { Request, Response } from "express"
import { ds } from "../../../common/dataSource"
import { Design } from "../../../common/entity/design"
import { DesignView } from "../../../common/entity/designView"
import { ProductVariation } from "../../../common/entity/productVariation"
import { PurchaseableDTO, PurchaseableViewDTO, PurchaseableVariationsDTO } from "./dto"

const designs = ds.getRepository(Design)
const views = ds.getRepository(DesignView)
const variations = ds.getRepository(ProductVariation)

export async function listDesignsForMerchant(request: Request, response: Response) {

    let slug = request.params["slug"]
    if (!slug) throw new Error("id parameter was not numeric")

    const designList = await designs.find({
        where: { merchant: { slug: slug } },
        relations: ["merchant", "product", "product.supplier"]
    })

    let result = new Array<PurchaseableDTO>()
    for (const design of designList) {
        const dto = new PurchaseableDTO()
        dto.id = design.id
        dto.name = design.name
        dto.merchantSlug = design.merchant.slug
        dto.purchaseableId = design.id
        dto.purchaseableName = design.name
        dto.thumbnail = `${design.id}/src.png`
        dto.priceCents = design.priceCents
        dto.productId = design.product.id
        dto.productName = design.product.name
        dto.supplierName = design.product.supplier.name
        dto.supplierThumbnail = `supplier/${design.product.supplier.slug}.svg`
        
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
             v.thumbnail = `${design.id}/preview/${view.view.name}.png`
             return v
         })

         dto.variations = variationList.map((variation) => {
            const pv = new PurchaseableVariationsDTO()
            pv.id = variation.id
            pv.name = variation.name
            pv.options = variation.variationsCommaSeparated
            return pv
         })

        result.push(dto)
    }
    response.send(result)
}