import SwiftUI
import shared

struct ContentView: View {
    
    @EnvironmentObject private var globalState: GlobalState
    @StateObject private var viewModel = MerchantsViewModel()
    
    var body: some View {
        
        ZStack {
            
            NavigationStack {
                List {
                    ForEach (viewModel.merchants, id: \.slug) { merchant in
                        NavigationLink(value: merchant) {
                            MerchantRow(merchant: merchant)
                        }
                    }
                }
                .navigationDestination(for: MerchantDTO.self) { merchant in PurchaseableList(merchantSlug: merchant.slug) }
                .refreshable { viewModel.refresh() }
                .toolbar {
                    toolBarContent(state: globalState)
                }
                .navigationTitle(viewModel.title)
            }
            .sheet(isPresented: $globalState.showingUserSheet) {
                UserView()
            }
            .sheet(isPresented: $globalState.showingCartSheet) {
                CartView()
            }
            
            if (viewModel.loading) {
                HStack() {
                    ProgressView().tint(Color(UIColor.label))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                }
                .background(
                    Color(UIColor.systemBackground).opacity(0.9)
                )
                .ignoresSafeArea()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
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


@ToolbarContentBuilder
func toolBarContent(state: GlobalState) -> some ToolbarContent {
    
    ToolbarItem(placement: .navigationBarTrailing) {
        Button(action: {
            state.showingUserSheet.toggle()
        }) {
            Image(systemName: "person.circle")
        }
    }
    ToolbarItem(placement: .navigationBarTrailing) {
        Button(action: {
            state.showingCartSheet.toggle()
        }) {
            Image(systemName: "cart")
        }
    }
}


struct ContentView_Previews: PreviewProvider {
	static var previews: some View {
		ContentView()
	}
}

