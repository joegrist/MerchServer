package com.example.merchapp
import io.realm.kotlin.Realm
import io.realm.kotlin.RealmConfiguration
import io.realm.kotlin.UpdatePolicy
import io.realm.kotlin.ext.query
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
    var merchantId: Int = 0
    var productId: Int = 0
    var name: String = ""
    var productName: String = ""
    var thumbnail: String = ""
}

class PurchaseableView: RealmObject {
    @PrimaryKey
    var id: Int = 0
    var purchaseableId: Int = 0
    var designName: String = ""
    var background: Int = 0
    var thumbnail: String = ""
    var name: String = ""
}

class Cart: RealmObject {
    @PrimaryKey
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
             Cart::class,
             PurchaseableView::class
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

    fun merchant(id: Int): Merchant? {
        return realm.query<Merchant>("id = $id").first().find()
    }

    fun merchants(): Array<Merchant> {
        return realm.query<Merchant>().find().toTypedArray()
    }

    fun saveOrUpdatePurchaseables(m: ArrayList<Purchaseable>) {
        realm.writeBlocking {
            m.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }

    fun purchaseables(merchantId: Int): Array<Purchaseable> {
        return realm.query<Purchaseable>("merchantId = $0", merchantId).find().toTypedArray()
    }

    fun purchaseable(id: Int): Purchaseable? {
        return realm.query<Purchaseable>("id = $0", id).first().find()
    }

    fun views(purchaseableId: Int): Array<PurchaseableView> {
        return realm.query<PurchaseableView>("purchaseableId = $0", purchaseableId).find().toTypedArray()
    }

    fun saveOrUpdateViews(m: ArrayList<PurchaseableView>) {
        realm.writeBlocking {
            m.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }
}