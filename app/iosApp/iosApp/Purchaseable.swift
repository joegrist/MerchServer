import SwiftUI
import shared

struct Purchaseable: View {
    
    @StateObject private var viewModel: PurchaseableViewModel
    
    init(purchaseableId: Int64) {
        self._viewModel = StateObject(wrappedValue: PurchaseableViewModel(purchaseableId: purchaseableId))
    }
    
    var body: some View {
        Text(viewModel.name)
        ScrollView(.horizontal) {
            VStack(spacing: 20) {
                ForEach(viewModel.thumbnails, id: \.id) { t in
                    AsyncImage( url: URL(string: "\(ApiClient.shared.imagesEndpoint)/\(t.thumbnail)")) {
                        image in image
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 300, height: 450)
                    } placeholder: {
                        ProgressView()
                    }
                    .cornerRadius(10)
                    Text(t.name)
                }
            }
        }
    }
}
