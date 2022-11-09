package com.merch.app.android

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.merch.app.PreferenceContext
import com.merch.app.SharedPreference
import com.merch.app.android.R

class UserBottomSheet : BottomSheetDialogFragment() {

    private val prefs = SharedPreference(PreferenceContext())

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.user_dialog_content, container, false)
    }

    companion object {
        const val TAG = "UserBottomSheet"
    }
}