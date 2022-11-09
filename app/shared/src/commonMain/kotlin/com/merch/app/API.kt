import com.merch.app.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
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

@Serializable data class PurchaseableDTO(
    val id: Long,
    val merchantSlug: String,
    val productId: Long,
    val productName: String,
    val purchaseableId: Long,
    val purchaseableName: String,
    val thumbnail: String,
    val name: String,
    val priceCents: Long,
    var variations: ArrayList<PurchaseableVariationDTO>,
    val views: ArrayList<PurchaseableViewDTO>)

@Serializable data class PurchaseableVariationDTO(
    val id: Long,
    val name: String,
    val options: String) {
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
    val mobile: String
)

@Serializable data class PurchaseDTO(
    val id: String,
    val purchaseableId: String,
    val purchaseableName: String,
    val purchaseableVariations: String,
    var quantity: Long,
    var variation: String
)

interface IObserver {
    fun update()
}

interface IObservable {
    val observers: ArrayList<IObserver>

    fun add(observer: IObserver) {
        observers.add(observer)
    }

    fun remove(observer: IObserver) {
        observers.remove(observer)
    }

    fun sendUpdateEvent() {
        observers.forEach { it.update() }
    }
}

class ApiClient: IObservable {

    private val json = Json { ignoreUnknownKeys = true }
    override val observers: ArrayList<IObserver> = ArrayList()
    var operationInProgress = false

    companion object {
        const val baseEndpoint = "http://merch.zapto.org"
        const val imagesEndpoint = "$baseEndpoint:8888"
        const val apiEndpoint = "$baseEndpoint:3000"
    }

    fun log(prefix: String, e: Exception) {
        println("${prefix}: ${e.message}")
    }

    private val client: HttpClient = HttpClient(CIO) {
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
                it.id,
                merchantSlug,
                it.productId,
                it.productName,
                it.purchaseableId,
                it.purchaseableName,
                it.thumbnail,
                it.name,
                it.priceCents,
                arrayListOf(),
                arrayListOf()))
        }
        return result
    }

    // Fully populated purchaseable for the detail screen
    fun purchaseable(id: Long): PurchaseableDTO {

        val p = Database.purchaseable(id)

        val result = PurchaseableDTO(
            id,
            p?.merchantSlug ?: "",
            p?.productId ?: -1,
            p?.productName ?: "",
            p?.productId ?: 0,
            p?.purchaseableName ?: "",
            p?.thumbnail ?: "",
            p?.name ?: "",
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
        operationInProgress = true

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
        operationInProgress = true

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
                p.purchaseableId = it.purchaseableId
                p.purchaseableName = it.purchaseableName
                purchasableList.add(p)
                it.views.forEach {
                    val v = PurchaseableView()
                    v.id = it.id
                    v.name = it.name
                    v.thumbnail = it.thumbnail
                    v.background = it.background
                    v.purchaseableId = p.purchaseableId
                    viewList.add(v)
                }
                it.variations.forEach {
                    val v = PurchaseableVariation()
                    v.id = it.id
                    v.name = it.name
                    v.options = it.options
                    v.purchaseableId = p.purchaseableId
                    variationList.add(v)
                }
            }
            Database.saveOrUpdatePurchaseables(purchasableList)
            Database.saveOrUpdateViews(viewList)
            Database.saveOrUpdateVariations(variationList)
            onOperationCompleted()
        }
    }

    private fun onOperationCompleted() {
        CoroutineScope(Dispatchers.Main).launch {
            operationInProgress = false
            client.close()
            sendUpdateEvent()
        }
    }

    fun login() {
        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = try {
                client.post("$apiEndpoint/shopper")
            } catch (e: Exception) {
                log("Error loading purchaseables: ", e)
                onOperationCompleted()
                return@launch
            }
            sendUpdateEvent()
        }
    }

    fun getUser() {

    }
}