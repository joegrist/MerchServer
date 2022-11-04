package com.example.merchapp.android

import ApiClient
import PurchaseableDTO
import PurchaseableViewDTO
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs

class Purchaseable : BaseFragment() {

    val args: PurchaseableArgs by navArgs()

    private var purchaseableId: Long = 0
    private var purchaseable: PurchaseableDTO? = null
    private var title: TextView? = null
    private var list: ListView? = null
    private var button: Button? = null
    private val client = ApiClient()
    var itemsAdapter: ViewListAdapter? = null
    var items: ArrayList<PurchaseableViewDTO> = arrayListOf()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.purchaseable, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        purchaseableId = args.purchaseableId

        title = getView()?.findViewById(R.id.title)
        list = getView()?.findViewById(R.id.view_list)
        button = getView()?.findViewById(R.id.order_button)

        purchaseable = client.purchaseable(purchaseableId)

        title?.text = purchaseable?.name
        items = purchaseable?.views ?: arrayListOf()
        itemsAdapter = ViewListAdapter(requireActivity(), items)
        list?.adapter = itemsAdapter
    }
}