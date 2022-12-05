import SwiftUI
import shared
import SDWebImageSwiftUI

struct PurchaseableList: View {
    
    @StateObject var viewModel: PurchaseablesViewModel
    @EnvironmentObject private var globalState: GlobalState
    
    init(merchantSlug: String) {
        self._viewModel = StateObject(wrappedValue: PurchaseablesViewModel(merchantSlug: merchantSlug))
    }
    
    var body: some View {
        List {
            ForEach (viewModel.purchaseables, id: \.id) { purchaseable in
                NavigationLink(value: purchaseable) {
                    PurchaseableRow(purchaseable: purchaseable)
                }
                .disabled(viewModel.purchaseablesLoading)
                .opacity(viewModel.purchaseablesLoading ? 0.5 : 1)
            }
        }
        .navigationDestination(for: PurchaseableDTO.self) { purchaseable in
            Purchaseable(purchaseableId: purchaseable.id)
        }
        .refreshable {viewModel.refresh()}
        .toolbar {
            toolBarContent(state: globalState, cartCount: viewModel.cartCount)
        }
        .navigationTitle(viewModel.title)
    }
}


struct PurchaseableRow: View {
    var purchaseable: PurchaseableDTO

    var body: some View {
        HStack {
            WebImage( url: URL(string: "\(ApiClient.shared.imagesEndpoint)/\(purchaseable.thumbnail)"))
                .resizable()
                .placeholder{
                    Color(UIColor.secondarySystemBackground)
                        .cornerRadius(10)
                }
                .indicator(.activity)
                .transition(.fade(duration: 0.5))
                .scaledToFill()
                .frame(width: 100, height: 100)
                .cornerRadius(10)
            Text(purchaseable.name)
        }
    }
}



