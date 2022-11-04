package com.example.merchapp.android

import android.view.View
import android.widget.ListView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment

open class BaseFragment: Fragment() {

    protected val lv get() = view?.findViewById(R.id.list_view) as? ListView
    protected val loader get() = view?.findViewById(R.id.loader) as? View
    private val navHostFragment get() =
        activity?.supportFragmentManager?.findFragmentById(R.id.nav_host_fragment) as? NavHostFragment
    protected val navController get() = navHostFragment?.navController
}