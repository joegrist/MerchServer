const root = "img/"

export interface Configuration {
    IMAGE_VIEW: string
    IMAGE_DESIGN: string
    DB_USERNAME: string
    DB_PASSWORD: string
    DB_NAME: string
    DB_HOST: string
    DB_PORT: number
    STRIPE_BASE: string
    STRIPE_KEY: string
    API_SSL_PASSPHRASE: string
    PWA_SSL_PASSPHRASE: string
}

export class DevConfiguration implements Configuration {    
    IMAGE_VIEW = `${root}view`
    IMAGE_DESIGN = `${root}design`
    DB_USERNAME = "root"
    DB_PASSWORD = "root"
    DB_NAME = "merch_server"
    DB_HOST = "localhost"
    DB_PORT = 8889
    STRIPE_BASE = "https://api.stripe.com"
    STRIPE_KEY = process.env.STRIPE_TEST_KEY_PUBLISHABLE
    API_SSL_PASSPHRASE = process.env.API_SSL_PASSPHRASE
    PWA_SSL_PASSPHRASE = process.env.PWA_SSL_PASSPHRASE
}