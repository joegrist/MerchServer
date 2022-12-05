package com.merch.app.android

import ApiClient
import PurchaseableDTO
import PurchaseableViewDTO
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import coil.load


class Purchaseable : BaseFragment() {

    val args: PurchaseableArgs by navArgs()

    private var purchaseableId: Long = 0
    private var purchaseable: PurchaseableDTO? = null
    private var viewList: RecyclerView? = null
    private var variantList: RecyclerView? = null
    private var supplierLogo: ImageView? = null
    var viewsAdapter: ViewListAdapter? = null
    var variantsAdapter: VariantListAdapter? = null
    var items: ArrayList<PurchaseableViewDTO> = arrayListOf()
    var variants: Array<String> = arrayOf()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.purchaseable, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        ApiClient.add(this)

        purchaseableId = args.purchaseableId
        purchaseable = ApiClient.purchaseable(purchaseableId)

        viewList = getView()?.findViewById(R.id.view_list)
        variantList = getView()?.findViewById(R.id.variant_list)
        supplierLogo = getView()?.findViewById(R.id.supplier_logo)
        items = purchaseable?.views ?: arrayListOf()
        viewsAdapter = ViewListAdapter(items)
        variantsAdapter = VariantListAdapter(arrayListOf(), purchaseableId)
        viewList?.adapter = viewsAdapter
        variantList?.adapter = variantsAdapter
        supplierLogo?.load("${ApiClient.imagesEndpoint}/${purchaseable?.supplierThumbnail}")
        val horizontalLayoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
        viewList?.layoutManager = horizontalLayoutManager
        variantList?.layoutManager = LinearLayoutManager(activity)

        showCurrent()

        variantsAdapter?.incClick = { variation ->
            ApiClient.purchase(purchaseableId, variation)?.let {
                ApiClient.incQuantity(it)
            } ?: run {
                ApiClient.setCartPurchase(
                    purchaseableId = purchaseableId,
                    variation = variation,
                    quantity = 1
                )
            }
            ApiClient.postCart()
        }

        variantsAdapter?.decClick = { variation ->
            ApiClient.purchase(purchaseableId, variation)?.let {
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
        variantsAdapter?.list?.clear()
        for ((index, value) in variants.withIndex()) {
            variantsAdapter?.list?.add(value)
            variantsAdapter?.notifyItemChanged(index)
        }
    }

    override fun onDestroyView() {
        ApiClient.remove(this)
        super.onDestroyView()
    }
}