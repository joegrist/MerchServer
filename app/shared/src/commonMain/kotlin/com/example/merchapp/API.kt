import com.example.merchapp.Database
import com.example.merchapp.Merchant
import com.example.merchapp.Purchaseable
import com.example.merchapp.PurchaseableView
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

@Serializable data class MerchantDTO(
    val id: Long,
    val name: String
    )

@Serializable data class PurchaseableDTO(
    val id: Long,
    val merchantId: Long,
    val productId: Long,
    val thumbnail: String,
    val name: String,
    val productName: String,
    val views: ArrayList<PurchaseableViewDTO>
    )

@Serializable data class PurchaseableViewDTO(
    val id: Long,
    val designId: Long,
    val designName: String,
    val thumbnail: String,
    val name: String,
    val background: Long
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
        const val baseEndpoint = "http://hugo.lan" // ""http://merch.zapto.org"
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
            result.add(MerchantDTO(it.id, it.name))
        }
        return result
    }

    // Simple Purchaseables without views for the main list
    fun purchaseables(merchantId: Long): ArrayList<PurchaseableDTO> {
        val result = ArrayList<PurchaseableDTO>()
        Database.purchaseables(merchantId).forEach {
            result.add(PurchaseableDTO(it.id, merchantId, it.productId, it.thumbnail, it.name, it.productName, arrayListOf()))
        }
        return result
    }

    // Fully populated purchaseable for the detail screen
    fun purchaseable(id: Long): PurchaseableDTO {
        val p = Database.purchaseable(id)
        val result = PurchaseableDTO(id, p?.merchantId ?: -1, p?.productId ?: -1, p?.thumbnail ?: "", p?.name ?: "", p?.productName ?: "", arrayListOf())
        Database.views(id).forEach {
            result.views.add(PurchaseableViewDTO(it.id, it.purchaseableId, it.designName, it.thumbnail, it.name, it.background))
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
                m.id = it.id
                m.name = it.name
                list.add(m)
            }
            Database.saveOrUpdateMerchants(list)
            onOperationCompleted()
        }
    }

    fun loadPurchaseables(merchantId: Long) {
        operationInProgress = true

        CoroutineScope(Dispatchers.Default).launch {

            val response: HttpResponse = try {
                client.get("$apiEndpoint/merchant/$merchantId/designs")
            } catch (e: Exception) {
                log("Error loading purchaseables: ", e)
                onOperationCompleted()
                return@launch
            }

            val data : Array<PurchaseableDTO> = json.decodeFromString(response.body())
            val purchasableList = ArrayList<Purchaseable>()
            val viewList = ArrayList<PurchaseableView>()

            data.forEach {
                val p = Purchaseable()
                p.id = it.id
                p.name = it.name
                p.productName = it.productName
                p.thumbnail = it.thumbnail
                p.merchantId = it.merchantId
                p.productId = it.productId
                purchasableList.add(p)
                it.views.forEach {
                    val v = PurchaseableView()
                    v.id = it.id
                    v.purchaseableId = it.designId
                    v.designName = it.designName
                    v.name = it.name
                    v.thumbnail = it.thumbnail
                    v.background = it.background
                    viewList.add(v)
                }
            }
            Database.saveOrUpdatePurchaseables(purchasableList)
            Database.saveOrUpdateViews(viewList)
            onOperationCompleted()
        }
    }

    fun onOperationCompleted() {
        CoroutineScope(Dispatchers.Main).launch {
            operationInProgress = false
            client.close()
            sendUpdateEvent()
        }
    }
}