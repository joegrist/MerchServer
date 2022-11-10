import com.merch.app.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.client.utils.EmptyContent.contentType
import io.ktor.http.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

var token = ""

@Serializable data class MerchantDTO(
    val slug: String,
    val name: String
    )

@Serializable data class PurchaseableMiniDTO(
    val id: Long,
    val name: String,
) {
    companion object {
        fun from(p: Purchaseable): PurchaseableMiniDTO {
            return PurchaseableMiniDTO(
                id = p.id,
                name = p.name
            )
        }
    }
}

@Serializable data class PurchaseableDTO (
    val id: Long,
    val name: String,
    val merchantSlug: String,
    val productId: Long,
    val productName: String,
    val thumbnail: String,
    val priceCents: Long,
    var variations: ArrayList<PurchaseableVariationDTO>,
    val views: ArrayList<PurchaseableViewDTO>
    )

@Serializable data class PurchaseableVariationDTO(
    val id: Long,
    val name: String,
    val options: String
    ) {
    val optionsAsList
        get() = options.split(",").toTypedArray()
    }

@Serializable data class PurchaseableViewDTO(
    val id: Long,
    val thumbnail: String,
    val name: String,
    val background: Long
    )

@Serializable data class CustomerDTO(
    val email: String,
    val name: String,
    val mobile: String,
    val cart: ArrayList<PurchaseDTO>
    )

@Serializable data class PurchaseDTO(
    val id: String,
    val purchaseable: PurchaseableMiniDTO,
    var quantity: Long,
    var variation: String
    )

@Serializable data class LoginResponse(
    val token: String
)

interface IObserver {
    fun onCall()
    fun onCallEnd()
}

interface IObservable {
    val observers: ArrayList<IObserver>

    fun add(observer: IObserver) {
        observers.add(observer)
    }

    fun remove(observer: IObserver) {
        observers.remove(observer)
    }

    fun sendStartEvent() {
        observers.forEach { it.onCall() }
    }

    fun sendEndEvent() {
        observers.forEach { it.onCallEnd() }
    }
}

object ApiClient: IObservable {

    private val json = Json { ignoreUnknownKeys = true }
    override val observers: ArrayList<IObserver> = ArrayList()
    var operationInProgress = false
    var prefs: SharedPreference? = null
    const val baseEndpoint = "http://merch.zapto.org"
    const val imagesEndpoint = "$baseEndpoint:8888"
    const val apiEndpoint = "$baseEndpoint:3333"

    fun log(prefix: String, e: Exception) {
        println("${prefix}: ${e.message}")
    }

    private val client: HttpClient get() = HttpClient(CIO) {
        install(ContentNegotiation) {
            json()
        }
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.HEADERS
        }
        expectSuccess = true
    }

    fun merchants(): ArrayList<MerchantDTO> {
        val result = ArrayList<MerchantDTO>()
        Database.merchants().forEach {
            result.add(MerchantDTO(it.slug, it.name))
        }
        return result
    }

    // Simple Purchaseables without views for the main list
    fun purchaseables(merchantSlug: String): ArrayList<PurchaseableDTO> {
        val result = ArrayList<PurchaseableDTO>()
        Database.purchaseables(merchantSlug).forEach {
            result.add(PurchaseableDTO(
                id = it.id,
                name = it.name,
                merchantSlug = merchantSlug,
                productId = it.productId,
                productName = it.productName,
                thumbnail = it.thumbnail,
                priceCents = it.priceCents,
                variations = arrayListOf(),
                views = arrayListOf()))
        }
        return result
    }

    fun purchases() : ArrayList<PurchaseDTO> {
        val result = ArrayList<PurchaseDTO>()
        Database.purchases().forEach {
            val purchaseable = Database.purchaseable(it.purchaseableId) ?: return@forEach
            result.add(PurchaseDTO(
                id = it.id,
                quantity = it.quantity,
                variation = it.variation ?: "",
                purchaseable = PurchaseableMiniDTO.from(purchaseable)
            ))
        }
        return result
    }

    // Fully populated purchaseable for the detail screen
    fun purchaseable(id: Long): PurchaseableDTO {

        val p = Database.purchaseable(id)

        val result = PurchaseableDTO(
            id,
            p?.name ?: "",
            p?.merchantSlug ?: "",
            p?.productId ?: -1,
            p?.productName ?: "",
            p?.thumbnail ?: "",
            p?.priceCents ?: 0,
            arrayListOf(),
            arrayListOf())

        Database.views(id).forEach {
            val view = PurchaseableViewDTO(
                it.id,
                it.thumbnail,
                it.name,
                it.background)
            result.views.add(view)
        }

        Database.variations(id).forEach {
            val variation = PurchaseableVariationDTO(
                it.id,
                it.name,
                it.options)
            result.variations.add(variation)
        }

        return result
    }

    fun loadMerchants()  {
        onOperationStarted()

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.get("$apiEndpoint/merchants")
            } catch (e: Exception) {
                log("Error loading merchants: ", e)
                onOperationCompleted()
                return@launch
            }

            val data : Array<MerchantDTO> = json.decodeFromString(response.body())
            val list = ArrayList<Merchant>()
            data.forEach {
                val m = Merchant()
                m.slug = it.slug
                m.name = it.name
                list.add(m)
            }
            Database.saveOrUpdateMerchants(list)
            onOperationCompleted()
        }
    }

    fun loadPurchaseables(merchantSlug: String) {
        onOperationStarted()

        CoroutineScope(Dispatchers.Default).launch {

            val response: HttpResponse = try {
                client.get("$apiEndpoint/merchant/$merchantSlug/designs")
            } catch (e: Exception) {
                log("Error loading purchaseables: ", e)
                onOperationCompleted()
                return@launch
            }

            val data : Array<PurchaseableDTO> = json.decodeFromString(response.body())
            val purchasableList = ArrayList<Purchaseable>()
            val viewList = ArrayList<PurchaseableView>()
            val variationList = ArrayList<PurchaseableVariation>()

            data.forEach {
                val p = Purchaseable()
                p.id = it.id
                p.name = it.name
                p.productName = it.productName
                p.thumbnail = it.thumbnail
                p.merchantSlug = it.merchantSlug
                p.productId = it.productId
                purchasableList.add(p)
                it.views.forEach {
                    val v = PurchaseableView()
                    v.id = it.id
                    v.name = it.name
                    v.thumbnail = it.thumbnail
                    v.background = it.background
                    v.purchaseableId = p.id
                    viewList.add(v)
                }
                it.variations.forEach {
                    val v = PurchaseableVariation()
                    v.id = it.id
                    v.name = it.name
                    v.options = it.options
                    v.purchaseableId = p.id
                    variationList.add(v)
                }
            }
            Database.saveOrUpdatePurchaseables(purchasableList)
            Database.saveOrUpdateViews(viewList)
            Database.saveOrUpdateVariations(variationList)
            onOperationCompleted()
        }
    }

    fun purchase() {

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.submitForm {
                    "$apiEndpoint/customer/${prefs?.email!!}/cart/update") {
                    contentType(ContentType.Application.Json)
                    setBody(Database.getCart())
                }
                }
            } catch (e: Exception) {
                log("Error posting changes to cart: ", e)
                onOperationCompleted()
                return@launch
            }

        }

            "/customer/:email/purchase"
    }

    fun incQuantity(p: PurchaseDTO) {
        Database.incQuantity(p.id)
    }

    fun decQuantity(p: PurchaseDTO) {
        Database.decQuantity(p.id)
    }

    fun postCart() {
        onOperationStarted()

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.post ("$apiEndpoint/customer/${prefs?.email!!}/cart/update") {
                    contentType(ContentType.Application.Json)
                    setBody(Database.getCart())
                }
            } catch (e: Exception) {
                log("Error posting changes to cart: ", e)
                onOperationCompleted()
                return@launch
            }

            loadCurrentUser(prefs?.email!!)
        }
    }

    private fun onOperationStarted() {
        operationInProgress = true
        CoroutineScope(Dispatchers.Main).launch {
            sendStartEvent()
        }
    }
    private fun onOperationCompleted() {
        operationInProgress = false
        CoroutineScope(Dispatchers.Main).launch {
            client.close()
            sendEndEvent()
        }
    }

    fun login(email: String, password: String) {

        onOperationStarted()
        prefs?.email = email

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.submitForm (
                    url = "$apiEndpoint/customer/login",
                    formParameters = Parameters.build {
                        append("email", prefs!!.email)
                        append(password, password)
                    }
                )
            } catch (e: Exception) {
                log("Error logging in: ", e)
                onOperationCompleted()
                return@launch
            }

            val data : LoginResponse = json.decodeFromString(response.body())
            prefs?.token = data.token
            loadCurrentUser(prefs?.email!!)
        }
    }

    fun loadCurrentUser(email: String) {
        onOperationStarted()
        prefs?.email = email

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.get("$apiEndpoint/customer/${prefs!!.email}")
            } catch (e: Exception) {
                log("Error loading customer: ", e)
                onOperationCompleted()
                return@launch
            }

            val data : CustomerDTO = json.decodeFromString(response.body())
            prefs?.email = data.email
            prefs?.name = data.name

            val purchaseList = ArrayList<Purchase>()
            data.cart.forEach {
                val p = Purchase()
                p.id = it.id
                p.quantity = it.quantity
                p.variation = it.variation
                p.purchaseableId = it.purchaseable.id
                purchaseList.add(p)
            }

            Database.saveOrUpdatePurchases(purchaseList)
            onOperationCompleted()
        }
    }
}