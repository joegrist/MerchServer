package com.merch.app.android

import PurchaseDTO
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import java.text.FieldPosition

class Cart : BaseFragment() {

    var lv: ListView? = null
    var itemsAdapter: PurchaseListAdapter? = null
    var items: ArrayList<PurchaseDTO> = arrayListOf()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.cart, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        lv = view.findViewById(R.id.purchase_list)
        itemsAdapter = PurchaseListAdapter(requireActivity(), items)

        itemsAdapter?.incClick = { position, id ->
            increment(position, id)
        }

        itemsAdapter?.decClick = { position, id ->
            decrement(position, id)
        }
    }

    fun increment(position: Int, id: String) {

    }

    fun decrement(position: Int, id: String) {

    }
}