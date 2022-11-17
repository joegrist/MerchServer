package com.merch.app.android

import ApiClient
import ApiClient.cartValueCents
import PurchaseDTO
import android.content.DialogInterface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import java.text.NumberFormat

class CartBottomSheet : BaseBottomSheetDialogFragment() {

    var lv: ListView? = null
    var itemsAdapter: PurchaseListAdapter? = null
    var emptyMessage: TextView? = null
    var cartValue: TextView? = null
    var cartBuy: Button? = null
    var done: Button? = null
    var items: ArrayList<PurchaseDTO> = arrayListOf()
    var onDismiss: (() -> Unit)? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view =  inflater.inflate(R.layout.cart_dialog_content, container, false)
        lv = view.findViewById(R.id.cart_contents)
        emptyMessage = view.findViewById(R.id.cart_empty)
        cartValue = view.findViewById(R.id.cart_value)
        cartBuy = view.findViewById(R.id.cart_buy)
        done = view.findViewById(R.id.cart_done)
        itemsAdapter = PurchaseListAdapter(requireActivity(), items)
        lv?.adapter = itemsAdapter

        itemsAdapter?.incClick = { position, _ ->
            val purchase = items.get(position)
            ApiClient.incQuantity(purchase)
            showCurrent()
        }

        itemsAdapter?.decClick = { position, _->
            val purchase = items.get(position)
            ApiClient.decQuantity(purchase)
            showCurrent()
        }

        cartBuy?.setOnClickListener {
            mainActivity.triggerCheckout = true // UGLY!! FIX
            dismiss()
        }

        done?.setOnClickListener {
            dismiss()
        }

        showCurrent()
        return view
    }

    companion object {
        const val TAG = "com.merch.app.android.CartBottomSheet"
    }

    private fun showCurrent() {
        items.clear()
        ApiClient.purchases().forEach {
            items.add(it)
        }
        itemsAdapter?.notifyDataSetChanged()
        val empty = items.isEmpty()
        emptyMessage?.visibility = if (empty) View.VISIBLE else View.GONE
        cartBuy?.visibility = if (empty) View.GONE else View.VISIBLE
        val format = NumberFormat.getCurrencyInstance()
        cartValue?.text = format.format(cartValueCents() / 100)
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        onDismiss?.invoke()
    }
}