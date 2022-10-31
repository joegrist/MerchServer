import Foundation
import shared

class MerchantsViewModel: ObservableObject, IObserver {
    
    @Published private(set) var merchants = [DataMerchant]()
    @Published private(set) var merchantsLoading = false
    @Published var greet = Greeting().greeting()
    
    private let client = ApiClient()
    
    init() {
        client.add(observer: self)
        showCurrent()
        client.loadMerchants()
        update()
    }
    
    @objc func update() {
        
        guard !client.loadingMerchants else {
            merchantsLoading = true
            showCurrent()
            return
        }
        
        merchantsLoading = false
        greet = "Count: \(client.merchants().count)"
    }
    
    func showCurrent() {
        merchants = client.merchants() as? [DataMerchant] ?? []
    }
}
