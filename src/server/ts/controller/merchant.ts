import {Request, Response} from "express"
import {Merchant} from "../../../common/entity/merchant"
import {ds} from "../../../common/dataSource"

const repo = ds.getRepository(Merchant)

export async function listAllMerchants(request: Request, response: Response) {
    const shops = await repo.find()
    response.setHeader('content-type', 'application/json')
    response.send(shops)
}