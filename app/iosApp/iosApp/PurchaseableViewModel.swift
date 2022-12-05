import Foundation
import shared

struct Thumbnail {
    var name: String
    var thumbnail: String
    var id: Int64
}

struct Variant {
    var name: String
    var id: Int64
    var quantity: Int64
    var purchaseableId: Int64
}

class PurchaseableViewModel: BaseViewModel {
    var purchaseableId: Int64
    @Published var thumbnails: [Thumbnail] = []
    @Published var variants: [Variant] = []
    @Published var title: String = ""
    @Published var supplerName: String = ""
    @Published var supplerLogo: String = ""
    private let client = ApiClient()
    
    init(purchaseableId: Int64) {
        self.purchaseableId = purchaseableId
        super.init()
        update()
    }
    
    var p: PurchaseableDTO {
        get {
            return client.purchaseable(id: purchaseableId)
        }
    }
    
    func inc(purchaseableId: Int64, variation: String) {
        if let purchase = ApiClient.shared.purchase(purchaseableId: purchaseableId, variation: variation) {
            ApiClient.shared.incQuantity(purchase: purchase)
        } else {
            ApiClient.shared.setCartPurchase(purchaseableId: purchaseableId, variation: variation, quantity: 1)
        }
        ApiClient.shared.postCart()
    }
    
    func dec(purchaseableId: Int64, variation: String) {
        if let purchase = ApiClient.shared.purchase(purchaseableId: purchaseableId, variation: variation) {
            ApiClient.shared.decQuantity(purchase: purchase)
            ApiClient.shared.postCart()
        }
    }
    
    override func onCallEnd() {
        update()
    }
    
    func update() {
        title = p.name
        supplerName = p.supplierName
        supplerLogo = "http://merch.zapto.org:8888/supplier/\(p.supplierSlug).svg"
        let variation = p.variations.firstObject as? PurchaseableVariationDTO
        let options = variation?.options.components(separatedBy: ",")
        
        p.views.forEach { view in
            guard let v = view as? PurchaseableViewDTO else { return }
            thumbnails.append(Thumbnail(name: v.name, thumbnail: v.thumbnail, id: v.id))
        }
        
        variants.removeAll(keepingCapacity: true)
        
        if let o = options {
            for (index, item) in o.enumerated() {
                let qty = ApiClient.shared.cartVariantQuantity(purchaseableId: purchaseableId, variant: item)
                variants.append(Variant(
                    name: item,
                    id: Int64(index),
                    quantity: qty,
                    purchaseableId: purchaseableId)
                )
            }
        }
    }
}
