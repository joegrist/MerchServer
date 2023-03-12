import SwiftUI
import shared
import StripePaymentSheet

struct RootView: View {
    
    @EnvironmentObject var globalState: GlobalState
    @StateObject private var viewModel = RootViewModel()
    var paymentSheet: PaymentSheet?
    
    var body: some View {
        
        ZStack {
            
            NavigationStack {
                List {
                    ForEach (viewModel.merchants, id: \.slug) { merchant in
                        NavigationLink(value: merchant) {
                            MerchantRow(merchant: merchant)
                        }
                    }
                }
                .navigationDestination(for: MerchantDTO.self) { merchant in PurchaseableList(merchantSlug: merchant.slug) }
                .refreshable { viewModel.refresh() }
                .toolbar {
                    toolBarContent(state: globalState, cartCount: viewModel.cartCount)
                }
                .navigationTitle(viewModel.title)
            }
            .sheet(isPresented: $globalState.showingUserSheet) {
                UserView().environmentObject(globalState)
            }
            .sheet(isPresented: $globalState.showingCartSheet, onDismiss: {
                if globalState.triggerCheckoutSheet {
                    ApiClient.shared.ensurePaymentIntent()
                }
            }) {
                CartView().environmentObject(globalState)
            }
            .paymentSheet(isPresented: $viewModel.showingPaymentSheet, paymentSheet: viewModel.paymentSheet, onCompletion: { result in
                viewModel.handle(paymentResult: result)
            })
            .alert(AlertStore.shared.checkoutFailed.title, isPresented: $viewModel.showingCheckoutFailed) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(AlertStore.shared.checkoutFailed.message)
            }
            .alert(AlertStore.shared.checkoutSucceeded.title, isPresented: $viewModel.showingCheckoutSucceeded) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(AlertStore.shared.checkoutSucceeded.message)
            }
            
            if (viewModel.loading) {
                HStack() {
                    ProgressView().tint(Color(UIColor.label))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
                .background(
                    Color(UIColor.systemBackground).opacity(0.9)
                )
                .ignoresSafeArea()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
	}
}


struct MerchantRow: View {
    var merchant: MerchantDTO

    var body: some View {
        Text(merchant.name)
    }
}


@ToolbarContentBuilder
func toolBarContent(state: GlobalState, cartCount: Int64) -> some ToolbarContent {
    
    ToolbarItem(placement: .navigationBarTrailing) {
        Button(action: {
            state.showingUserSheet.toggle()
        }) {
            Image(systemName: "person.circle")
        }
    }
    ToolbarItem(placement: .navigationBarTrailing) {
        ZStack {
            Button(action: {
                state.showingCartSheet.toggle()
            }) {
                Image(systemName: "cart")
            }
            if (cartCount > 0) {
                Text(cartCount.description)
                    .frame(minWidth: 4)
                    .padding(EdgeInsets(top: 0, leading: 4, bottom: 0, trailing: 4))
                    .background(Color(UIColor.label))
                    .foregroundColor(Color(UIColor.systemBackground))
                    .cornerRadius(6)
                    .overlay(RoundedRectangle(cornerRadius: 6).stroke(.white, lineWidth: 1))
                    .font(.caption2)
                    .transformEffect(CGAffineTransform(translationX: 16, y: -12))
            }
        }
    }
}


struct ContentView_Previews: PreviewProvider {
	static var previews: some View {
		RootView()
	}
}

