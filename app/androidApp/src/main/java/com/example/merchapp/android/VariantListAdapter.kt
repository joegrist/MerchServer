package com.example.merchapp.android

import ApiClient
import PurchaseableVariationDTO
import PurchaseableViewDTO
import android.app.Activity
import android.graphics.BitmapFactory
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.TextView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.InputStream
import java.net.URL

class VariantListAdapter(private val context: Activity, list: Array<String>): ArrayAdapter<String>(context, 0, list) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val s= getItem(position) ?: return View(context)
        var view = convertView

        if (view == null) {
            val layoutInflater = LayoutInflater.from(context)
            view = layoutInflater.inflate(R.layout.list_item_purchaseable_variant, null)
        }

        val name: TextView? = view?.findViewById(R.id.variant_name)
        name?.text = s
        return view ?: View(context)
    }
 }