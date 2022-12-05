package com.merch.app.android

import ApiClient
import PurchaseableDTO
import android.app.Activity
import android.graphics.BitmapFactory
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import coil.load
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.InputStream
import java.net.URL


class PurchaseableListAdapter(val list: ArrayList<PurchaseableDTO>): RecyclerView.Adapter<PurchaseableListAdapter.PurchaseableListViewHolder>() {

    var onClick: ((View) -> Unit)? = null

    class PurchaseableListViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView? = view.findViewById(R.id.design_text_view)
        val sub: TextView? = view.findViewById(R.id.product_text_view)
        val image: ImageView? = view.findViewById(R.id.image_view)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PurchaseableListViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.list_item_purchaseable, parent, false)

        view.setOnClickListener {
            onClick?.invoke(it)
        }

        return PurchaseableListViewHolder(view)
    }

    override fun onBindViewHolder(holder: PurchaseableListViewHolder, position: Int) {
        val p = list[position]
        holder.title?.text = p.name
        holder.sub?.text = p.productName
        holder.image?.load("${ApiClient.imagesEndpoint}/${p.thumbnail}")
    }

    override fun getItemCount(): Int {
        return list.count()
    }
}