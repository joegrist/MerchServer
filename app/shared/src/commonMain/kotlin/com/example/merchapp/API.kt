import io.ktor.client.*
import io.ktor.client.engine.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

class ApiClient constructor(
    httpClientEngine: HttpClientEngine? = null) {
    companion object {
        const val BASE_ENDPOINT =
            "http://jsonplaceholder.typicode.com"
    }

    private val client: HttpClient =
        HttpClient(httpClientEngine!!) {
            install(ContentNegotiation) {
                json()
            }
        }
}