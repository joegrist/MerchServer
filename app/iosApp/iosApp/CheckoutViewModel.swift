import Foundation
import SwiftUI
import shared

class CheckoutViewModel: BaseViewModel {
    
    @Published var cardNumber1 = "" {
        didSet {
            cardNumber1 = String(cardNumber1.prefix(4))
        }
    }
    
    @Published var cardNumber2 = "" {
        didSet {
            cardNumber2 = String(cardNumber2.prefix(4))
        }
    }
    
    @Published var cardNumber3 = "" {
        didSet {
            cardNumber3 = String(cardNumber3.prefix(4))
        }
    }
    
    @Published var cardNumber4 = "" {
        didSet {
            cardNumber4 = String(cardNumber4.prefix(4))
        }
    }
    
    @Published var expiry1 = "" {
        didSet {
            expiry1 = String(expiry1.prefix(2))
        }
    }
    
    @Published var expiry2 = "" {
        didSet {
            expiry2 = String(expiry2.prefix(2))
        }
    }
    
    @Published var cvv = "" {
        didSet {
            cvv = String(cvv.prefix(2))
        }
    }
    
    func buy() {
        
    }
}
