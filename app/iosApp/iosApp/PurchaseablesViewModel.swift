import Foundation
import shared

class PurchaseablesViewModel: ObservableObject, IObserver {

    
    @Published private(set) var purchaseables = [PurchaseableDTO]()
    @Published private(set) var purchaseablesLoading = false
    @Published var title: String
    var merchantSlug: String
    
    private let client = ApiClient()
    
    init(merchantSlug: String) {
        self.merchantSlug = merchantSlug
        let merchant = ApiClient.shared.merchant(slug: merchantSlug)
        title = merchant?.name ?? "Purchaseables"
        client.add(observer: self)
        refresh()
    }
    
    func refresh() {
        client.loadPurchaseables(merchantSlug: merchantSlug)
    }
    
    func onCall() {
        purchaseablesLoading = true
        showCurrent()
    }
    
    func onCallEnd() {        
        purchaseablesLoading = false
        showCurrent()
    }
    
    func showCurrent() {
        purchaseables = client.purchaseables(merchantSlug: merchantSlug) as? [PurchaseableDTO] ?? []
    }
}
