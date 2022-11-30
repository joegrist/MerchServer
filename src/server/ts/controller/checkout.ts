import { StripePaymentIntent } from "../stripe"
import { Request, Response } from "express"
import { Customer } from "../../../common/entity/customer"
import { CustomerDesign } from "../../../common/entity/customerDesign"
import { ds } from "../../../common/dataSource"
import { config, log } from "../../../config/globals"
import { getCustomer } from "./customer"

export async function getPaymentIntent(request: Request, response: Response) {
    let cents: string | null | undefined = request.body.cents
    const stripePaymentIntent = await StripePaymentIntent.make(parseInt(cents))
    response.setHeader('content-type', 'application/json')
    const result = {
        paymentIntent: stripePaymentIntent.client_secret,
        publishableKey: config.STRIPE_TEST_KEY_PUBLISHABLE
    }
    log.log(`Payment intent created:`)
    log.obj(result)
    response.send(result)
}

export async function afterPurchase(request: Request, response: Response) {

    const customerRepo = ds.getRepository(Customer)
    const cartRepo = ds.getRepository(CustomerDesign)
    let customerEmail = request.params["email"]


    let customer = await customerRepo.findOneBy({email : customerEmail})
    let purchases = await cartRepo.findBy({customer : { email : customer.email}, purchased : null})
    let cost = 0

    purchases.forEach(purchase => {
        cost += purchase.priceCents
    })

    purchases.forEach(purchase => {
        purchase.purchased = new Date()
        cartRepo.save(purchase)
    })

    return getCustomer(request, response)
}