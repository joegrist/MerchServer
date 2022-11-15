import SwiftUI
import shared

struct CheckoutView: View {
    
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject private var globalState: GlobalState
    @State var viewModel = CheckoutViewModel()
    
    var body: some View {
        NavigationStack {
            VStack {
                VStack(alignment: .leading) {
                    Text(viewModel.cartTotal).font(.title)
                    Text("Card Number").font(.caption)
                    HStack {
                        TextField("XXXX", text: $viewModel.cardNumber1)
                            .keyboardType(.numberPad)
                        TextField("XXXX", text: $viewModel.cardNumber2)
                            .keyboardType(.numberPad)
                        TextField("XXXX", text: $viewModel.cardNumber3)
                            .keyboardType(.numberPad)
                        TextField("XXXX", text: $viewModel.cardNumber4)
                            .keyboardType(.numberPad)
                    }
                    Text("Expiry").font(.caption)
                    HStack {
                        TextField("MM", text: $viewModel.expiry1)
                            .keyboardType(.numberPad)
                            .textFieldStyle(.roundedBorder)
                        TextField("YY", text: $viewModel.expiry2)
                            .keyboardType(.numberPad)
                    }
                    Text("CVV").font(.caption)
                    TextField("XXX", text: $viewModel.cvv)
                        .keyboardType(.numberPad)
                    Button("Buy", action: {
                        viewModel.checkout()
                        globalState.showingCheckoutSheet = false
                    })
                }
                .textFieldStyle(.roundedBorder)
                .buttonStyle(AppButtonStyle())
            }
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done", action: {
                        presentationMode.wrappedValue.dismiss()
                    })
                }
            }
            .navigationTitle("Checkout").navigationBarTitleDisplayMode(.inline)
            .padding()
        }
    }
}
