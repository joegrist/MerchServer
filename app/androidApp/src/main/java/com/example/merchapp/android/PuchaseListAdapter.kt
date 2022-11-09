package com.merch.app.android

import PurchaseDTO
import android.app.Activity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.ImageButton
import android.widget.TextView

class PurchaseListAdapter(private val context: Activity, list: ArrayList<PurchaseDTO>): ArrayAdapter<PurchaseDTO>(context, 0, list) {

    var incClick: ((Int, String) -> Unit)? = null
    var decClick: ((Int, String) -> Unit)? = null

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {

        val p = getItem(position) ?: return View(context)
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

        title?.text = p.purchaseableName
        sub?.text = p.purchaseableVariations
        qty?.text = p.quantity.toString()

        inc?.setOnClickListener {
            incClick?.invoke(position, p.id)
        }

        dec?.setOnClickListener {
            decClick?.invoke(position, p.id)
        }

        return view ?: View(context)
    }
 }