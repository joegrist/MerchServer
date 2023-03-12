import { Request, Response } from "express"
import { ds } from "../../../common/dataSource"
import { CustomerDesign } from "../../../common/entity/customerDesign"
import { IsNull, Not } from "typeorm"

const orderRepo = ds.getRepository(CustomerDesign)

export async function orders(request: Request, response: Response) {
    const orders = await orderRepo.find({
        where: {purchased : Not(IsNull())},
        relations: ["design", "customer"]
    })
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200")
    response.send(orders)
}

export async function fulfil(request: Request, response: Response) {
    let orders: string | null | undefined = request.body.orders
    let fulfilled: string | null | undefined = request.body.fulfilled
    response.send(true)
}