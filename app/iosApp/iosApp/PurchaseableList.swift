import SwiftUI
import shared

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
            AsyncImage( url: URL(string: "\(ApiClient.shared.imagesEndpoint)/\(purchaseable.thumbnail)")) { phase in
                if let image = phase.image {
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .cornerRadius(10)
                } else if phase.error != nil {
                    ZStack {
                        Color(UIColor.secondarySystemBackground)
                            .cornerRadius(10)
                        Text("-")
                    }
                } else {
                    ZStack {
                        Color(UIColor.secondarySystemBackground)
                            .cornerRadius(10)
                        ProgressView()
                    }
                }
            }
            .frame(width: 100, height: 100)
            Text(purchaseable.name)
        }
    }
}



