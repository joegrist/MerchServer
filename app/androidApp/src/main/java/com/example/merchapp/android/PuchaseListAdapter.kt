package com.merch.app.android

import ApiClient
import PurchaseDTO
import PurchaseableDTO
import android.app.Activity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageButton
import android.widget.TextView

class PurchaseListAdapter(private val context: Activity, list: ArrayList<PurchaseDTO>): ArrayAdapter<PurchaseDTO>(context, 0, list) {

    var incClick: ((Int, String) -> Unit)? = null
    var decClick: ((Int, String) -> Unit)? = null

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {

        val purchase = getItem(position) ?: return View(context)
        val purchaseable: PurchaseableDTO = ApiClient.purchaseable(purchase.purchaseable.id)

        var view = convertView

        if (view == null) {
            val layoutInflater = LayoutInflater.from(context)
            view = layoutInflater.inflate(R.layout.list_item_purchase, null)
        }

        val title: TextView? = view?.findViewById(R.id.purchase_name)
        val sub: TextView? = view?.findViewById(R.id.purchase_variants)
        val qty: TextView? = view?.findViewById(R.id.purchase_qty)
        val inc: ImageButton? = view?.findViewById(R.id.inc)
        val dec: ImageButton? = view?.findViewById(R.id.dec)

        title?.text = purchaseable.name
        sub?.text = purchase.variation
        qty?.text = purchase.quantity.toString()

        inc?.setOnClickListener {
            incClick?.invoke(position, purchase.id)
        }

        dec?.setOnClickListener {
            decClick?.invoke(position, purchase.id)
        }

        return view ?: View(context)
    }
 }