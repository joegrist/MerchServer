import Foundation
import shared

class MerchantsViewModel: ObservableObject, IObserver {
    
    @Published private(set) var merchants = [MerchantDTO]()
    @Published private(set) var merchantsLoading = false
    @Published var greet = Greeting().greeting()
    
    private let client = ApiClient()
    
    init() {
        client.add(observer: self)
        update()
        client.loadMerchants()
    }
    
    @objc func update() {
        
        func showCurrent() {
            merchants = client.merchants() as? [MerchantDTO] ?? []
        }
        
        guard !client.operationInProgress else {
            merchantsLoading = true
            showCurrent()
            return
        }
        
        merchantsLoading = false
        greet = "Count: \(client.merchants().count)"
        showCurrent()
    }
}
