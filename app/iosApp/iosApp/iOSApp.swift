import SwiftUI

class GlobalState: ObservableObject {
    @Published var showingUserSheet = false
    @Published var showingCartSheet = false
}

@main
struct iOSApp: App {
	var body: some Scene {
		WindowGroup {
			ContentView()
                .environmentObject(GlobalState())
		}
	}
}
