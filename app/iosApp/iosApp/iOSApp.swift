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
                .tint(Color.secondaryAccent)
		}
	}
}

extension Color {
    static var secondaryAccent: Color {
        get {
            return Color("SecondaryAccentColor")
        }
    }
}
