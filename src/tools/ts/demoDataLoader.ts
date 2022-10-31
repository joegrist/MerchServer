import { Logger } from "../../common/logger"
import { Merchant } from "../../common/entity/merchant"
import { Product } from "../../common/entity/product"
import { Design } from "../../common/entity/design"
import { View } from "../../common/entity/view"
import { DesignView } from "../../common/entity/designView"
import { DataSource, Repository } from "typeorm"

export class DemoDataLoader {

    log = new Logger()
    demoMerchantName = "Demo Inc"
    foundationMerchantName = "Van Demon Kyokushin"
    foundationProductName = "Mens Black Hoodie"
    foundationDesignName = "Gang Member Mens Hoodie"
    demoDesignName = "Cursor Hoodie"

    public async loadDemoData(ds: DataSource) {
        const merchantRepo = ds.getRepository(Merchant)
        const productRepo = ds.getRepository(Product)
        const designRepo = ds.getRepository(Design)
        const viewRepo = ds.getRepository(View)
        const designViewRepo = ds.getRepository(DesignView)
        await this.ensureMerchant(merchantRepo, this.demoMerchantName)
        await this.ensureMerchant(merchantRepo, this.foundationMerchantName)
        await this.ensureProduct(productRepo, this.foundationProductName)
        
        let product = await productRepo.findOneBy({name: this.foundationProductName})
        await this.ensureView(viewRepo, product, "Front")
        await this.ensureView(viewRepo, product, "Back")

        const merchant1 = await merchantRepo.findOneBy({name: this.foundationMerchantName})
        await this.ensureDesign(merchant1, viewRepo, designViewRepo, productRepo, designRepo, this.foundationDesignName, 0x336699)

        const merchant2 = await merchantRepo.findOneBy({name: this.demoMerchantName})
        await this.ensureDesign(merchant2, viewRepo, designViewRepo, productRepo, designRepo, this.demoDesignName, 0x996633)
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

    async ensureDesign(merchant: Merchant, viewList: Repository<View>, designViewList: Repository<DesignView>, products: Repository<Product>, designs: Repository<Design>, name: string, background: number) {

        const d = await designs.findOneBy({name: name})
        if (d) return

        const product = await products.findOneBy({name: this.foundationProductName})
        this.log.log(`Adding Design ${name}`)
        const design = new Design()
        design.name = name
        design.product = product
        design.merchant = merchant
        
        await designs.save(design)

        const views = await viewList.findBy({product: product})
        views.forEach (view => {
            this.log.log(`Adding Design View ${name} ${view.name}`)
            const dv = new DesignView()
            dv.background = background
            dv.view = view
            dv.design = design
            designViewList.save(dv)
        })
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