package com.merch.app.android

import ApiClient
import IObserver
import android.os.Bundle
import android.view.*
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import com.merch.app.SharedPreference

class MainActivity : AppCompatActivity(), IObserver  {

    private var loader: View? = null
    private var prefs: SharedPreference? = null

    fun getNavigationController(res: Int): NavController {
        val navHostFragment = supportFragmentManager.findFragmentById(res) as NavHostFragment
        return navHostFragment.navController
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        prefs = SharedPreference(application)
        ApiClient.prefs = prefs
        ApiClient.add(this)
        setContentView(R.layout.main)
        setSupportActionBar(findViewById(R.id.action_bar))
        val navController = getNavigationController(R.id.nav_host_fragment)
        NavigationUI.setupActionBarWithNavController(this, navController)
        loader = findViewById(R.id.loader) as? View
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = getNavigationController(R.id.nav_host_fragment)
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        super.onCreateOptionsMenu(menu)
        menuInflater.inflate(R.menu.top, menu);
        return true;
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {

        when (item.itemId) {
            R.id.top_menu_cart -> {
                val modalBottomSheet = CartBottomSheet()
                modalBottomSheet.show(supportFragmentManager, CartBottomSheet.TAG)
                return true
            }
            R.id.top_menu_user -> {
                val modalBottomSheet = UserBottomSheet()
                modalBottomSheet.show(supportFragmentManager, UserBottomSheet.TAG)
                return true
            }
        }

        return false
    }

    fun loader(visible: Boolean) {
        loader?.visibility = if (visible) View.VISIBLE else View.GONE
    }

    override fun onCall() {
        loader(true)
    }

    override fun onCallEnd() {
        loader(false)
    }
}

