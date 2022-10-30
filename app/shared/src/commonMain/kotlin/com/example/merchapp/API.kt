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
import io.ktor.http.ContentType.Application.Json
import kotlinx.coroutines.coroutineScope
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import kotlin.properties.Delegates

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

    override val observers: ArrayList<IObserver> = ArrayList()
    var nerk: Array<DataMerchant> = arrayOf()
    var loadingMerchants by Delegates.observable(true) { property, old, new ->
        println("$property has changed from $old to $new")
    }

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

    suspend fun loadMerchants() = coroutineScope {
        loadingMerchants = true
        val response: HttpResponse = client.get("http://miriams-mbp.lan:3000/merchants") {
            url {
                parameters.append("token", "abc123")
            }
        }
        nerk = Json{ ignoreUnknownKeys = true }.decodeFromString<Array<DataMerchant>>(response.body())
        client.close()
        loadingMerchants = false
        sendUpdateEvent()
    }
}