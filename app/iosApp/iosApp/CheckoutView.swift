import SwiftUI
import shared

struct  CheckoutView: View {
    
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        VStack {
            Text("Checkout")
        }
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Done", action: {
                    presentationMode.wrappedValue.dismiss()
                })
            }
        }
    }
}
