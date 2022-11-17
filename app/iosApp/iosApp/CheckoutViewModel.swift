import Foundation
import SwiftUI
import shared

class CheckoutViewModel: BaseViewModel {
    
    @Published var cardNumber1 = ""
    @Published var cardNumber2 = ""
    @Published var cardNumber3 = ""
    @Published var cardNumber4 = ""
    @Published var expiry1 = ""
    @Published var expiry2 = ""
    @Published var cvv = ""
    @Published var cartTotal = "$.00"
    
    override init() {
        cartTotal = iosApp.cartTotal()
        super.init()
    }
    
    func checkout() {
        ApiClient.shared.checkout()
    }
}
