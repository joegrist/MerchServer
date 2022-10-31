import com.example.merchapp.Database
import com.example.merchapp.Merchant
import com.example.merchapp.Purchaseable
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.client.plugins.logging.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import kotlinx.coroutines.*

@Serializable data class MerchantDTO(val id: Int, val name: String)
@Serializable data class PurchaseableDTO(val id: Int, val thumbnail: String, val name: String)

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
    var loadingMerchants = false
    var loadingPurchaseables = false

    companion object {
        const val BASE_ENDPOINT = "http://hugo.lan:3000"
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

    fun purchaseables(merchantId: Int): ArrayList<PurchaseableDTO> {
        val result = ArrayList<PurchaseableDTO>()
        Database.purchaseables(merchantId).forEach {
            result.add(PurchaseableDTO(it.id, it.thumbnail, it.name))
        }
        return result
    }

    fun loadMerchants()  {
        loadingMerchants = true

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = client.get("$BASE_ENDPOINT/merchants") {
                url {
                    parameters.append("token", "abc123")
                }
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
            client.close()
            loadingMerchants = false

            CoroutineScope(Dispatchers.Main).launch {
                sendUpdateEvent()
            }
        }
    }

    fun loadPurchaseables(merchantId: Int) {
        loadingPurchaseables = true

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = client.get("$BASE_ENDPOINT/merchant/$merchantId/designs") {
                url {
                    parameters.append("token", "abc123")
                }
            }

            val data : Array<PurchaseableDTO> = json.decodeFromString(response.body())
            val list = ArrayList<Purchaseable>()
            data.forEach {
                val m = Purchaseable()
                m.id = it.id
                m.name = it.name
                m.thumbnail = it.thumbnail
                list.add(m)
            }
            Database.saveOrUpdatePurchaseables(list)
            client.close()
            loadingPurchaseables = false

            CoroutineScope(Dispatchers.Main).launch {
                sendUpdateEvent()
            }
        }
    }
}