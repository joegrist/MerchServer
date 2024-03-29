import com.merch.app.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

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
    val views: ArrayList<PurchaseableViewDTO>,
    val supplierName: String,
    val supplierThumbnail: String
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

@Serializable data class PaymentIntent(
    val paymentIntent: String,
    val publishableKey: String
)

interface IObserver {
    fun onCall()
    fun onCallEnd()
    fun onEvent(event: AppEvent)
}

interface IObservable {
    val observers: ArrayList<IObserver>

    fun add(observer: IObserver) {
        observers.add(observer)
    }

    fun remove(observer: IObserver) {
        observers.remove(observer)
    }

    fun sendOnCall() {
        observers.forEach { it.onCall() }
    }

    fun sendOnCallEnd() {
        observers.forEach { it.onCallEnd() }
    }

    fun sendEvent(event: AppEvent) {
        observers.forEach { it.onEvent(event) }
    }
}

enum class AppEvent {
    LoginFailed, LoggedIn, LoggedOut, UserDataUpdated, CartUpdated, PaymentIntentUpdated, PurchaseCompleted
}

object ApiClient: IObservable {

    const val displayName = "Masters of Merch"
    private val json = Json { ignoreUnknownKeys = true }
    override val observers: ArrayList<IObserver> = ArrayList()
    var operationInProgress = false
    var prefs: SharedPreference? = null
    const val baseEndpoint = "http://merch.zapto.org"
    const val imagesEndpoint = "$baseEndpoint:8888"
    const val apiEndpoint = "$baseEndpoint:3333"
    var paymentIntent: PaymentIntent? = null

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
            result.add(merchantDTOFromMerchant(it))
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
                views = arrayListOf(),
                supplierName = it.supplierName,
                supplierThumbnail = it.supplierThumbnail))
        }
        return result
    }

    private fun purchaseDTOFrom(purchase: Purchase): PurchaseDTO? {
        val purchaseable = Database.purchaseable(purchase.purchaseableId) ?: return null
        return PurchaseDTO(
            id = purchase.id,
            quantity = purchase.quantity,
            variation = purchase.variation ?: "",
            purchaseable = PurchaseableMiniDTO.from(purchaseable)
        )
    }

    fun purchases() : ArrayList<PurchaseDTO> {
        val result = ArrayList<PurchaseDTO>()
        Database.purchases().forEach {
            val purchase = purchaseDTOFrom(it) ?: return@forEach
            result.add(purchase)
        }
        return result
    }

    fun purchase(purchaseableId: Long, variation: String): PurchaseDTO? {
        val p = Database.purchase(purchaseableId, variation) ?: return null
        return purchaseDTOFrom(p)
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
            arrayListOf(),
            p?.supplierName ?: "",
            p?.supplierThumbnail ?: "")

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

    fun initialLoad() {
        loadMerchants(andCustomer = true)
    }

    fun loadMerchants() {
        loadMerchants(andCustomer = false)
    }

    private fun loadMerchants(andCustomer: Boolean)  {
        onOperationStarted()

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.get("$apiEndpoint/merchants")
            } catch (e: Exception) {
                log("Error loading merchants: ", e)
                onOperationCompleted(null)
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

            if (andCustomer && isLoggedIn) {
                loadCurrentUser(prefs!!.email)
            } else {
                onOperationCompleted(null)
            }
        }
    }

    fun loadPurchaseables(merchantSlug: String) {
        onOperationStarted()

        CoroutineScope(Dispatchers.Default).launch {

            val response: HttpResponse = try {
                client.get("$apiEndpoint/merchant/$merchantSlug/designs")
            } catch (e: Exception) {
                log("Error loading purchaseables: ", e)
                onOperationCompleted(null)
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
                p.priceCents = it.priceCents
                p.supplierName = it.supplierName
                p.supplierThumbnail = it.supplierThumbnail
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
            onOperationCompleted(null)
        }
    }

    fun merchant(slug: String) : MerchantDTO? {
        val m = Database.merchant(slug) ?: return null
        return MerchantDTO(
            slug = m.slug,
            name = m.name
        )
    }

    fun merchantDTOFromMerchant(m: Merchant): MerchantDTO {
        return MerchantDTO(m.slug, m.name)
    }

    fun setCartPurchase(purchaseableId: Long, variation: String, quantity: Long) {

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.submitForm (
                    url = "$apiEndpoint/customer/${prefs?.email!!}/purchase",
                    formParameters = Parameters.build {
                        append("email", prefs!!.email)
                        append("designId", purchaseableId.toString())
                        append("quantity", quantity.toString())
                        append("variation", variation)
                    }
                )
            } catch (e: Exception) {
                log("Error posting changes to cart: ", e)
                onOperationCompleted(null)
                return@launch
            }

            storeCustomerDTO(response.body())
            onCartUpdated()
        }
    }

    fun incQuantity(purchase: PurchaseDTO) {
        Database.incQuantity(purchase.id)
        onCartUpdated()
    }

    fun decQuantity(purchase: PurchaseDTO) {
        Database.decQuantity(purchase.id)
        onCartUpdated()
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
                onOperationCompleted(null)
                return@launch
            }

            storeCustomerDTO(response.body())
            onOperationCompleted(null)
            onCartUpdated()
        }
    }

    fun ensurePaymentIntent() {

        val email = prefs?.email ?: return

        onOperationStarted()
        CoroutineScope(Dispatchers.Default).launch {

            val response: HttpResponse = try {
                client.submitForm (
                    url = "$apiEndpoint/customer/${email}/paymentIntent",
                    formParameters = Parameters.build {
                        append("cents", cartValueCents().toString())
                    }
                )
            } catch (e: Exception) {
                log("Error creating Stripe payment intent: ", e)
                onOperationCompleted(null)
                return@launch
            }

            paymentIntent = json.decodeFromString(response.body())
            onOperationCompleted(AppEvent.PaymentIntentUpdated)
        }
    }

    fun afterPurchaseCompleted() {
        onOperationStarted()
        val email = prefs?.email ?: return
        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.get ("$apiEndpoint/customer/${email}/afterPurchase")
            } catch (e: Exception) {
                log("Error clearing cart: ", e)
                onOperationCompleted(AppEvent.PurchaseCompleted)
                return@launch
            }
            storeCustomerDTO(response.body())
            onOperationCompleted(AppEvent.PurchaseCompleted)
            onCartUpdated()
        }
    }

    private fun onOperationStarted() {
        operationInProgress = true
        CoroutineScope(Dispatchers.Main).launch {
            sendOnCall()
        }
    }

    private fun onOperationCompleted(event: AppEvent?) {
        operationInProgress = false
        CoroutineScope(Dispatchers.Main).launch {
            client.close()
            sendOnCallEnd()
            event?.let { e ->
                sendEvent(e)
            }
        }
    }

    private fun onCartUpdated() {
        CoroutineScope(Dispatchers.Main).launch {
            sendEvent(AppEvent.CartUpdated)
        }
    }

    fun login(email: String, password: String) {

        onOperationStarted()
        prefs?.email = email.lowercase()

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
                onOperationCompleted(AppEvent.LoginFailed)
                return@launch
            }

            val data : LoginResponse = json.decodeFromString(response.body())
            prefs?.token = data.token
            loadCurrentUser(prefs?.email!!)

            CoroutineScope(Dispatchers.Main).launch {
                sendEvent(AppEvent.LoggedIn)
                onCartUpdated()
            }
        }
    }

    fun logOut() {
        prefs?.token = ""
        sendEvent(AppEvent.LoggedOut)
    }

    val isLoggedIn get() = (prefs?.token ?: "") != ""

    fun loadCurrentUser(email: String) {
        onOperationStarted()
        prefs?.email = email

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.get("$apiEndpoint/customer/${prefs!!.email}")
            } catch (e: Exception) {
                log("Error loading customer: ", e)
                onOperationCompleted(null)
                return@launch
            }

            storeCustomerDTO(response.body())
            onOperationCompleted(AppEvent.UserDataUpdated)
            onCartUpdated()
        }
    }

    fun cartValueCents(): Long {
        val purchases = Database.getCart()
        var cents = 0L
        purchases.forEach {
            val p = Database.purchaseable(it.purchaseable.id) ?: return@forEach
            val value = it.quantity * p.priceCents
            cents += value
        }
        return cents
    }

    val cartItemCount: Long get() {
        var result = 0L
        Database.getCart().forEach {
            result += it.quantity
        }
        return result
    }
    
    fun cartVariantQuantity(purchaseableId: Long, variant: String): Long {
        return Database.cartVariationQuantity(purchaseableId, variant)
    }

    private fun storeCustomerDTO(body: String) {

        val data : CustomerDTO = json.decodeFromString(body)
        prefs?.email = data.email
        prefs?.name = data.name

        Database.clearPurchases(data.email);

        val purchaseList = ArrayList<Purchase>()
        data.cart.forEach {
            val p = Purchase()
            p.id = it.id
            p.quantity = it.quantity
            p.variation = it.variation
            p.purchaseableId = it.purchaseable.id
            p.customerEmail = data.email
            purchaseList.add(p)
        }

        Database.saveOrUpdatePurchases(purchaseList)
    }
}