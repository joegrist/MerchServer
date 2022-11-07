package com.example.merchapp.android

import ApiClient
import PurchaseableDTO
import PurchaseableVariationDTO
import PurchaseableViewDTO
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import androidx.navigation.fragment.navArgs

class Purchaseable : BaseFragment() {

    val args: PurchaseableArgs by navArgs()

    private var purchaseableId: Long = 0
    private var purchaseable: PurchaseableDTO? = null
    private var viewList: ListView? = null
    private var variantList: ListView? = null
    private val client = ApiClient()
    var viewsAdapter: ViewListAdapter? = null
    var variantsAdapter: VariantListAdapter? = null
    var items: ArrayList<PurchaseableViewDTO> = arrayListOf()
    var variants: Array<String> = arrayOf()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.purchaseable, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        purchaseableId = args.purchaseableId
        purchaseable = client.purchaseable(purchaseableId)

        viewList = getView()?.findViewById(R.id.view_list)
        variantList = getView()?.findViewById(R.id.variant_list)
        items = purchaseable?.views ?: arrayListOf()
        variants = purchaseable?.variations?.firstOrNull()?.optionsAsList ?: arrayOf()
        viewsAdapter = ViewListAdapter(requireActivity(), items)
        variantsAdapter = VariantListAdapter(requireActivity(), variants)
        viewList?.adapter = viewsAdapter
        variantList?.adapter = variantsAdapter
    }
}