package com.merch.app.android

import ApiClient
import IObserver
import android.os.Bundle
import android.provider.ContactsContract.CommonDataKinds.Email
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import com.google.android.material.textfield.TextInputEditText
import com.merch.app.SharedPreference

class CheckoutBottomSheet : BaseBottomSheetDialogFragment() {

    var done: Button? = null
    var buy: Button? = null
    companion object {
        const val TAG = "CheckoutBottomSheet"
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.checkout_dialog_content, container, false)
        done = view.findViewById(R.id.checkout_done)
        buy = view.findViewById(R.id.checkout_buy)

        done?.setOnClickListener {
            dismiss()
        }

        buy?.setOnClickListener {
            ApiClient.checkout()
            dismiss()
        }

        return view
    }
}