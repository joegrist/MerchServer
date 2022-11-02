package com.example.merchapp.android

import ApiClient
import IObserver
import android.content.Intent
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

        lv?.setOnItemClickListener { _, _, position, _ ->
            val mid = client.merchants().get(position).id
            val intent = Intent(this, PurchaseableList::class.java)
            intent.putExtra("id", mid)
            this.startActivity(intent)
        }

        client.add(this)
        showCurrent()
        client.loadMerchants()
        update()
    }

    override fun update() {
        if (client.operationInProgress) {
            loader?.visibility = VISIBLE
            showCurrent()
            return
        }

        showCurrent()
        loader?.visibility = GONE
        tv?.text = client.merchants().count().toString()
    }

    private fun showCurrent() {
        itemsAdapter?.clear()
        client.merchants().forEach {
            itemsAdapter?.add(it.name)
        }
        itemsAdapter?.notifyDataSetChanged()
    }
}
