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
}

class PurchaseableViewModel: BaseViewModel {
    var purchaseableId: Int64
    @Published var thumbnails: [Thumbnail] = []
    @Published var variants: [Variant] = []
    @Published var title: String
    private let client = ApiClient()
    
    init(purchaseableId: Int64) {
        
        self.purchaseableId = purchaseableId
        let p = client.purchaseable(id: purchaseableId)
        title = p.name
        let variation = p.variations.firstObject as? PurchaseableVariationDTO
        let options = variation?.options.components(separatedBy: ",")
        super.init()
        
        p.views.forEach { view in
            guard let v = view as? PurchaseableViewDTO else { return }
            thumbnails.append(Thumbnail(name: v.name, thumbnail: v.thumbnail, id: v.id))
        }
        
        if let o = options {
            for (index, item) in o.enumerated() {
                variants.append(Variant(name: item, id: Int64(index)))
            }
        }
    }
}
