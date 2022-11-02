import { Merchant } from "../../common/entity/merchant"
import { Product } from "../../common/entity/product"
import { Design } from "../../common/entity/design"
import { View } from "../../common/entity/view"
import { DesignView } from "../../common/entity/designView"
import { DataSource, Repository } from "typeorm"
import { log } from "../../config/config"
import { Customer } from "../../common/entity/customer"
import { ProductVariation } from "../../common/entity/productVariation"

var crypto = require('crypto'); 

export class DemoDataLoader {

    demoMerchantName = "Demo Inc"
    foundationMerchantName = "Van Demon Kyokushin"
    foundationProductName = "Mens Black Hoodie"
    foundationDesignName = "Gang Member Mens Hoodie"
    demoDesignName = "Cursor Hoodie"

    public async loadDemoData(ds: DataSource) {

        await this.ensureMerchant(ds, this.demoMerchantName)
        await this.ensureMerchant(ds, this.foundationMerchantName)
        await this.ensureProduct(ds, this.foundationProductName)
        
        const product = await ds.getRepository(Product).findOneBy({name: this.foundationProductName})
        await this.ensureView(ds, product, "Front")
        await this.ensureView(ds, product, "Back")
        await this.ensureVariations(ds, product)

        const merchant1 = await ds.getRepository(Merchant).findOneBy({name: this.foundationMerchantName})
        const merchant2 = await ds.getRepository(Merchant).findOneBy({name: this.demoMerchantName})
        await this.ensureDesign(ds, merchant1, this.foundationDesignName, 0x336699)
        await this.ensureDesign(ds, merchant2, this.demoDesignName, 0x996633)

        await this.enureCustomer(ds, "Joe", "1234", "joe@joe.com", "password")
        await this.enureCustomer(ds, "Craig", "5678", "craig@craig.com", "password")
    }

    async ensureMerchant(ds: DataSource, name: string) {
        const merchants = ds.getRepository(Merchant)
        const m = await merchants.findOneBy({name: name})
        if (m) return
        log.log(`Adding Merchant ${name}`)
        const merchant = new Merchant()
        merchant.name = name
        await merchants.save(merchant)
    }

    async ensureProduct(ds: DataSource, name: string) {
        const products = ds.getRepository(Product)
        const p = await products.findOneBy({name: name})
        if (p) return
        log.log(`Adding Product ${name}`)
        const product = new Product()
        product.name = name
        await products.save(product)
    }

    async ensureDesign(ds: DataSource, merchant: Merchant, name: string, background: number) {
        const designs = ds.getRepository(Design)
        const products = ds.getRepository(Product)
        const viewList = ds.getRepository(View)
        const designViewList = ds.getRepository(DesignView)
        const d = await designs.findOneBy({name: name})
        if (d) return

        const product = await products.findOneBy({name: this.foundationProductName})
        log.log(`Adding Design ${name}`)
        const design = new Design()
        design.name = name
        design.product = product
        design.merchant = merchant
        design.priceCents = 5000
        
        await designs.save(design)

        const views = await viewList.findBy({product: product})
        views.forEach (view => {
            log.log(`Adding Design View ${name} ${view.name}`)
            const dv = new DesignView()
            dv.background = background
            dv.view = view
            dv.design = design
            designViewList.save(dv)
        })
    }

    async ensureView(ds: DataSource, product: Product, name: string) {
        const views = ds.getRepository(View)
        const v = await views.findOneBy({name: name})
        if (v) return

        log.log(`Adding View ${name}`)
        const view = new View()
        view.product = product
        view.name = name
        view.productIllustrationHeightPx = 2000
        view.productIllustrationWidthPx = 1000
        view.printAreaOriginXPx = 100
        view.printAreaOriginYPx = 100
        view.printAreaWidthPx = 1800
        view.printAreaHeightPx = 800
        view.printAreaWidthMm = 0
        view.printAreaHeightMm = 0
        await views.save(view)
    }

    async enureCustomer(ds: DataSource, name: string, phone: string, email: string, password: string) {
        const customers = ds.getRepository(Customer)
        const salt = crypto.randomBytes(16).toString('hex')
        const hash = crypto.pbkdf2Sync(password, salt,  1000, 64, `sha512`).toString(`hex`)

        log.log(`Adding Customer ${name}`)
        const c = new Customer()
        c.name = name
        c.mobile = phone
        c.email = email
        c.salt = salt
        c.password = hash
        await customers.save(c)
    }

    async ensureVariations(ds: DataSource, product: Product) {
        const variations = ds.getRepository(ProductVariation)

        log.log(`Adding Variations to ${product.name}`)
        const pv = new ProductVariation()
        pv.product = product
        pv.name = "Size"
        pv.variationsCommaSeparated = "S,M,L,XL,XXL"
        await variations.save(pv)
    }
}