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
import com.stripe.android.PaymentConfiguration
import com.stripe.android.paymentsheet.PaymentSheet
import com.stripe.android.paymentsheet.PaymentSheetResult

class MainActivity : AppCompatActivity(), IObserver  {

    private var loader: View? = null
    private var prefs: SharedPreference? = null
    var cartItemCount: TextView? = null
    lateinit var paymentSheet: PaymentSheet

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
        updateCartCount()
        paymentSheet = PaymentSheet(this, ::onPaymentSheetResult)
    }

    private fun onPaymentSheetResult(paymentSheetResult: PaymentSheetResult) {
        when(paymentSheetResult) {
            is PaymentSheetResult.Canceled -> {
                print("Payment Canceled")
            }
            is PaymentSheetResult.Failed -> {
                AlertDialog.Builder(this).setTitle(AlertStore.checkoutFailed.title).setMessage(AlertStore.checkoutFailed.message).setNegativeButton(android.R.string.ok, null).show()
                print("Payment Error: ${paymentSheetResult.error}")
            }
            is PaymentSheetResult.Completed -> {
                AlertDialog.Builder(this).setTitle(AlertStore.checkoutSucceeded.title).setMessage(AlertStore.checkoutSucceeded.message).setNegativeButton(android.R.string.ok, null).show()
                print("Payment Completed")
                ApiClient.afterPurchaseCompleted()
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = getNavigationController(R.id.nav_host_fragment)
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        super.onCreateOptionsMenu(menu)
        menuInflater.inflate(R.menu.top, menu)
        val item = menu?.findItem(R.id.top_menu_cart)
        val action = item?.actionView
        cartItemCount = action?.findViewById(R.id.cart_badge)
        action?.setOnClickListener{
            onOptionsItemSelected(item)
        }
        return true
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

    private fun updateCartCount() {
        val count = ApiClient.cartItemCount
        cartItemCount?.text = count.toString()
        cartItemCount?.visibility = if (count > 0) View.VISIBLE else View.GONE
    }

    fun showCart() {
        val modalBottomSheet = CartBottomSheet()
        modalBottomSheet.onProceedWithPurchase = {
            ApiClient.ensurePaymentIntent()
        }
        modalBottomSheet.show(supportFragmentManager, CartBottomSheet.TAG)
    }

    fun showLogin() {
        val modalBottomSheet = UserBottomSheet()
        modalBottomSheet.show(supportFragmentManager, UserBottomSheet.TAG)
    }

    fun showCheckout() {
        ApiClient.paymentIntent?.let {
            PaymentConfiguration.init(this, it.publishableKey)
            paymentSheet.presentWithPaymentIntent(
                it.paymentIntent,
                PaymentSheet.Configuration(
                    merchantDisplayName = "Masters Of Merch",
                    allowsDelayedPaymentMethods = true
                )
            )
        }
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
            AppEvent.LoginFailed -> {}
            AppEvent.UserDataUpdated -> {}
            AppEvent.CartUpdated -> {
                updateCartCount()
            }
            AppEvent.PaymentIntentUpdated -> {
                showCheckout()
            }
            AppEvent.PurchaseCompleted -> {}
        }
    }
}

