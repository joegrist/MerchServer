package com.merch.app.android

import ApiClient
import PurchaseableDTO
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
import androidx.recyclerview.widget.RecyclerView
import coil.load
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.InputStream
import java.net.URL

class ViewListAdapter(val list: ArrayList<PurchaseableViewDTO>): RecyclerView.Adapter<ViewListAdapter.PurchaseableViewHolder>() {

    class PurchaseableViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView? = view.findViewById(R.id.design_text_view)
        val image: ImageView? = view.findViewById(R.id.image_view)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PurchaseableViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.list_item_purchaseable_view, parent, false)

        return PurchaseableViewHolder(view)
    }

    override fun onBindViewHolder(holder: PurchaseableViewHolder, position: Int) {
        val p = list[position]
        holder.title?.text = p.name
        holder.image?.load("${ApiClient.imagesEndpoint}/${p.thumbnail}")
    }

    override fun getItemCount(): Int {
        return list.count()
    }
}