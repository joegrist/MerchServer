package com.merch.app.android

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
    var lv: ListView? = null
    var itemsAdapter: PurchaseableListAdapter? = null
    var items: ArrayList<PurchaseableDTO> = arrayListOf()

    private var merchantSlug: String = "demo"

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.purchaseable_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        lv = view.findViewById(R.id.purchaseable_list_list_view) as? ListView
        merchantSlug = args.merchantSlug
        itemsAdapter = PurchaseableListAdapter(requireActivity(), items)
        lv?.adapter = itemsAdapter

        lv?.setOnItemClickListener { parent, view, position, id ->
            val p = items.get(position)
            var action = PurchaseableListDirections.actionPurchaseableListToPurchaseable(p.id, p.name)
            navController?.navigate(action)
        }

        ApiClient.add(this)
        ApiClient.loadPurchaseables(merchantSlug)
    }

    override fun onCall() {
        showCurrent()
    }

    override fun onCallEnd() {
        showCurrent()
    }

    private fun showCurrent() {
        items.clear()
        ApiClient.purchaseables(merchantSlug).forEach {
            items.add(it)
        }
        itemsAdapter?.notifyDataSetChanged()
    }
}
