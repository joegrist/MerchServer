package com.example.merchapp.android

import ApiClient
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.merchapp.Greeting
import android.widget.TextView
import kotlinx.coroutines.*

fun greet(): String {
    return Greeting().greeting()
}

class MainActivity : AppCompatActivity()  {

    val client = ApiClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val tv: TextView = findViewById(R.id.text_view)
        tv.text = greet()

        CoroutineScope(Dispatchers.IO).launch {
            val bla = withContext(Dispatchers.IO) {
                client.
            }
        }
    }
}
