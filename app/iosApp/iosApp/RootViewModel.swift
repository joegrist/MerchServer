import Foundation
import SwiftUI
import shared
import StripePaymentSheet

class RootViewModel: BaseViewModel {
        
    @Published private(set) var merchants = [MerchantDTO]()
    @Published var title = "Shops"
    @Published var loading = false
    @Published var showingCheckoutFailed = false
    @Published var showingCheckoutSucceeded = false
    @Published var showingPaymentSheet = false
    @Published var paymentConfiguration: PaymentSheet.Configuration
    @Published var paymentIntentClientSecret: String?
    @Published var paymentIntentPublishableKey: String?
    @Published var paymentSheet: PaymentSheet!
    
    private var initialUserLoadNeeded = false
    
    private var prefs = SharedPreference(context: NSObject())
    
    override init() {
        paymentConfiguration = PaymentSheet.Configuration()
        super.init()
        paymentConfiguration.merchantDisplayName = ApiClient.shared.displayName
        paymentConfiguration.allowsDelayedPaymentMethods = true
        setupPaymentSheet()
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
        case AppEvent.purchasecompleted:
            showingCheckoutSucceeded = true
        case AppEvent.paymentintentupdated:
            paymentIntentClientSecret = ApiClient.shared.paymentIntent?.paymentIntent
            paymentIntentPublishableKey = ApiClient.shared.paymentIntent?.publishableKey
            setupPaymentSheet()
            showingPaymentSheet = true
            break;
        default:
            break
        }
    }
    
    func setupPaymentSheet() {
        // We'll only have this once we ask for a Payment Intent from stripe
        if let paymentIntentPublishableKey = paymentIntentPublishableKey, paymentIntentPublishableKey.count > 0 {
            STPAPIClient.shared.publishableKey = paymentIntentPublishableKey
        }
        paymentSheet = PaymentSheet(paymentIntentClientSecret: paymentIntentClientSecret ?? "", configuration: paymentConfiguration)
    }
    
    func showCurrent() {
        merchants = ApiClient.shared.merchants() as? [MerchantDTO] ?? []
    }
    
    func handle(paymentResult result: PaymentSheetResult) {
        switch result {
        case .completed:
            showingCheckoutSucceeded = true
        case .failed(let error):
            print(error.localizedDescription)
            showingCheckoutFailed = true
        case .canceled:
            break
        }
    }
}
