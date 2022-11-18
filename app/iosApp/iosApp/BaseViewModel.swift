import Foundation
import SwiftUI
import shared

class BaseViewModel: ObservableObject, IObserver {
    
    @Published var cartCount: Int64 = 0
    
    init() {
        ApiClient.shared.add(observer: self)
        updateCartBadge()
    }
    
    deinit {
        ApiClient.shared.remove(observer: self)
    }
    
    func onCall() {
    }
    
    func onCallEnd() {
    }
    
    func onEvent(event: AppEvent) {
        switch(event) {
        case AppEvent.cartupdated:
            updateCartBadge()
        default:
            break
        }
    }
    
    func updateCartBadge() {
        cartCount = ApiClient.shared.cartItemCount
    }

}
