const { v4: uuidv4} = require('uuid')
import Stripe from "stripe"
import { Customer } from "../../common/entity/customer"
import { makeUuid, stripe, log } from "../../config/globals"

export class StripePaymentIntent {

    static make(cents: number) {
        return new Promise<Stripe.PaymentIntent>((resolve, reject) => {
            stripe.paymentIntents.create({
                amount: cents,
                currency: 'aud',
                automatic_payment_methods: {
                    enabled: true,
                }
            }).then((pi) => {
                resolve(pi)
            }).catch((err) => {
                reject(err)
                log.err("Failure creating payment intent", err)
            })
        })
    }
}

export class StripeCustomer {

    key = makeUuid()

    constructor(private customer: Customer) {
    }

    async ensure() {
        return new Promise<Stripe.Customer>((resolve, reject) => {

            let make = () => {
                this.create().then((c) => {
                    log.log(`Stripe: Created customer for ${this.customer.email}: ${c.id}`)
                    resolve(c)
                }).catch((error) => {
                    reject(error)
                    log.err("Could not create customer", error)
                })
            }

            if (this.customer.stripeId.length > 0) {
                log.log(`Customer ${this.customer.email} has a stripe ID: ${this.customer.stripeId}`)
                this.retrieve().then((c) => {
                    log.log(`Stripe: Found existing customer for ${this.customer.email}: ${c.id})`)
                    if (c.deleted) {
                        log.log(`Customer ${c.id} is deleted.  Need to make a new one.`)
                        make()
                    } else {
                        resolve(c as Stripe.Customer)
                    }
                }).catch((err) => {
                    make()
                })
            }

        })
    }

    private retrieve() {
        return stripe.customers.retrieve(this.customer.stripeId)
    }

    private create() {
        return stripe.customers.create({
            description: `Auto Created for ${this.customer.name} ${this.customer.email}`,
            name: this.customer.name,
            email: this.customer.email
        }, {
            idempotencyKey: this.key
        })
    }
}

export class StripePayment {

    currency = "aud"
    source = "tok_amex" // obtained with Stripe.js
    key = makeUuid()
    cents = 0
    failed = false
    customer = ""
    
    async go() {
        return this.process()
    }

    private process() {
        return new Promise<Stripe.Charge>((resolve, reject) => {
            stripe.charges.create({
                amount: this.cents / 100,
                currency: this.currency,
                source: this.source,
                customer: this.customer,
                description: "My First Test Charge (created for API docs at https://www.stripe.com/docs/api)"
            }, {
                idempotencyKey: this.key
            }).then(
                (charge) => {
                    log.log("Payment worked")
                    this.failed = false
                    resolve(charge)
                },
                (failReason) => {
                    log.err(this.describe(failReason), failReason)
                    this.failed = true
                    reject(failReason)
                }
            )
        })
    }

    describe(err: Stripe.errors.StripeError) {
        switch (err.type) {
        case 'StripeCardError':
            // A declined card error
            return "Declined" // => e.g. "Your card's expiration year is invalid."
        case 'StripeRateLimitError':
            return "Server too busy"// Too many requests made to the API too quickly
        case 'StripeInvalidRequestError':
            return "Programmer Error" // Invalid parameters were supplied to Stripe's API
        case 'StripeAPIError':
            return "Internal Error at Stripe" // An error occurred internally with Stripe's API
        case 'StripeConnectionError':
            return "Connection Error" // Some kind of error occurred during the HTTPS communication
        case 'StripeAuthenticationError':
            return "Programmer Error: Authentication" // You probably used an incorrect API key
        default:
            return "Unknown Error" // Handle any other types of unexpected errors
        }
    }
}