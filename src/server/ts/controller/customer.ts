import { Request, Response } from "express"
import { ds } from "../../../common/dataSource"
import { Customer } from "../../../common/entity/customer"
import { CustomerDesign } from "../../../common/entity/customerDesign"
import { Design } from "../../../common/entity/design"
import { PurchaseDTO, CustomerDTO, PurchaseableDTO } from "./dto"
import { log, makeUuid } from "../../../config/globals"
import { IsNull } from "typeorm"

const customerRepo = ds.getRepository(Customer)
const cartRepo = ds.getRepository(CustomerDesign)
const designRepo = ds.getRepository(Design)

enum QuantityOperation {
    ADD = "ADD",
    SET = "SET"
}

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
        where: {
            customer : { email : customer.email },
            purchased : IsNull()
        }, 
        relations: ["design", "customer"]
    })

    for (let purchase of cart) {
        const p = new PurchaseDTO()
        const pp = new PurchaseableDTO()
        pp.id = purchase.design.id
        pp.name = purchase.design.name
        p.id = purchase.id
        p.quantity = purchase.quantity
        p.variation = purchase.variation
        p.purchaseable = pp
        result.cart.push(p)
    }

    // return loaded posts
    response.setHeader('content-type', 'application/json')

    log.obj(result)
    response.send(result)
}

export async function addEditCartItem(request: Request, response: Response) {

    let customerEmail = request.params["email"]
    let id: string | null | undefined = request.body.id
    let designId: number | null | undefined = parseInt(request.body.designId)
    let variation: string | null | undefined = request.body.variation
    let quantity: number = parseInt(request.body.quantity) ?? 0

    if (!designId) {
        throw new Error("must specify design id")
    }

    await storeCartItem(customerEmail, id, designId, quantity, QuantityOperation.ADD, variation)

    return getCustomer(request, response)
}

async function storeCartItem(customerEmail: string, id: string, designId: number, quantity: number, quantityOperation: QuantityOperation, variation: string) {
    let customer = await customerRepo.findOneBy({email : customerEmail})
    let design = await designRepo.findOneBy({id : designId})

    if (!customer || !design) {
        throw new Error("could not find customer or design (or both)")
    }

    log.log(`Add/Update Cart Item for ${customerEmail}: ${design.name} ${variation} ${quantity}`)
    const item = await ensureCartItem(id, customer, design, variation)
    item.design = design
    item.customer = customer

    if (quantityOperation == QuantityOperation.ADD) {
        item.quantity = item.quantity + quantity
    } else {
        item.quantity = quantity
    }

    log.log(`${design.name} ${quantityOperation} qty ${quantity} => new qty ${item.quantity}`)
    
    item.priceCents = design.priceCents
    if (variation) item.variation = variation

    await cartRepo.save(item)
}

async function ensureCartItem(id: string | null, customer: Customer, design: Design, variation: string) {

    if (id) {
        let cd = await cartRepo.findOneBy({id : id, purchased : IsNull()})
        log.log(`Found existing cart item with id ${id} for ${customer.email}`)
        if (cd) {
            return cd
        }
    }
    
    let cd = await cartRepo.findOneBy({design: design, variation: variation, customer: customer, purchased: IsNull()})
    if (cd) {
        log.log(`Found existing cart item with design ${design.name} variation ${variation} for ${customer.email}`)
        return cd
    }

    let newCd = new CustomerDesign()
    newCd.id = makeUuid()
    await cartRepo.save(newCd)
    return newCd
}

export async function login(request: Request, response: Response) {
    let customerEmail: string | null | undefined = request.body.email
    let password: string | null | undefined = request.body.password
    let customer = await customerRepo.findOneBy({email : customerEmail})

    if (!customer) {
        throw new Error("could not find customer")
    }

    const token = {
        "token" : customer.email
    }

    response.send(token);
}

export async function updateCart(request: Request, response: Response) {

    let email = request.params["email"]
    if (!email) throw new Error("email parameter was not found")

    let purchases = request.body as PurchaseDTO[]
    
    for (let purchase of purchases) {
        await storeCartItem(email, purchase.id, purchase.purchaseable.id, purchase.quantity, QuantityOperation.SET, purchase.variation)
    }

    return getCustomer(request, response)
}