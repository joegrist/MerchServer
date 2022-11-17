import SwiftUI
import shared

struct UserView: View {
    @Environment(\.dismiss) var dismiss

    @StateObject private var viewModel = UserViewModel()
    
    var body: some View {
        
        NavigationView {
            VStack {
                VStack(spacing: 20) {
                    Image(systemName: "person.circle").font(.system(size: 56.0, weight: .thin))
                        .frame(maxWidth: .infinity)
                    
                    if viewModel.loggedIn {
                        Text(viewModel.title).font(.title)
                        Button("Log Out", action: { viewModel.logOut() })
                    } else {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Email")
                                .font(.caption)
                            TextField(
                                "somebody@somewhere.com",
                                text: $viewModel.email
                            )
                        }
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Password")
                                .font(.caption)
                            SecureField(
                                "Password",
                                text: $viewModel.password
                            )
                        }
                        Button("Log In", action: { viewModel.logIn() })
                    }
                }
                .padding()
                .buttonStyle(AppButtonStyle())
                .textFieldStyle(.roundedBorder)
            }
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done", action: {
                        dismiss()
                    })
                }
            }
        }
    }
}
