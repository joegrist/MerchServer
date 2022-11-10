package com.merch.app.android

import ApiClient
import PurchaseDTO
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import android.widget.TextView
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.merch.app.android.R
import java.lang.Long.max

class CartBottomSheet : BottomSheetDialogFragment() {

    var lv: ListView? = null
    var itemsAdapter: PurchaseListAdapter? = null
    var emptyMessage: TextView? = null
    var items: ArrayList<PurchaseDTO> = arrayListOf()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view =  inflater.inflate(R.layout.cart_dialog_content, container, false)
        lv = view.findViewById(R.id.cart_contents)
        emptyMessage = view.findViewById(R.id.cart_empty)
        itemsAdapter = PurchaseListAdapter(requireActivity(), items)
        lv?.adapter = itemsAdapter

        itemsAdapter?.incClick = { position, id ->
            val purchase = items.get(position)
            ApiClient.incQuantity(purchase)
            showCurrent()
        }

        itemsAdapter?.decClick = { position, id->
            val purchase = items.get(position)
            ApiClient.decQuantity(purchase)
            showCurrent()
        }

        showCurrent()
        return view
    }

    companion object {
        const val TAG = "com.example.merchapp.android.CartBottomSheet"
    }

    private fun showCurrent() {
        items.clear()
        ApiClient.purchases().forEach {
            items.add(it)
        }
        itemsAdapter?.notifyDataSetChanged()
        emptyMessage?.visibility = if (items.isEmpty()) View.VISIBLE else View.GONE
    }
}