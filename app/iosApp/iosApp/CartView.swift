import SwiftUI
import shared

struct CartView: View {
    @Environment(\.dismiss) var dismiss

    @StateObject private var viewModel = CartViewModel()
    
    var body: some View {
        NavigationView {
            VStack {
                Text(viewModel.cartTotal).font(.title)
                List {
                    ForEach (viewModel.purchases, id: \.id) { purchase in
                        let purchaseable = ApiClient.shared.purchaseable(id: purchase.purchaseable.id)
                        HStack(spacing: 0) {
                            VStack(alignment: .leading) {
                                Text(purchaseable.name)
                                    .font(.body)
                                Text(purchase.variation)
                                    .font(.caption)
                                    .foregroundColor(Color(UIColor.secondaryLabel))
                            }
                            Spacer(minLength: 10)
                            HStack {
                                Button(action: {
                                    viewModel.dec(purchase: purchase)
                                })  {
                                    Image(systemName: "minus.circle")
                                }
                                Text(purchase.quantity.description)
                                    .frame(minWidth: 40)
                                Button(action: {
                                    viewModel.inc(purchase: purchase)
                                }) {
                                    Image(systemName: "plus.circle")
                                }
                            }
                        }
                        .buttonStyle(.borderless)
                    }
                    .frame( maxWidth: .infinity)
                }
                Button("Buy", action: {
                    viewModel.buy()
                })
                .buttonStyle(.bordered)
                .frame(maxWidth: .infinity)
            }
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done", action: {
                        ApiClient.shared.postCart()
                        dismiss()
                    })
                }
            }
        }
    }
}
