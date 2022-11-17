package com.merch.app.android

import ApiClient
import PurchaseDTO
import PurchaseableDTO
import PurchaseableVariationDTO
import PurchaseableViewDTO
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import androidx.core.view.get
import androidx.navigation.fragment.navArgs

class Purchaseable : BaseFragment() {

    val args: PurchaseableArgs by navArgs()

    private var purchaseableId: Long = 0
    private var purchaseable: PurchaseableDTO? = null
    private var viewList: ListView? = null
    private var variantList: ListView? = null
    var viewsAdapter: ViewListAdapter? = null
    var variantsAdapter: VariantListAdapter? = null
    var items: ArrayList<PurchaseableViewDTO> = arrayListOf()
    var variants: Array<String> = arrayOf()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.purchaseable, container, false)
    }

    fun qty(variation: String): Long {
        return ApiClient.cartVariantQuantity(purchaseableId, variation).toLong()
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        purchaseableId = args.purchaseableId
        purchaseable = ApiClient.purchaseable(purchaseableId)

        viewList = getView()?.findViewById(R.id.view_list)
        variantList = getView()?.findViewById(R.id.variant_list)
        items = purchaseable?.views ?: arrayListOf()
        variants = purchaseable?.variations?.firstOrNull()?.optionsAsList ?: arrayOf()
        viewsAdapter = ViewListAdapter(requireActivity(), items)
        variantsAdapter = VariantListAdapter(requireActivity(), variants, purchaseableId)
        viewList?.adapter = viewsAdapter
        variantList?.adapter = variantsAdapter

        variantsAdapter?.incClick = { variation ->

            ApiClient.purchase(
                purchasableId = purchaseableId,
                variation = variation ?: "",
                quantity = qty(variation) + 1
            )
        }

        variantsAdapter?.decClick = { variation ->
            ApiClient.purchase(
                purchasableId = purchaseableId,
                variation = variation ?: "",
                quantity = qty(variation) - 1
            )
        }
    }
}