import SwiftUI
import shared

struct Purchaseable: View {
    
    @StateObject private var viewModel: PurchaseableViewModel
    @EnvironmentObject private var globalState: GlobalState
    
    init(purchaseableId: Int64) {
        self._viewModel = StateObject(wrappedValue: PurchaseableViewModel(purchaseableId: purchaseableId))
    }
    
    var body: some View {
        ScrollView {
            VStack {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(viewModel.thumbnails, id: \.id) { t in
                            VStack {
                                AsyncImage( url: URL(string: "\(ApiClient.shared.imagesEndpoint)/\(t.thumbnail)")) { phase in
                                    if let image = phase.image {
                                        image
                                            .resizable()
                                            .aspectRatio(contentMode: .fit)
                                            .cornerRadius(10)
                                    } else if phase.error != nil {
                                        ZStack {
                                            Color(UIColor.secondarySystemBackground)
                                                .cornerRadius(10)
                                            Text("No Image")
                                        }
                                    } else {
                                        ZStack {
                                            Color(UIColor.secondarySystemBackground)
                                                .cornerRadius(10)
                                            ProgressView()
                                        }
                                    }
                                }
                                .frame(width: 300, height: 450)
                                Text(t.name)
                            }
                        }
                    }
                }
                VStack {
                    ForEach(viewModel.variants, id: \.id) { v in
                        HStack {
                            Text(v.name)
                                .frame(maxWidth: .infinity, alignment: .trailing)
                            Button(action: {
                                viewModel.dec(purchase: v.purchase)
                            })  {
                                Image(systemName: "minus.circle")
                            }
                            Text(v.purchase.quantity.description)
                                .frame(minWidth: 40)
                            Button(action: {
                                viewModel.inc(purchase: v.purchase)
                            }) {
                                Image(systemName: "plus.circle")
                            }
                            .padding(EdgeInsets(top: 5, leading: 5, bottom: 5, trailing: 30))
                        }.frame(maxWidth: .infinity)
                        if viewModel.variants.last?.id != v.id  {
                            Divider()
                        }
                    }
                }
            }
        }
        .toolbar {
            toolBarContent(state: globalState, cartCount: viewModel.cartCount)
        }
        .navigationTitle(viewModel.title)
    }
}
