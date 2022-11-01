package com.example.merchapp.android

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
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.InputStream
import java.net.URL

class ViewListAdapter(private val context: Activity, private val list: ArrayList<PurchaseableViewDTO>): ArrayAdapter<PurchaseableViewDTO>(context, 0) {

    override fun getCount(): Int {
        return list.count()
    }

    override fun clear() {
        list.clear()
    }

    override fun add(`object`: PurchaseableViewDTO?) {
        if (`object` != null) {
            list.add(`object`)
        }
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val p: PurchaseableViewDTO = list[position]
        var view = convertView

        if (view == null) {
            val layoutInflater = LayoutInflater.from(context)
            view = layoutInflater.inflate(R.layout.list_item_purchaseable, null)
        }

        val title: TextView? = view?.findViewById(R.id.design_text_view)
        val sub: TextView? = view?.findViewById(R.id.product_text_view)
        val image: ImageView? = view?.findViewById(R.id.image_view)

        title?.text = p.name
        sub?.text = p.designName

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val bitmap =BitmapFactory.decodeStream(URL("http://hugo.lan:8888/${p.thumbnail}").content as InputStream)
                CoroutineScope(Dispatchers.Main).launch {
                    image?.setImageBitmap(bitmap)
                }
            } catch (e: Exception) {
                Log.w("Merch", "Error loading image: ${e.localizedMessage}")
            }
        }

        return view ?: View(context)
    }

 }