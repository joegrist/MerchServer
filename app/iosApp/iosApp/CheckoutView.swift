import SwiftUI
import shared

struct CheckoutView: View {
    
    @Environment(\.presentationMode) var presentationMode
    
    @State var viewModel = CheckoutViewModel()
    
    var body: some View {
        VStack {
            HStack {
                TextField("XXXX", text: $viewModel.cardNumber1)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                TextField("XXXX", text: $viewModel.cardNumber2)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                TextField("XXXX", text: $viewModel.cardNumber3)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                TextField("XXXX", text: $viewModel.cardNumber4)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
            }
            HStack {
                TextField("MM", text: $viewModel.expiry1)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                TextField("YY", text: $viewModel.expiry2)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
            }
            TextField("XXX", text: $viewModel.cvv)
                .keyboardType(.numberPad)
                .textFieldStyle(.roundedBorder)
            Button("Buy", action: { viewModel.buy() })
                .padding(10)
                .frame(maxWidth: .infinity)
                .overlay(RoundedRectangle(cornerRadius: 5).stroke(Color.secondaryAccent, lineWidth: 1))
        }
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Done", action: {
                    presentationMode.wrappedValue.dismiss()
                })
            }
        }
        .navigationTitle("Checkout")
        .padding()
    }
}
