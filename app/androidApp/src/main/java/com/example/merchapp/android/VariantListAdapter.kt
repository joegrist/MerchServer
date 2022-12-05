package com.merch.app.android

import ApiClient
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class VariantListAdapter(val list: ArrayList<String>, val purchaseableId: Long): RecyclerView.Adapter<VariantListAdapter.VariantViewHolder>() {

    class VariantViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val qty: TextView = v.findViewById(R.id.variant_qty)
        val inc: ImageButton = v.findViewById(R.id.variant_inc)
        val dec: ImageButton = v.findViewById(R.id.variant_dec)
        val name: TextView = v.findViewById(R.id.variant_name)
    }

    var incClick: ((String) -> Unit)? = null
    var decClick: ((String) -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VariantViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.list_item_purchaseable_variant, parent, false)

        return VariantViewHolder(view)
    }

    override fun onBindViewHolder(holder: VariantViewHolder, position: Int) {

        val s = list[position]
        val q = ApiClient.cartVariantQuantity(purchaseableId, s)

        holder.name.text = s
        holder.qty.text = q.toString()

        holder.inc.setOnClickListener {
            incClick?.invoke(s)
        }

        holder.dec.setOnClickListener {
            decClick?.invoke(s)
        }
    }

    override fun getItemCount(): Int {
        return list.count()
    }
}