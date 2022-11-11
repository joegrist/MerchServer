import SwiftUI
import shared

struct ContentView: View {
    
    @StateObject private var viewModel = MerchantsViewModel()
    
	var body: some View {
        
        NavigationStack {
            VStack {
                Text(viewModel.greet)
                List {
                    ForEach (viewModel.merchants, id: \.slug) { merchant in
                        NavigationLink(value: merchant) {
                            MerchantRow(merchant: merchant)
                        }
                        .disabled(viewModel.merchantsLoading)
                        .opacity(viewModel.merchantsLoading ? 0.5 : 1)
                    }
                }
                .navigationDestination(for: MerchantDTO.self) { merchant in PurchaseableList(merchantSlug: merchant.slug) }
                .refreshable { viewModel.refresh() }
            }
        }
	}
}


struct MerchantRow: View {
    var merchant: MerchantDTO

    var body: some View {
        Text(merchant.name)
    }
}

struct ContentView_Previews: PreviewProvider {
	static var previews: some View {
		ContentView()
	}
}

