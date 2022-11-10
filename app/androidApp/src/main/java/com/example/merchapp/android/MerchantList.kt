package com.merch.app.android

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
import com.merch.app.Greeting


class MerchantList : BaseFragment()  {

    var lv: ListView? = null
    var itemsAdapter: ArrayAdapter<String>? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.merchant_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        lv = view.findViewById(R.id.merchant_list_list_view) as? ListView
        itemsAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, ArrayList<String>())
        lv?.adapter = itemsAdapter

        lv?.setOnItemClickListener { _, _, position, _ ->
            val m = ApiClient.merchants()[position]
            var action = MerchantListDirections.actionMerchantListToPurchaseableList(m.slug, m.name)
            navController?.navigate(action)
        }

        ApiClient.add(this)
        ApiClient.loadMerchants()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        ApiClient.remove(this)
    }

    override fun onCall() {
        showCurrent()
    }

    override fun onCallEnd() {
        showCurrent()
    }

    private fun showCurrent() {
        itemsAdapter?.clear()
        ApiClient.merchants().forEach {
            itemsAdapter?.add(it.name)
        }
        itemsAdapter?.notifyDataSetChanged()
    }
}
