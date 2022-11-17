package com.merch.app.android

import ApiClient
import AppEvent
import IObserver
import android.os.Bundle
import android.view.*
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import com.merch.app.AlertStore
import com.merch.app.SharedPreference

class MainActivity : AppCompatActivity(), IObserver  {

    private var loader: View? = null
    private var prefs: SharedPreference? = null
    var triggerCheckout = false // YUCK smudgy state eww
    var cartItemCount: TextView? = null

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

    override fun onPrepareOptionsMenu(menu: Menu?): Boolean {
        val item = menu?.findItem(R.id.top_menu_cart)?.actionView
        cartItemCount = item?.findViewById(R.id.cart_badge)
        return true
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
                showCart()
                return true
            }
            R.id.top_menu_user -> {
                showLogin()
                return true
            }
        }

        return false
    }

    fun showCart() {
        val modalBottomSheet = CartBottomSheet()
        modalBottomSheet.onDismiss = {
            ApiClient.postCart()
            if (triggerCheckout) showCheckout()
        }
        modalBottomSheet.show(supportFragmentManager, CartBottomSheet.TAG)
    }

    fun showLogin() {
        val modalBottomSheet = UserBottomSheet()
        modalBottomSheet.show(supportFragmentManager, UserBottomSheet.TAG)
    }

    fun showCheckout() {
        triggerCheckout = false
        val modalBottomSheet = CheckoutBottomSheet()
        modalBottomSheet.show(supportFragmentManager, UserBottomSheet.TAG)
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

    override fun onEvent(event: AppEvent) {
        when(event) {
            AppEvent.LoggedIn -> {}
            AppEvent.LoggedOut -> {}
            AppEvent.PurchaseCompleted -> {
                AlertDialog.Builder(this).setTitle(AlertStore.checkoutSucceeded.title).setMessage(AlertStore.checkoutSucceeded.message).setNegativeButton(android.R.string.ok, null)
            }
            AppEvent.PurchaseFailed -> {
                AlertDialog.Builder(this).setTitle(AlertStore.checkoutFailed.title).setMessage(AlertStore.checkoutFailed.message).setNegativeButton(android.R.string.ok, null)
            }
            AppEvent.LoginFailed -> {}
            AppEvent.UserDataUpdated -> {}
            AppEvent.CartUpdated -> {
                cartItemCount?.text = ApiClient.cartItemCount.toString()
            }
        }
    }
}

