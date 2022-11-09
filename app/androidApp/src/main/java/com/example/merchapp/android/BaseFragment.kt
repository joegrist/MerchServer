package com.merch.app.android

import android.os.Bundle
import android.view.View
import android.widget.ListView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment

open class BaseFragment: Fragment() {

    private val navHostFragment
        get() = activity?.supportFragmentManager?.findFragmentById(R.id.nav_host_fragment) as? NavHostFragment
    protected val navController
        get() = navHostFragment?.navController

    fun showLoader() {
        (activity as MainActivity).loader(true)
    }

    fun hideLoader() {
        (activity as MainActivity).loader(false)
    }
}