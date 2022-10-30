import {Request, Response} from "express";
import {Design} from "../../../common/entity/design";
import {Product} from "../../../common/entity/product";
import {View} from "../../../common/entity/view";
import {ds} from "../../../common/dataSource"

class DesignResponse {
    design: Design
    views: View[]
    product: Product
}

export async function getDesign(request: Request, response: Response) {

    // get repos
    const designs = ds.getRepository(Design)
    const products = ds.getRepository(Product)
    const views = ds.getRepository(View)

    // load design
    let id = parseInt(request.params["id"])
    if (!id) throw new Error("id paramater was not numeric")
    const design = await designs.findOne({
        where: {id : id},
        relations: ["product"]
    })
    const product = design.product
    const viewList = await views.find({
        where: {product : design.product}
    })

    // return data
    let result = new DesignResponse
    result.design = design
    result.views = viewList
    response.send(result);
}