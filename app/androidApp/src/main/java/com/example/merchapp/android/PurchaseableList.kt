package com.example.merchapp.android

import ApiClient
import IObserver
import PurchaseableDTO
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.database.DataSetObserver
import android.graphics.BitmapFactory
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListAdapter
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity


class PurchaseableList : AppCompatActivity(), IObserver {

    var tv: TextView? = null
    var lv: ListView? = null
    var loader: View? = null
    var itemsAdapter: PurchaseableListAdapter? = null
    var items: ArrayList<PurchaseableDTO> = arrayListOf()

    private val client = ApiClient()
    private var merchantSlug: String = "demo"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_purchaseable_list)

        tv = findViewById(R.id.text_view)
        lv = findViewById(R.id.list_view)
        loader = findViewById(R.id.loader)
        tv?.text = greet()

        merchantSlug = intent.extras?.get("slug") as? String ?: "demo"
        itemsAdapter = PurchaseableListAdapter(this, items)
        lv?.adapter = itemsAdapter

        lv?.setOnItemClickListener { parent, view, position, id ->
            val intent = Intent(this, Purchaseable::class.java)
            intent.putExtra("id", items.get(position).id)
            this.startActivity(intent)
        }

        client.add(this)
        showCurrent()
        client.loadPurchaseables(merchantSlug)
        update()
    }

    override fun update() {
        if (client.operationInProgress) {
            loader?.visibility = View.VISIBLE
            showCurrent()
            return
        }

        showCurrent()
        loader?.visibility = View.GONE
        tv?.text = client.purchaseables(merchantSlug).count().toString()
    }

    private fun showCurrent() {
        items.clear()
        client.purchaseables(merchantSlug).forEach {
            items.add(it)
        }
        itemsAdapter?.notifyDataSetChanged()
    }
}
