import SwiftUI
import shared

struct PurchaseableList: View {
    
    @StateObject var viewModel: PurchaseablesViewModel
    
    init(merchantSlug: String) {
        self._viewModel = StateObject(wrappedValue: PurchaseablesViewModel(merchantSlug: merchantSlug))
    }
    
    var body: some View {
        VStack {
            Text(viewModel.greet)
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
        }
    }
}


struct PurchaseableRow: View {
    var purchaseable: PurchaseableDTO

    var body: some View {
        HStack {
            AsyncImage( url: URL(string: "\(ApiClient.shared.imagesEndpoint)/\(purchaseable.thumbnail)")) {
                image in image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 100, height: 100)
            } placeholder: {
                ProgressView()
            }
            .cornerRadius(10)
            Text(purchaseable.name)
        }
    }
}



