import SwiftUI
import shared
import SDWebImageSwiftUI

struct Purchaseable: View {
    
    @StateObject private var viewModel: PurchaseableViewModel
    @EnvironmentObject private var globalState: GlobalState
    
    init(purchaseableId: Int64) {
        self._viewModel = StateObject(wrappedValue: PurchaseableViewModel(purchaseableId: purchaseableId))
    }
    
    var body: some View {
        ScrollView {
            VStack {
                HStack{
                    Text("Supplied By \(viewModel.supplerName)")
                    Spacer()
                    WebImage(url: URL(string: viewModel.supplerLogo))
                        .resizable()
                        .scaledToFit()
                        .frame(width: 32, height: 32)
                }
                .frame(maxWidth: .infinity)
                .padding([.leading, .trailing])
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(viewModel.thumbnails, id: \.id) { t in
                            VStack {
                                WebImage( url: URL(string: "\(ApiClient.shared.imagesEndpoint)/\(t.thumbnail)"))
                                    .placeholder{
                                        ZStack {
                                            Color(UIColor.secondarySystemBackground)
                                                .cornerRadius(10)
                                            Text("No Image")
                                        }
                                    }
                                    .resizable()
                                    .indicator(.activity)
                                    .transition(.fade(duration: 0.5))
                                    .scaledToFill()
                                    .frame(width: 300, height: 450)
                                    .cornerRadius(10)
                                Text(t.name)
                            }
                        }
                    }.padding([.leading, .trailing])
                }
                VStack {
                    ForEach(viewModel.variants, id: \.id) { v in
                        HStack {
                            Text(v.name)
                                .frame(maxWidth: .infinity, alignment: .trailing)
                            Button(action: {
                                viewModel.dec(purchaseableId: v.purchaseableId, variation: v.name)
                            })  {
                                Image(systemName: "minus.circle")
                            }
                            Text(v.quantity.description)
                                .frame(minWidth: 40)
                            Button(action: {
                                viewModel.inc(purchaseableId: v.purchaseableId, variation: v.name)
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
