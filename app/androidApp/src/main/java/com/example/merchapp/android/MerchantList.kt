package com.example.merchapp.android

import ApiClient
import IObserver
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.View.*
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.example.merchapp.Greeting


fun greet(): String {
    return Greeting().greeting()
}

class MerchantList : BaseFragment(), IObserver  {

    private val client = ApiClient()
    val tv get() = view?.findViewById(R.id.text_view) as? TextView?
    var itemsAdapter: ArrayAdapter<String>? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.merchant_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        tv?.text = greet()
        itemsAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, ArrayList<String>())
        lv?.adapter = itemsAdapter

        lv?.setOnItemClickListener { _, _, position, _ ->
            val mid = client.merchants()[position].slug
            var action = MerchantListDirections.actionMerchantListToPurchaseableList(mid)
            navController?.navigate(action)
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
