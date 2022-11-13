import Foundation
import SwiftUI
import shared

class CartViewModel: BaseViewModel {
    
    @Published private(set) var purchases: [PurchaseDTO] = []
    @Published var title = "Cart"
    @Published var cartTotal = "$0.00"
    
    override init() {
        super.init()
        update()
    }
    
    override func onCall() {
        super.onCall()
    }
    
    override func onCallEnd() {
        super.onCallEnd()
    }
    
    func inc(purchase: PurchaseDTO) {
        ApiClient.shared.incQuantity(p: purchase)
        update()
    }
    
    func dec(purchase: PurchaseDTO) {
        ApiClient.shared.decQuantity(p: purchase)
        update()
    }
    
    func saveCart() {
        
    }
    
    func update() {
        let formatter = NumberFormatter()
        formatter.locale = Locale.current
        formatter.numberStyle = .currency
        purchases = ApiClient.shared.purchases() as? [PurchaseDTO] ?? []
        let cents = ApiClient.shared.cartValueCents()
        cartTotal = formatter.string(from: cents / 100 as NSNumber) ?? ""
    }
}
