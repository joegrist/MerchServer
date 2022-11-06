package com.example.merchapp.android

import android.app.Activity
import android.os.Bundle
import android.view.*
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.navigation.NavController
import androidx.navigation.Navigation
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class MainActivity : AppCompatActivity()  {

    fun getNavigationController(res: Int): NavController {
        val navHostFragment = supportFragmentManager.findFragmentById(res) as NavHostFragment
        return navHostFragment.navController
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
            setContentView(R.layout.main)
            setSupportActionBar(findViewById(R.id.action_bar))
            val navController = getNavigationController(R.id.nav_host_fragment)
            NavigationUI.setupActionBarWithNavController(this, navController)
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
}

class UserBottomSheet : BottomSheetDialogFragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = inflater.inflate(R.layout.user_dialog_content, container, false)

    companion object {
        const val TAG = "UserBottomSheet"
    }
}
class CartBottomSheet : BottomSheetDialogFragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? = inflater.inflate(R.layout.cart_dialog_content, container, false)

    companion object {
        const val TAG = "CartBottomSheet"
    }
}