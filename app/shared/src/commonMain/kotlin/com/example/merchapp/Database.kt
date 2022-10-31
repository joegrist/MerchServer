package com.example.merchapp
import io.realm.kotlin.Realm
import io.realm.kotlin.RealmConfiguration
import io.realm.kotlin.UpdatePolicy
import io.realm.kotlin.ext.query
import io.realm.kotlin.query.RealmResults
import io.realm.kotlin.types.RealmObject
import io.realm.kotlin.types.annotations.PrimaryKey
import kotlinx.serialization.Serializable

@Serializable

class Merchant: RealmObject {
    @PrimaryKey
    var id: Int = 0
    var name: String = ""
}

class Purchaseable : RealmObject {
    @PrimaryKey
    var id: Int = 0
    var merchant: Merchant? = null
    var name: String = ""
    var designName: String = ""
    var thumbnail: String = ""
}

class Cart: RealmObject {
    var id: Int = 0
}

class Purchase : RealmObject {
    var cart: Cart? = null
}

object Database {
    private val configuration = RealmConfiguration.Builder(
         setOf(
             Merchant::class,
             Purchase::class,
             Purchaseable::class,
             Cart::class
        )
    ).build()

    private val realm = Realm.open(configuration)

    fun saveOrUpdateMerchants(m: ArrayList<Merchant>) {
        realm.writeBlocking {
            m.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }

    fun merchants(): RealmResults<Merchant> {
        return realm.query<Merchant>().find()
    }

    fun saveOrUpdatePurchaseables(m: ArrayList<Purchaseable>) {
        realm.writeBlocking {
            m.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }

    fun purchaseables(merchantId: Int): RealmResults<Purchaseable> {
        return realm.query<Purchaseable>("merchant.id = $0", merchantId).find()
    }
}