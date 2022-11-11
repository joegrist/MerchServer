import Foundation
import SwiftUI
import shared

class MerchantsViewModel: ObservableObject, IObserver {
        
    @Published private(set) var merchants = [MerchantDTO]()
    @Published private(set) var merchantsLoading = false
    @Published var title = "Shops"
    
    private let client = ApiClient()
    
    init() {
        client.add(observer: self)
        refresh()
    }
    
    func refresh() {
        client.loadMerchants()
    }
    
    func onCall() {
        merchantsLoading = true
        showCurrent()
    }
    
    func onCallEnd() {
        merchantsLoading = false
        showCurrent()
    }
    
    func showCurrent() {
        merchants = client.merchants() as? [MerchantDTO] ?? []
    }
}
