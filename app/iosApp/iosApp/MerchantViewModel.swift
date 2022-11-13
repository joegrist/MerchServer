import Foundation
import SwiftUI
import shared

class MerchantsViewModel: BaseViewModel {
        
    @Published private(set) var merchants = [MerchantDTO]()
    @Published var title = "Shops"
    @Published var loading = false
    
    override init() {
        super.init()
        refresh()
        ApiClient.shared.prefs = SharedPreference(context: NSObject())
    }
    
    func refresh() {
        ApiClient.shared.loadMerchants()
    }
    
    override func onCall() {
        super.onCall()
        loading = true
        showCurrent()
    }
    
    override func onCallEnd() {
        super.onCallEnd()
        loading = false
        showCurrent()
    }
    
    func showCurrent() {
        merchants = ApiClient.shared.merchants() as? [MerchantDTO] ?? []
    }
}
