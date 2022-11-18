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
    var purchase: PurchaseDTO
}

class PurchaseableViewModel: BaseViewModel {
    var purchaseableId: Int64
    @Published var thumbnails: [Thumbnail] = []
    @Published var variants: [Variant] = []
    @Published var title: String = ""
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
    
    func inc(purchase: PurchaseDTO) {
        ApiClient.shared.incQuantity(purchase: purchase)
        ApiClient.shared.postCart()

    }
    
    func dec(purchase: PurchaseDTO) {
        ApiClient.shared.decQuantity(purchase: purchase)
        ApiClient.shared.postCart()
    }
    
    override func onCallEnd() {
        update()
    }
    
    func update() {
        title = p.name
        let variation = p.variations.firstObject as? PurchaseableVariationDTO
        let options = variation?.options.components(separatedBy: ",")
        
        p.views.forEach { view in
            guard let v = view as? PurchaseableViewDTO else { return }
            thumbnails.append(Thumbnail(name: v.name, thumbnail: v.thumbnail, id: v.id))
        }
        
        variants.removeAll(keepingCapacity: true)
        
        if let o = options {
            for (index, item) in o.enumerated() {
                if let p = ApiClient.shared.purchase(purchaseableId: purchaseableId, variation: item) {
                    variants.append(Variant(
                        name: item,
                        id: Int64(index),
                        purchase: p)
                    )
                }
            }
        }
    }
}
