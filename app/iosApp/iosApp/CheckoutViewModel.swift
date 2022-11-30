import Foundation
import SwiftUI
import shared

class CheckoutViewModel: BaseViewModel {
    
    @Published var cardNumber1 = "" { didSet { rememberDataEntry() }}
    @Published var cardNumber2 = "" { didSet { rememberDataEntry() }}
    @Published var cardNumber3 = "" { didSet { rememberDataEntry() }}
    @Published var cardNumber4 = "" { didSet { rememberDataEntry() }}
    @Published var expiryMonth = "" { didSet { rememberDataEntry() }}
    @Published var expiryYear = "" { didSet { rememberDataEntry() }}
    @Published var cvv = "" { didSet { rememberDataEntry() }}
    @Published var cartTotal = "$.00"
    
    override init() {
        cartTotal = iosApp.cartTotal()
        super.init()
        recallDataEntry()
    }
    
    func checkout() {
        ApiClient.shared.checkout()
    }
    
    func recallDataEntry() {
        cardNumber1 = ApiClient.shared.cc_quad_1
        cardNumber2 = ApiClient.shared.cc_quad_2
        cardNumber3 = ApiClient.shared.cc_quad_3
        cardNumber4 = ApiClient.shared.cc_quad_4
        expiryMonth = ApiClient.shared.expiry_mm
        expiryYear = ApiClient.shared.expiry_yy
        cvv = ApiClient.shared.cvv
    }
    
    func rememberDataEntry() {
        ApiClient.shared.cc_quad_1 = cardNumber1
        ApiClient.shared.cc_quad_2 = cardNumber2
        ApiClient.shared.cc_quad_3 = cardNumber3
        ApiClient.shared.cc_quad_4 = cardNumber4
        ApiClient.shared.expiry_mm = expiryMonth
        ApiClient.shared.expiry_yy = expiryYear
        ApiClient.shared.cvv = cvv
    }
}
