package com.merch.app.android

import ApiClient
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class MerchantListAdapter(val list: ArrayList<String>) : RecyclerView.Adapter<MerchantListAdapter.MerchantViewHolder>() {

    var onClick: ((View) -> Unit)? = null

    class MerchantViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        val textView = v.findViewById<View>(R.id.merchant_name) as TextView
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MerchantViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.list_item_merchant, parent, false)
        view.setOnClickListener {
            onClick?.invoke(it)
        }
        return MerchantViewHolder(view)
    }

    override fun onBindViewHolder(holder: MerchantViewHolder, position: Int) {
        holder.textView.text = list[position]
    }

    override fun getItemCount(): Int {
        return list.count()
    }
}

class MerchantList : BaseFragment()  {

    var rv: RecyclerView? = null
    var itemsAdapter: MerchantListAdapter? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.merchant_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rv = view.findViewById(R.id.merchant_list_recycler_view) as? RecyclerView
        itemsAdapter = MerchantListAdapter(arrayListOf())
        rv?.layoutManager = LinearLayoutManager(activity)
        rv?.adapter = itemsAdapter

        itemsAdapter?.onClick = click@ { v ->
            val position = rv?.getChildLayoutPosition(v) ?: return@click
            val m = ApiClient.merchants()[position]
            var action = MerchantListDirections.actionMerchantListToPurchaseableList(m.slug, m.name)
            navController?.navigate(action)
        }

        ApiClient.add(this)
        ApiClient.initialLoad()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        ApiClient.remove(this)
    }

    override fun onCall() {
        showCurrent()
    }

    override fun onCallEnd() {
        showCurrent()
    }

    private fun showCurrent() {
        itemsAdapter?.list?.clear()
        for ((index, value) in ApiClient.merchants().withIndex()) {
            itemsAdapter?.list?.add(value.name)
            itemsAdapter?.notifyItemChanged(index)
        }
    }
}
