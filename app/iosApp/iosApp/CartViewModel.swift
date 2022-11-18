import Foundation
import SwiftUI
import shared

class CartViewModel: BaseViewModel {
    
    @Published private(set) var purchases: [PurchaseDTO] = []
    @Published var title = "Cart"
    @Published var cartTotal = "$0.00"
    @Published var empty = true
    
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
        ApiClient.shared.incQuantity(purchase: purchase)
        update()
    }
    
    func dec(purchase: PurchaseDTO) {
        ApiClient.shared.decQuantity(purchase: purchase)
        update()
    }
    
    func saveCart() {
        ApiClient.shared.postCart()
    }
    
    func update() {
        purchases = ApiClient.shared.purchases() as? [PurchaseDTO] ?? []
        cartTotal = iosApp.cartTotal()
        empty = purchases.isEmpty
    }
}
