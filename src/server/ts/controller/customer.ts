import {Request, Response} from "express";
import {ds} from "../../../common/dataSource"
import { Customer } from "../../../common/entity/customer"
import { CustomerDesign } from "../../../common/entity/customerDesign"
import { PurchaseDTO, CustomerDTO, PurchaseableDTO } from "./dto"

const customerRepo = ds.getRepository(Customer);
const cartRepo = ds.getRepository(CustomerDesign);

export async function getCustomer(request: Request, response: Response) {

    let email = request.params["email"]
    if (!email) throw new Error("email parameter was not found")

    const customer = await customerRepo.findOneBy({email: email})
    if (!customer) throw new Error("customer email not found")

    const result = new CustomerDTO()
    result.cart = []
    result.name = customer.name
    result.email = customer.email
    result.mobile = customer.mobile

    const cart = await cartRepo.find({
        where: {customer : { email : customer.email } }, 
        relations: ["design", "customer"]
    })

    cart.forEach(purchase => {
        const p = new PurchaseDTO()
        const pp = new PurchaseableDTO()
        pp.id = purchase.design.id
        pp.name = purchase.design.name
        p.id = purchase.id
        p.purchaseable = pp
        result.cart.push(p)
    })

    // return loaded posts
    response.setHeader('content-type', 'application/json')
    response.send(result)
}