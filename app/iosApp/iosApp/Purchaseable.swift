import SwiftUI
import shared

struct Purchaseable: View {
    
    @StateObject private var viewModel: PurchaseableViewModel
    @EnvironmentObject private var globalState: GlobalState
    
    init(purchaseableId: Int64) {
        self._viewModel = StateObject(wrappedValue: PurchaseableViewModel(purchaseableId: purchaseableId))
    }
    
    var body: some View {
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
        .toolbar {
            toolBarContent(state: globalState)
        }
        .navigationTitle(viewModel.title)
    }
}
