import io.ktor.client.*
import io.ktor.client.engine.*

class TodoApiClient constructor(
    httpClientEngine: HttpClientEngine? = null) {
    companion object {
        const val BASE_ENDPOINT =
            "http://jsonplaceholder.typicode.com"
    }

    private val client: HttpClient =
        HttpClient(httpClientEngine!!) {
            install(JsonFeature) {
                serializer = KotlinxSerializer().apply {
                    register(Task.serializer())
                }
            }
        }
}