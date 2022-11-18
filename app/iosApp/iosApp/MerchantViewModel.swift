import Foundation
import SwiftUI
import shared

class MerchantsViewModel: BaseViewModel {
        
    @Published private(set) var merchants = [MerchantDTO]()
    @Published var title = "Shops"
    @Published var loading = false
    @Published var showingCheckoutFailed = false
    @Published var showingCheckoutSucceeded = false
    
    private var initialUserLoadNeeded = false
    
    private var prefs = SharedPreference(context: NSObject())
    
    override init() {
        super.init()
        ApiClient.shared.initialLoad()
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
        if (initialUserLoadNeeded) {
            
        } else {
            loading = false
        }
        showCurrent()
    }
    
    override func onEvent(event: AppEvent) {
        super.onEvent(event: event)
        switch(event) {
        case AppEvent.purchasefailed:
            showingCheckoutFailed = true
        case AppEvent.purchasecompleted:
            showingCheckoutSucceeded = true
        default:
            break
        }
    }
    
    func showCurrent() {
        merchants = ApiClient.shared.merchants() as? [MerchantDTO] ?? []
    }
}
