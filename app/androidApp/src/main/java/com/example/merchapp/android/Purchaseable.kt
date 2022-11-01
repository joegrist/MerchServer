package com.example.merchapp.android

import ApiClient
import IObserver
import PurchaseableDTO
import android.os.Bundle
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import com.example.merchapp.android.databinding.ActivityPurchaseableBinding

class Purchaseable : AppCompatActivity() {

    private var purchaseableId = 0
    private var purchaseable: PurchaseableDTO? = null
    private var title: TextView? = null
    private var list: ListView? = null
    private var button: Button? = null
    private val client = ApiClient()
    var itemsAdapter: ViewListAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        purchaseableId = intent.extras?.get("id") as? Int ?: 1
        setContentView(R.layout.activity_purchaseable)

        title = findViewById(R.id.title)
        list = findViewById(R.id.view_list)
        button = findViewById(R.id.order_button)

        purchaseable = client.purchaseable(purchaseableId)

        title?.text = purchaseable?.name
        itemsAdapter = ViewListAdapter(this, purchaseable?.views ?: arrayListOf())
        list?.adapter = itemsAdapter
    }
}