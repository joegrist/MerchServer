import { Merchant } from "../../common/entity/merchant"
import { Product } from "../../common/entity/product"
import { Design } from "../../common/entity/design"
import { View } from "../../common/entity/view"
import { CustomerDesign } from "../../common/entity/customerDesign"
import { DesignView } from "../../common/entity/designView"
import { DataSource, Repository } from "typeorm"
import { log, makeUuid } from "../../config/globals"
import { Customer } from "../../common/entity/customer"
import { ProductVariation } from "../../common/entity/productVariation"
import { Supplier } from "../../common/entity/supplier"

var crypto = require('crypto'); 

export class DemoDataLoader {

    demoMerchantName = "Demo Inc"
    demoMerchantSlug = "demo"
    foundationMerchantName = "Van Demon Kyokushin"
    foundationMerchantSlug = "vdk"
    foundationProductName = "Mens Black Hoodie"
    foundationDesignName = "Gang Member Mens Hoodie"
    demoDesignName = "Cursor Hoodie"
    foundationCustomerEmail = "joe@joe.com"
    supplierName = "ID Clothing"
    supplierSlug = "ID"

    public async loadDemoData(ds: DataSource) {

        await this.ensureMerchant(ds, this.demoMerchantName, this.demoMerchantSlug)
        await this.ensureMerchant(ds, this.foundationMerchantName, this.foundationMerchantSlug)
        await this.ensureSupplier(ds, this.supplierName, this.supplierSlug)

        const supplier = await ds.getRepository(Supplier).findOneBy({slug: this.supplierSlug})
        await this.ensureProduct(ds, this.foundationProductName, supplier)
        
        const product = await ds.getRepository(Product).findOneBy({name: this.foundationProductName})
        await this.ensureView(ds, product, "Front")
        await this.ensureView(ds, product, "Back")
        await this.ensureVariations(ds, product)

        const merchant1 = await ds.getRepository(Merchant).findOneBy({slug: this.foundationMerchantSlug})
        const merchant2 = await ds.getRepository(Merchant).findOneBy({slug: this.demoMerchantSlug})
        await this.ensureDesign(ds, merchant1, this.foundationDesignName, 0x336699)
        await this.ensureDesign(ds, merchant2, this.demoDesignName, 0x996633)

        await this.enureCustomer(ds, "Joe", "1234", this.foundationCustomerEmail, "password")
        await this.enureCustomer(ds, "Craig", "5678", "craig@craig.com", "password")

        const customer = await ds.getRepository(Customer).findOneBy({email: this.foundationCustomerEmail})
        const design = await ds.getRepository(Design).findOneBy({name: this.demoDesignName})
        await this.addToCart(ds, customer, design)
    }

    async ensureMerchant(ds: DataSource, name: string, slug: string) {
        const merchants = ds.getRepository(Merchant)
        const m = await merchants.findOneBy({name: name})
        if (m) return
        log.log(`Adding Merchant ${name}`)
        const merchant = new Merchant()
        merchant.slug = slug
        merchant.name = name
        await merchants.save(merchant)
    }

    async ensureProduct(ds: DataSource, name: string, supplier: Supplier) {
        const products = ds.getRepository(Product)
        const p = await products.findOneBy({name: name})
        if (p) return
        log.log(`Adding Product ${name}`)
        const product = new Product()
        product.name = name
        product.supplier = supplier
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

    async addToCart(ds: DataSource, customer: Customer, design: Design) {
        const purchases = ds.getRepository(CustomerDesign)
        log.log(`Adding Cart Item '${design.name}' for ${customer.name}`)
        const purchase = new CustomerDesign()
        purchase.customer = customer
        purchase.design = design
        purchase.variation = "XL"
        purchase.quantity = 5
        purchase.priceCents = design.priceCents
        purchase.id = makeUuid()
        await purchases.save(purchase)
    }

    async ensureSupplier(ds: DataSource, name: string, slug: string) {
        const suppliers = ds.getRepository(Supplier)
        const s = await suppliers.findOneBy({slug: slug})
        if (s) return
        log.log(`Adding SUpplier ${name}`)
        const supplier = new Merchant()
        supplier.slug = slug
        supplier.name = name
        await suppliers.save(supplier)
    }
}