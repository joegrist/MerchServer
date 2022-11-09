package com.merch.app.android

import ApiClient
import PurchaseDTO
import PurchaseableDTO
import android.app.Activity
import android.graphics.BitmapFactory
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.InputStream
import java.net.URL

class PurchaseListAdapter(private val context: Activity, list: ArrayList<PurchaseDTO>): ArrayAdapter<PurchaseDTO>(context, 0, list) {

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

        }

        dec?.setOnClickListener {

        }

        return view ?: View(context)
    }
 }