import SwiftUI
import shared


struct ContentView: View {
    
    @EnvironmentObject private var globalState: GlobalState
    @StateObject private var viewModel = MerchantsViewModel()
    
	var body: some View {
        
        NavigationStack {
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
            .toolbar {
                toolBarContent(state: globalState)
            }
            .navigationTitle(viewModel.title)
        }
        .sheet(isPresented: $globalState.showingUserSheet) {
            UserView()
        }
        .sheet(isPresented: $globalState.showingCartSheet) {
            UserView()
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

struct UserView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        Button("Press to dismiss") {
            dismiss()
        }
        .font(.title)
        .padding()
        .background(.black)
    }
}
