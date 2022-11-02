import Foundation
import shared

struct Thumbnail {
    var name: String
    var thumbnail: String
    var id: Int64
}

class PurchaseableViewModel: ObservableObject {
    var purchaseableId: Int64
    @Published var name: String
    @Published var thumbnails: [Thumbnail] = []
    
    private let client = ApiClient()
    
    init(purchaseableId: Int64) {
        self.purchaseableId = purchaseableId
        let p = client.purchaseable(id: purchaseableId)
        name = p.name
        p.views.forEach { view in
            guard let v = view as? PurchaseableViewDTO else { return }
            thumbnails.append(Thumbnail(name: v.name, thumbnail: v.thumbnail, id: v.id))
        }
    }
}
