import Foundation
import SwiftUI
import shared

class UserViewModel: BaseViewModel {
    
        
    @Published private(set) var merchants = [MerchantDTO]()
    @Published var title = "User"
    @Published var loggedIn = false
    @Published var email = ""
    @Published var password = ""
    
    var prefs = SharedPreference(context: NSObject())
    
    override init() {
        super.init()
        checkLogin()
    }
    
    func logOut() {
        ApiClient.shared.logOut()
        checkLogin()
    }
    
    func logIn() {
        ApiClient.shared.login(email: email, password: password)
    }
    
    override func onCall() {
        super.onCall()
    }
    
    override func onCallEnd() {
        super.onCallEnd()
        checkLogin()
    }
    
    func checkLogin() {
        loggedIn = ApiClient.shared.isLoggedIn
        if (loggedIn) {
            title = prefs.name
        }
    }
}
