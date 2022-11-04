package com.example.merchapp.android

import ApiClient
import IObserver
import PurchaseableDTO
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs

class PurchaseableList : BaseFragment(), IObserver {

    val args: PurchaseableListArgs by navArgs()

    val tv get() = getView()?.findViewById(R.id.text_view) as? TextView
    var itemsAdapter: PurchaseableListAdapter? = null
    var items: ArrayList<PurchaseableDTO> = arrayListOf()

    private val client = ApiClient()
    private var merchantSlug: String = "demo"

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.purchaseable_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        tv?.text = greet()

        merchantSlug = args.merchantSlug
        itemsAdapter = PurchaseableListAdapter(requireActivity(), items)
        lv?.adapter = itemsAdapter

        lv?.setOnItemClickListener { parent, view, position, id ->
            val pid = items.get(position).id
            var action = PurchaseableListDirections.actionPurchaseableListToPurchaseable(pid)
            navController?.navigate(action)
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
