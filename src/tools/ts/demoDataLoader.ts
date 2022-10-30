import { Logger } from "../../common/logger"
import { Merchant } from "../../common/entity/merchant"
import { Product } from "../../common/entity/product"
import { Design } from "../../common/entity/design"
import { View } from "../../common/entity/view"
import { DataSource, Repository } from "typeorm"

export class DemoDataLoader {

    log = new Logger()
    demoMerchantName = "Demo Inc"
    foundationMerchantName = "Van Demon Kyokushin"
    foundationProductName = "Mens Black Hoodie"
    foundationDesignName = "Gang Member Mens Hoodie"

    public async loadDemoData(ds: DataSource) {
        const merchantRepo = ds.getRepository(Merchant)
        const productRepo = ds.getRepository(Product)
        const designRepo = ds.getRepository(Design)
        const viewRepo = ds.getRepository(View)
        await this.ensureMerchant(merchantRepo, this.demoMerchantName)
        await this.ensureMerchant(merchantRepo, this.foundationMerchantName)
        await this.ensureProduct(productRepo, this.foundationProductName)
        await this.ensureDesign(merchantRepo, productRepo, designRepo, this.foundationDesignName)
        let product = await productRepo.findOneBy({name: this.foundationProductName})
        await this.ensureView(viewRepo, product, "Front")
        await this.ensureView(viewRepo, product, "Back")
    }

    async ensureMerchant(merchants: Repository<Merchant>, name: string) {
        const m = await merchants.findOneBy({name: name})
        if (m) return
        this.log.log(`Adding Merchant ${name}`)
        const merchant = new Merchant()
        merchant.name = name
        await merchants.save(merchant)
    }

    async ensureProduct(products: Repository<Product>, name: string) {
        const p = await products.findOneBy({name: name})
        if (p) return
        this.log.log(`Adding Product ${name}`)
        const product = new Product()
        product.name = name
        await products.save(product)
    }

    async ensureDesign(merchants: Repository<Merchant>, products: Repository<Product>, designs: Repository<Design>, name: string) {

        const d = await designs.findOneBy({name: name})
        if (d) return

        const merchant = await merchants.findOneBy({name: this.foundationMerchantName})
        const product = await products.findOneBy({name: this.foundationProductName})
        
        this.log.log(`Adding Design ${name}`)
        const design = new Design()
        design.name = name
        design.product = product
        design.merchant = merchant
        await designs.save(design)
    }

    async ensureView(views: Repository<View>, product: Product, name: string) {
        const v = await views.findOneBy({name: name})
        if (v) return

        this.log.log(`Adding View ${name}`)
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
}