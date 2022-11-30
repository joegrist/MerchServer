import { Logger } from "../common/logger"
import Stripe from 'stripe'
import { Config } from "./config"

const { v4: uuidv4} = require('uuid')
const STRIPE_TEST_KEY_SECRET = 'sk_test_51LzAupLTMDQ2GHFnvQW4fi7Mt8TxOpbxyuyURKS3ZGiEbEbvKCYNdDBEhA8IuYQr2XTCyJrsQrAwDZqUATqpO9Bk00uozWlXiI'
const STRIPE_API_VERSION = '2022-08-01'

export function makeUuid() {
    return uuidv4()
}

export const log = new Logger()
export const stripe = new Stripe(STRIPE_TEST_KEY_SECRET, { apiVersion: STRIPE_API_VERSION })
export const config = new Config()