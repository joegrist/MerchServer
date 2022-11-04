package com.example.merchapp.android

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
}