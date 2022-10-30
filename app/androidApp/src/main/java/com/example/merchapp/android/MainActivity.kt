package com.example.merchapp.android

import ApiClient
import DataMerchant
import IObserver
import android.os.Bundle
import android.view.View
import android.view.View.*
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.merchapp.Greeting


fun greet(): String {
    return Greeting().greeting()
}

class MainActivity : AppCompatActivity(), IObserver  {

    private val client = ApiClient()
    var tv: TextView? = null
    var lv: ListView? = null
    var loader: View? = null
    var itemsAdapter: ArrayAdapter<String>? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        tv = findViewById(R.id.text_view)
        lv = findViewById(R.id.list_view)
        loader = findViewById(R.id.loader)
        tv?.text = greet()
        itemsAdapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, ArrayList<String>())
        lv?.adapter = itemsAdapter
        itemsAdapter?.notifyDataSetChanged()

        client.add(this)
        client.loadMerchants()
        update()
    }

    override fun update() {
        if (client.loadingMerchants) {
            loader?.visibility = VISIBLE
            showCurrent()
            return
        }

        showCurrent()
        loader?.visibility = GONE
        tv?.text = client.nerk.toString()
    }

    private fun showCurrent() {
        itemsAdapter?.clear()
        client.nerk.forEach {
            itemsAdapter?.add(it.name)
        }
        itemsAdapter?.notifyDataSetChanged()
    }
}
