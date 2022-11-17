package com.merch.app.android

import ApiClient
import android.app.Activity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageButton
import android.widget.TextView

class VariantListAdapter(private val context: Activity, list: ArrayList<String>, val purchaseableId: Long): ArrayAdapter<String>(context, 0, list) {

    var incClick: ((String) -> Unit)? = null
    var decClick: ((String) -> Unit)? = null

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val s = getItem(position) ?: return View(context)
        val q = ApiClient.cartVariantQuantity(purchaseableId, s)
        var view = convertView

        if (view == null) {
            val layoutInflater = LayoutInflater.from(context)
            view = layoutInflater.inflate(R.layout.list_item_purchaseable_variant, null)
        }

        val qty: TextView? = view?.findViewById(R.id.variant_qty)
        val inc: ImageButton? = view?.findViewById(R.id.variant_inc)
        val dec: ImageButton? = view?.findViewById(R.id.variant_dec)
        val name: TextView? = view?.findViewById(R.id.variant_name)

        name?.text = s
        qty?.text = q.toString()

        inc?.setOnClickListener {
            incClick?.invoke(s)
        }

        dec?.setOnClickListener {
            decClick?.invoke(s)
        }

        return view ?: View(context)
    }
 }