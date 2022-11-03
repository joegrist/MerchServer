import { Request, Response } from "express"
import { ds } from "../../../common/dataSource"
import { Customer } from "../../../common/entity/customer"
import { CustomerDesign } from "../../../common/entity/customerDesign"
import { Design } from "../../../common/entity/design"
import { PurchaseDTO, CustomerDTO, PurchaseableDTO } from "./dto"
import { log } from "../../../config/config"

const customerRepo = ds.getRepository(Customer)
const cartRepo = ds.getRepository(CustomerDesign)
const designRepo = ds.getRepository(Design)

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

export async function addEditCartItem(request: Request, response: Response) {

    let id: string | null | undefined = request.body.id
    let customerEmail: string | null | undefined = request.body.customerEmail
    let designId: number | null | undefined = request.body.designId
    let variation: string | null | undefined = request.body.variation

    if (!customerEmail || !designId) {
        throw new Error("must specify customer email and design id")
    }

    let customer = await customerRepo.findOneBy({email : customerEmail})
    let design = await designRepo.findOneBy({id : designId})


    if (!customer || !design) {
        throw new Error("could not find customer or design (or both)")
    }

    const item = await ensureCartItem(id)
    item.design = design
    item.customer = customer
    if (item.variation) item.variation = variation
    await cartRepo.save(item)
    log.log(request.body)
}

async function ensureCartItem(id: string) {
    if (id) {
        let cd = await cartRepo.findOneBy({id : id})
        if (cd) {
            return cd
        }
    }
    let cd = new CustomerDesign()
    cd.id = cd.makeId()
    await cartRepo.save(cd)
    return cd
}