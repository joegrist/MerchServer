package com.merch.app
import io.realm.kotlin.Realm
import io.realm.kotlin.RealmConfiguration
import io.realm.kotlin.UpdatePolicy
import io.realm.kotlin.ext.query
import io.realm.kotlin.types.RealmObject
import io.realm.kotlin.types.annotations.PrimaryKey
import kotlinx.serialization.Serializable
import kotlin.math.max

@Serializable

class Merchant: RealmObject {
    @PrimaryKey
    var slug: String = ""
    var name: String = ""
}

class Purchaseable : RealmObject {
    @PrimaryKey
    var id: Long = 0
    var merchantSlug: String = ""
    var productId: Long = 0
    var productName: String = ""
    var name: String = ""
    var thumbnail: String = ""
    var priceCents: Long = 0
    var variations: String = ""
}

class PurchaseableVariation: RealmObject {
    @PrimaryKey
    var id: Long = 0
    var purchaseableId: Long = 0
    var name: String = ""
    var options: String = ""
}

class PurchaseableView: RealmObject {
    @PrimaryKey
    var id: Long = 0
    var purchaseableId: Long = 0
    var purchaseableName: String = ""
    var background: Long = 0
    var thumbnail: String = ""
    var name: String = ""
}

class Customer: RealmObject {
    @PrimaryKey
    var email: String = ""
    var name: String = ""
    var mobile: String = ""
}

class Purchase : RealmObject {
    @PrimaryKey
    var id: String = ""
    var purchaseableId: Long = 0
    var quantity: Long = 0
    var variation: String? = null
}

object Database {
    private val configuration = RealmConfiguration.Builder(
         setOf(
             Merchant::class,
             Purchase::class,
             Purchaseable::class,
             Customer::class,
             PurchaseableView::class,
             PurchaseableVariation::class
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

    fun merchant(id: Long): Merchant? {
        return realm.query<Merchant>("id = $id").first().find()
    }

    fun merchants(): Array<Merchant> {
        return realm.query<Merchant>().find().toTypedArray()
    }

    fun purchases(): Array<Purchase> {
        return realm.query<Purchase>().find().toTypedArray()
    }

    fun purchase(id: String): Purchase? {
        return realm.query<Purchase>("id = '$id'").first().find()
    }

    fun incQuantity(purchaseId: String) {
        var p = purchase(purchaseId) ?: return println("Asked to increment qty on invalid purchase $purchaseId")
        realm.writeBlocking {
            val pp = findLatest(p) ?: return@writeBlocking
            pp?.quantity = p.quantity + 1
            copyToRealm(pp, UpdatePolicy.ALL)
        }
    }

    fun decQuantity(purchaseId: String) {
        var p = purchase(purchaseId) ?: return println("Asked to decrement qty on invalid purchase $purchaseId")
        realm.writeBlocking {
            val pp = findLatest(p) ?: return@writeBlocking
            pp.quantity = max(p.quantity - 1, 0)
            copyToRealm(pp, UpdatePolicy.ALL)
        }
    }

    fun saveOrUpdatePurchaseables(p: ArrayList<Purchaseable>) {
        realm.writeBlocking {
            p.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }

    fun saveOrUpdatePurchases(p: ArrayList<Purchase>) {
        realm.writeBlocking {
            p.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }

    fun purchaseables(merchantSlug: String): Array<Purchaseable> {
        return realm.query<Purchaseable>("merchantSlug = $0", merchantSlug).find().toTypedArray()
    }

    fun purchaseable(id: Long): Purchaseable? {
        return realm.query<Purchaseable>("id = $0", id).first().find()
    }

    fun views(purchaseableId: Long): Array<PurchaseableView> {
        return realm.query<PurchaseableView>("purchaseableId = $0", purchaseableId).find().toTypedArray()
    }

    fun variations(purchaseableId: Long): Array<PurchaseableVariation> {
        return realm.query<PurchaseableVariation>("purchaseableId = $0", purchaseableId).find().toTypedArray()
    }

    fun saveOrUpdateViews(m: ArrayList<PurchaseableView>) {
        realm.writeBlocking {
            m.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }

    fun saveOrUpdateVariations(m: ArrayList<PurchaseableVariation>) {
        realm.writeBlocking {
            m.forEach {
                copyToRealm(it, UpdatePolicy.ALL)
            }
        }
    }
}