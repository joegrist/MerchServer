import SwiftUI
import shared

class GlobalState: ObservableObject {
    @Published var showingUserSheet = false
    @Published var showingCartSheet = false
    @Published var showingCheckoutSheet = false
    @Published var triggerCheckoutSheet = false
}

@main
struct iOSApp: App {
    
    init() {
        config()
    }
    
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

func config() {
    ApiClient.shared.prefs = SharedPreference(context: NSObject())
}

func cartTotal() -> String {
    let formatter = NumberFormatter()
    formatter.locale = Locale.current
    formatter.numberStyle = .currency
    let cents = ApiClient.shared.cartValueCents()
    return formatter.string(from: cents / 100 as NSNumber) ?? ""
}

struct AppButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(10)
            .frame(maxWidth: .infinity)
            .overlay(RoundedRectangle(cornerRadius: 5).stroke(Color.secondaryAccent, lineWidth: 1))
            .foregroundColor(Color.secondaryAccent)
    }
}
