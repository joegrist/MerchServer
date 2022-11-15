import Foundation
import SwiftUI
import shared

class BaseViewModel: ObservableObject, IObserver {
    
    init() {
        ApiClient.shared.add(observer: self)
    }
    
    deinit {
        ApiClient.shared.remove(observer: self)
    }
    
    func onCall() {
    }
    
    func onCallEnd() {
    }
    
    func onEvent(event: AppEvent) {
    }
}
