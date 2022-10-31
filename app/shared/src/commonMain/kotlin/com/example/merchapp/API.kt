import com.example.merchapp.Database
import com.example.merchapp.Merchant
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
import kotlin.properties.Delegates
import kotlinx.coroutines.*

@Serializable data class DataMerchant(val id: Int, val name: String)

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

    companion object {
        const val BASE_ENDPOINT = "http://jsonplaceholder.typicode.com"
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

    fun merchants(): ArrayList<DataMerchant> {
        val result = ArrayList<DataMerchant>()
        Database.merchants().forEach {
            result.add(DataMerchant(it.id, it.name))
        }
        return result
    }

    fun loadMerchants()  {
        loadingMerchants = true

        CoroutineScope(Dispatchers.Default).launch {
            val response: HttpResponse = client.get("http://miriams-mbp.lan:3000/merchants") {
                url {
                    parameters.append("token", "abc123")
                }
            }

            val data : Array<DataMerchant> = json.decodeFromString(response.body())
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
}