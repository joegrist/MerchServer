import Foundation
import shared

class PurchaseablesViewModel: ObservableObject, IObserver {
    
    @Published private(set) var purchaseables = [PurchaseableDTO]()
    @Published private(set) var purchaseablesLoading = false
    @Published var greet = Greeting().greeting()
    
    private let client = ApiClient()
    
    init() {
        client.add(observer: self)
        showCurrent()
        client.loadPurchaseables(merchantId: 1)
        update()
    }
    
    @objc func update() {
        
        guard !client.operationInProgress else {
            purchaseablesLoading = true
            showCurrent()
            return
        }
        
        purchaseablesLoading = false
        greet = "Count: \(client.purchaseables(merchantId: 1).count)"
    }
    
    func showCurrent() {
        purchaseables = client.purchaseables(merchantId: 1) as? [PurchaseableDTO] ?? []
    }
}
