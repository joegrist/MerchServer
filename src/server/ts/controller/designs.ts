import {Request, Response} from "express";
import {ds} from "../../../common/dataSource"
import {Design} from "../../../common/entity/design";

class DesignDTO {
    id: number
    name: string
    thumbnail: string
}

export async function listDesignsForMerchant(request: Request, response: Response) {

    const designs = ds.getRepository(Design)
    let id = parseInt(request.params["merchantId"])
    if (!id) throw new Error("id parameter was not numeric")

    const designList = await designs.find({
        where: {
            merchant: {
                id: id
            }
        },
        relations: ["product"]
    })

    let result = new Array<DesignDTO>()
    designList.forEach(design => {
        const dto = new DesignDTO()
        dto.id = design.id
        dto.name = design.name
        dto.thumbnail = `${design.id}/src.png`
        result.push(dto)
    });
    response.send(result);
}