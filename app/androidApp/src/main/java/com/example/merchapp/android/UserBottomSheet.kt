package com.merch.app.android

import ApiClient
import IObserver
import android.os.Bundle
import android.provider.ContactsContract.CommonDataKinds.Email
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import com.google.android.material.textfield.TextInputEditText
import com.merch.app.SharedPreference

class UserBottomSheet : BaseBottomSheetDialogFragment() {

    private var prefs: SharedPreference? = null
    private var logInForm: View? = null
    private var logOutForm: View? = null
    private var logInButton: View? = null
    private var logOutButton: View? = null
    private var userName: TextView? = null
    private var emailField: TextInputEditText? = null
    private var passwordField: TextInputEditText? = null

    companion object {
        const val TAG = "UserBottomSheet"
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.user_dialog_content, container, false)
        prefs = SharedPreference(requireActivity().application)
        logInForm = view.findViewById(R.id.log_in_form)
        logOutForm = view.findViewById(R.id.log_out_form)
        logInButton = view.findViewById(R.id.log_in_button)
        logOutButton = view.findViewById(R.id.log_out_button)
        emailField = view.findViewById(R.id.login_email)
        passwordField = view.findViewById(R.id.login_password)
        userName = view.findViewById(R.id.logged_in_user_name)

        logInButton?.setOnClickListener {
            logIn()
        }

        logOutButton?.setOnClickListener {
            logOut()
        }

        ApiClient.add(this)
        update()
        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        ApiClient.remove(this)
    }

    fun logIn() {
        val e = emailField?.text.toString() ?: return
        val p = passwordField?.text.toString() ?: return

        ApiClient.login(
            email = e,
            password = p
        )
    }

    override fun onCall() {
        update()
    }

    override fun onCallEnd() {
        update()
    }

    private fun logOut() {
        prefs?.token = ""
        update()
    }

    private fun update() {
        val loggedIn = prefs?.hasToken ?: false
        logOutForm?.visibility = if (loggedIn) View.VISIBLE else View.GONE
        logInForm?.visibility = if (loggedIn) View.GONE else View.VISIBLE
        userName?.text = prefs?.name
        emailField?.setText(prefs?.email)
    }
}