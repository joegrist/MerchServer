package com.merch.app.android

import ApiClient
import IObserver
import PurchaseableDTO
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class PurchaseableList : BaseFragment(), IObserver {

    private val args: PurchaseableListArgs by navArgs()
    var rv: RecyclerView? = null
    private var itemsAdapter: PurchaseableListAdapter? = null

    private var merchantSlug: String = "demo"

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.purchaseable_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rv = view.findViewById(R.id.purchaseable_list_recycler_view) as? RecyclerView
        merchantSlug = args.merchantSlug
        itemsAdapter = PurchaseableListAdapter(arrayListOf())
        rv?.adapter = itemsAdapter
        rv?.layoutManager = LinearLayoutManager(activity)

        itemsAdapter?.onClick = click@ { view ->
            val position = rv?.getChildLayoutPosition(view) ?: return@click
            val p = itemsAdapter?.list?.get(position) ?: return@click
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
        itemsAdapter?.list?.clear()
        for ((index, value) in ApiClient.purchaseables(merchantSlug).withIndex()) {
            itemsAdapter?.list?.add(value)
            itemsAdapter?.notifyItemChanged(index)
        }
    }
}
