import SwiftUI
import shared

struct ContentView: View {
    
    @StateObject private var viewModel = MerchantsViewModel()
    
	var body: some View {
        ZStack {
            ZStack {
                Color.black.opacity(0.2)
                ProgressView()
            }
            .opacity(viewModel.merchantsLoading ? 1 : 0)
            VStack {
                Text(viewModel.greet)
                List(viewModel.merchants, id: \.id) { merchant in
                    MerchantRow(merchant: merchant)
                }
            }
        }
        .ignoresSafeArea()
	}
}


struct MerchantRow: View {
    var merchant: DataMerchant

    var body: some View {
        Text(merchant.name)
    }
}

struct ContentView_Previews: PreviewProvider {
	static var previews: some View {
		ContentView()
	}
}

