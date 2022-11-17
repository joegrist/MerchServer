package com.merch.app.android

import ApiClient
import PurchaseableDTO
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

        ApiClient.add(this)

        purchaseableId = args.purchaseableId
        purchaseable = ApiClient.purchaseable(purchaseableId)

        viewList = getView()?.findViewById(R.id.view_list)
        variantList = getView()?.findViewById(R.id.variant_list)
        items = purchaseable?.views ?: arrayListOf()
        viewsAdapter = ViewListAdapter(requireActivity(), items)
        variantsAdapter = VariantListAdapter(requireActivity(), arrayListOf(), purchaseableId)
        viewList?.adapter = viewsAdapter
        variantList?.adapter = variantsAdapter
        showCurrent()

        variantsAdapter?.incClick = { variation ->
            val purchase = ApiClient.purchase(purchaseableId, variation)?.let {
                ApiClient.incQuantity(it)
                ApiClient.postCart()
            }
        }

        variantsAdapter?.decClick = { variation ->
            val purchase = ApiClient.purchase(purchaseableId, variation)?.let {
                ApiClient.decQuantity(it)
                ApiClient.postCart()
            }
        }
    }

    override fun onCallEnd() {
        showCurrent()
        super.onCallEnd()
    }

    private fun showCurrent() {
        variants = purchaseable?.variations?.firstOrNull()?.optionsAsList ?: arrayOf()
        variantsAdapter?.clear()
        variants.forEach {
            variantsAdapter?.add(it)
        }
        variantsAdapter?.notifyDataSetChanged()
    }

    override fun onDestroyView() {
        ApiClient.remove(this)
        super.onDestroyView()
    }
}