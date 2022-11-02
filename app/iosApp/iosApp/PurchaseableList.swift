import SwiftUI
import shared

struct PurchaseableList: View {
    
    @StateObject private var viewModel = PurchaseablesViewModel()
    
    var body: some View {

        //.opacity(viewModel.merchantsLoading ? 1 : 0)
        

            VStack {
                Text(viewModel.greet)
                List {
                    ForEach (viewModel.purchaseables, id: \.id) { purchaseable in
                        NavigationLink(value: purchaseable) {
                            PurchaseableRow(purchaseable: purchaseable)
                        }
                        .disabled(viewModel.purchaseablesLoading)
                        .opacity(viewModel.purchaseablesLoading ? 1 : 0.5)
                    }
                }
//                .navigationDestination(for: PurchaseableDTO.self) { purchaseable in
//                        PurchaseableList()
//                }
                .refreshable {viewModel.update()}
            }
        
    }
}


struct PurchaseableRow: View {
    var purchaseable: PurchaseableDTO

    var body: some View {
        HStack {
            AsyncImage( url: URL(string: "\(ApiClient.Companion().imagesEndpoint)/\(purchaseable.thumbnail)")) {
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

struct PurchaseableList_Previews: PreviewProvider {
    static var previews: some View {
        PurchaseableList()
    }
}

