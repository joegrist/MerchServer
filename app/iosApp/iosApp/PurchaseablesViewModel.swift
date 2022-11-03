import Foundation
import shared

class PurchaseablesViewModel: ObservableObject, IObserver {
    
    @Published private(set) var purchaseables = [PurchaseableDTO]()
    @Published private(set) var purchaseablesLoading = false
    @Published var greet = Greeting().greeting()
    var merchantSlug: String
    
    private let client = ApiClient()
    
    init(merchantSlug: String) {
        self.merchantSlug = merchantSlug
        client.add(observer: self)
        update()
        client.loadPurchaseables(merchantSlug: merchantSlug)
    }
    
    @objc func update() {
        
        func showCurrent() {
            purchaseables = client.purchaseables(merchantSlug: merchantSlug) as? [PurchaseableDTO] ?? []
        }
        
        guard !client.operationInProgress else {
            purchaseablesLoading = true
            showCurrent()
            return
        }
        
        purchaseablesLoading = false
        greet = "Count: \(client.purchaseables(merchantSlug: merchantSlug).count)"
        showCurrent()
    }
}
