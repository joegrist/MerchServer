import SwiftUI
import shared
import SDWebImage
import SDWebImageSVGCoder
import SDWebImageWebPCoder
import SDWebImagePDFCoder

class GlobalState: ObservableObject {
    @Published var showingUserSheet = false
    @Published var showingCartSheet = false
    @Published var triggerCheckoutSheet = false
    @Published var cartItemCount = 0
}

@main
struct iOSApp: App {
    
    init() {
        config()
        
        // Add WebP/SVG/PDF support
        SDImageCodersManager.shared.addCoder(SDImageWebPCoder.shared)
        SDImageCodersManager.shared.addCoder(SDImageSVGCoder.shared)
        SDImageCodersManager.shared.addCoder(SDImagePDFCoder.shared)
        
        // Add default HTTP header
        SDWebImageDownloader.shared.setValue("image/webp,image/apng,image/*,*/*;q=0.8", forHTTPHeaderField: "Accept")
        
        // Add multiple caches
        let cache = SDImageCache(namespace: "tiny")
        cache.config.maxMemoryCost = 100 * 1024 * 1024 // 100MB memory
        cache.config.maxDiskSize = 50 * 1024 * 1024 // 50MB disk
        SDImageCachesManager.shared.addCache(cache)
        SDWebImageManager.defaultImageCache = SDImageCachesManager.shared
    }
    
	var body: some Scene {
		WindowGroup {
			RootView()
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
