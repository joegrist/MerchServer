import Foundation
import shared

class PurchaseablesViewModel: ObservableObject, IObserver {
    
    @Published private(set) var purchaseables = [PurchaseableDTO]()
    @Published private(set) var purchaseablesLoading = false
    @Published var greet = Greeting().greeting()
    var merchantId: Int64
    
    private let client = ApiClient()
    
    init(merchantId: Int64) {
        self.merchantId = merchantId
        client.add(observer: self)
        update()
        client.loadPurchaseables(merchantId: merchantId)
    }
    
    @objc func update() {
        
        func showCurrent() {
            purchaseables = client.purchaseables(merchantId: merchantId) as? [PurchaseableDTO] ?? []
        }
        
        guard !client.operationInProgress else {
            purchaseablesLoading = true
            showCurrent()
            return
        }
        
        purchaseablesLoading = false
        greet = "Count: \(client.purchaseables(merchantId: merchantId).count)"
        showCurrent()
    }
}
