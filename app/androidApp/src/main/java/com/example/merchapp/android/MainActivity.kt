package com.example.merchapp.android

import ApiClient
import IObserver
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.merchapp.Greeting
import android.widget.TextView
import android.widget.Toast
import kotlinx.coroutines.*

fun greet(): String {
    return Greeting().greeting()
}

class MainActivity : AppCompatActivity(), IObserver  {

    val client = ApiClient()
    var tv: TextView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tv = findViewById(R.id.text_view)
        tv?.text = greet()

        client.add(this)
        CoroutineScope(Dispatchers.IO).launch {
            client.loadMerchants()
        }
    }

    override fun update() {
        tv?.text = client.nerk.toString()
    }
}
