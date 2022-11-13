import Foundation
import shared

class PurchaseablesViewModel: BaseViewModel {

    
    @Published private(set) var purchaseables = [PurchaseableDTO]()
    @Published private(set) var purchaseablesLoading = false
    @Published var title: String
    var merchantSlug: String
    
    private let client = ApiClient()
    
    init(merchantSlug: String) {
        
        self.merchantSlug = merchantSlug
        let merchant = ApiClient.shared.merchant(slug: merchantSlug)
        title = merchant?.name ?? "Purchaseables"
        
        super.init()
        
        refresh()
    }
    
    func refresh() {
        client.loadPurchaseables(merchantSlug: merchantSlug)
    }
    
    override func onCall() {
        super.onCall()
        purchaseablesLoading = true
        showCurrent()
    }
    
    override func onCallEnd() {
        super.onCallEnd()
        purchaseablesLoading = false
        showCurrent()
    }
    
    func showCurrent() {
        purchaseables = client.purchaseables(merchantSlug: merchantSlug) as? [PurchaseableDTO] ?? []
    }
}
