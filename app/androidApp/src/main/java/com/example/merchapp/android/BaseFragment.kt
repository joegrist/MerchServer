package com.merch.app.android

import AppEvent
import IObserver
import android.os.Bundle
import android.view.View
import android.widget.ListView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

open class BaseFragment: Fragment(), IObserver {

    private val navHostFragment
        get() = activity?.supportFragmentManager?.findFragmentById(R.id.nav_host_fragment) as? NavHostFragment
    protected val navController
        get() = navHostFragment?.navController

    val mainActivity get() = activity as MainActivity
    override fun onCall() {}
    override fun onCallEnd() {}
    override fun onEvent(event: AppEvent) {}
}

open class BaseBottomSheetDialogFragment: BottomSheetDialogFragment(), IObserver {
    val mainActivity get() = activity as MainActivity
    override fun onCall() {}
    override fun onCallEnd() {}
    override fun onEvent(event: AppEvent) {}
}