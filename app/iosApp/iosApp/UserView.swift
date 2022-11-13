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
                        Button("Log Out", action: {
                            viewModel.logOut()
                        }).buttonStyle(.bordered)
                    } else {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Email")
                                .font(.caption)
                            TextField(
                                "somebody@somewhere.com",
                                text: $viewModel.email
                            )
                            .textFieldStyle(.roundedBorder)
                        }
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Password")
                                .font(.caption)
                            SecureField(
                                "Password",
                                text: $viewModel.password
                            ).textFieldStyle(.roundedBorder)
                        }
                        Button("Log In", action: {
                            viewModel.logIn()
                        })
                        .buttonStyle(.bordered)
                    }
                }
                .padding()
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
