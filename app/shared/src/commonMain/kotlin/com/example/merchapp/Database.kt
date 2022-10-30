package com.example.merchapp
import io.realm.kotlin.Realm
import io.realm.kotlin.RealmConfiguration
import io.realm.kotlin.types.RealmObject
import io.realm.kotlin.types.annotations.PrimaryKey

class Purchaseable : RealmObject {
    @PrimaryKey
    var id: Int = 0
    var merchantName: String = ""
    var designName: String = ""
}

class Cart: RealmObject {
    var id: Int = 0
}

class Purchase : RealmObject {
    var cart: Cart? = null
}

class Database {
    val configuration = RealmConfiguration.Builder(
         setOf(
            Purchase::class,
            Purchaseable::class,
            Cart::class
        )
    ).build()

    val realm = Realm.open(configuration)
}