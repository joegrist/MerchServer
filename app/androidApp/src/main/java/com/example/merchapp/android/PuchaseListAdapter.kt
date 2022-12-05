package com.merch.app.android

import PurchaseDTO
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class PurchaseListAdapter(val list: ArrayList<PurchaseDTO>): RecyclerView.Adapter<PurchaseListAdapter.PurchaseViewHolder>() {

    class PurchaseViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView? = view.findViewById(R.id.purchase_name)
        val sub: TextView? = view.findViewById(R.id.purchase_variants)
        val qty: TextView? = view.findViewById(R.id.purchase_qty)
        val inc: ImageButton? = view.findViewById(R.id.inc)
        val dec: ImageButton? = view.findViewById(R.id.dec)
    }

    var incClick: ((Int, String) -> Unit)? = null
    var decClick: ((Int, String) -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PurchaseViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.list_item_purchase, parent, false)
        return PurchaseViewHolder(view)
    }

    override fun onBindViewHolder(holder: PurchaseViewHolder, position: Int) {

        val purchase = list[position]

        holder.title?.text = purchase.purchaseable.name
        holder.sub?.text = purchase.variation
        holder.qty?.text = purchase.quantity.toString()

        holder.inc?.setOnClickListener {
            incClick?.invoke(position, purchase.id)
        }

        holder.dec?.setOnClickListener {
            decClick?.invoke(position, purchase.id)
        }
    }

    override fun getItemCount(): Int {
        return list.count()
    }
}