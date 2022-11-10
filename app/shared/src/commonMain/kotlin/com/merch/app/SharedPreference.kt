package com.merch.app

expect class PreferenceContext
expect fun PreferenceContext.putInt(key: String, value: Int)
expect fun PreferenceContext.getInt(key: String, default: Int): Int
expect fun PreferenceContext.putString(key: String, value: String)
expect fun PreferenceContext.getString(key: String) : String?
expect fun PreferenceContext.putBool(key: String, value: Boolean)
expect fun PreferenceContext.getBool(key: String, default: Boolean): Boolean

class SharedPreference(private val context: PreferenceContext) {

    companion object {
        private val TokenKey = "LOGIN_TOKEN"
        private val EmailKey = "USER_EMAIL"
        private val NameKey = "USER_NAME"
    }

    private fun put(key: String, value: Int) {
        context.putInt(key, value)
    }

    private fun put(key: String, value: String) {
        context.putString(key, value)
    }

    private fun put(key: String, value: Boolean) {
        context.putBool(key, value)
    }

    private fun getInt(key: String, default: Int): Int = context.getInt(key, default)

    private fun getString(key: String): String? = context.getString(key)

    private fun getBool(key: String, default: Boolean): Boolean = context.getBool(key, default)

    val hasToken get() = !getString(SharedPreference.TokenKey).isNullOrEmpty()

    var token
        get() = getString(SharedPreference.TokenKey) ?: ""
        set(value) = put(SharedPreference.TokenKey, value)

    var email: String
        get() = getString(SharedPreference.EmailKey) ?: ""
        set(value) = put(SharedPreference.EmailKey, value)

    var name: String
        get() = getString(SharedPreference.NameKey) ?: ""
        set(value) = put(SharedPreference.NameKey, value)
}
