package com.example.merchapp.android

import ApiClient
import IObserver
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView

class PurchaseableList : AppCompatActivity(), IObserver {

    var tv: TextView? = null
    var lv: ListView? = null
    var loader: View? = null
    var itemsAdapter: ArrayAdapter<String>? = null

    private val client = ApiClient()
    private var merchantId = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_purchaseable_list)
        merchantId = intent.extras?.get("id") as? Int ?: 1
        itemsAdapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, ArrayList<String>())
        lv?.adapter = itemsAdapter

        lv?.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, Purchaseable::class.java)
            intent.putExtra("id", position)
            this.startActivity(intent)
        }

        tv = findViewById(R.id.text_view)
        lv = findViewById(R.id.list_view)
        loader = findViewById(R.id.loader)
        tv?.text = greet()

        client.add(this)
        showCurrent()
        client.loadPurchaseables(merchantId)
        update()
    }

    override fun update() {
        if (client.loadingPurchaseables) {
            loader?.visibility = View.VISIBLE
            showCurrent()
            return
        }

        showCurrent()
        loader?.visibility = View.GONE
        tv?.text = client.purchaseables(merchantId).count().toString()
    }

    private fun showCurrent() {
        itemsAdapter?.clear()
        client.purchaseables(merchantId).forEach {
            itemsAdapter?.add(it.name)
        }
        itemsAdapter?.notifyDataSetChanged()
    }
}