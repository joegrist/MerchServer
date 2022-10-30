//
//  MerchApp.swift
//  Merch
//
//  Created by Joe Grist on 30/10/2022.
//

import SwiftUI

@main
struct MerchApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
