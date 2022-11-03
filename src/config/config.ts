import { Logger } from "../common/logger"
import Stripe from 'stripe'

const { v4: uuidv4} = require('uuid')
const root = "img/"

export const log = new Logger()
export const IMAGE_VIEW = `${root}view`
export const IMAGE_DESIGN = `${root}design`
export const DB_USERNAME = "root"
export const DB_PASSWORD = "root"
export const DB_NAME = "merch_server"
export const DB_HOST = "localhost"
export const DB_PORT = 8889
export const STRIPE_BASE = "https://api.stripe.com"
const STRIPE_TEST_SSK = 'ssk_test_51LzAupLTMDQ2GHFnvQW4fi7Mt8TxOpbxyuyURKS3ZGiEbEbvKCYNdDBEhA8IuYQr2XTCyJrsQrAwDZqUATqpO9Bk00uozWlXiI'
const STRIPE_API_VERSION = '2022-08-01'
export const stripe = new Stripe(STRIPE_TEST_SSK, { apiVersion: STRIPE_API_VERSION })

export function makeUuid() {
    return uuidv4()
}