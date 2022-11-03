const { v4: uuidv4} = require('uuid')
import Stripe from "stripe"
import {makeUuid, stripe, log} from "../../config/config"

export class StripePayment {

    currency = "aud"
    source = "tok_amex" // obtained with Stripe.js
    key = makeUuid()
    cents = 0
    failed = false
    
    async go() {
        return this.process()
    }

    private process() {
        return new Promise((resolve, reject) => {
            stripe.charges.create({
                amount: this.cents / 100,
                currency: this.currency,
                source: this.source,
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