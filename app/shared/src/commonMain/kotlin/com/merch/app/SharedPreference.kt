package com.merch.app

expect class PreferenceContext
expect fun PreferenceContext.putInt(key: String, value: Int)
expect fun PreferenceContext.getInt(key: String, default: Int): Int
expect fun PreferenceContext.putString(key: String, value: String)
expect fun PreferenceContext.getString(key: String) : String?
expect fun PreferenceContext.putBool(key: String, value: Boolean)
expect fun PreferenceContext.getBool(key: String, default: Boolean): Boolean

class SharedPreference(private val context: PreferenceContext) {

    fun put(key: String, value: Int) {
        context.putInt(key, value)
    }

    fun put(key: String, value: String) {
        context.putString(key, value)
    }

    fun put(key: String, value: Boolean) {
        context.putBool(key, value)
    }

    fun getInt(key: String, default: Int): Int = context.getInt(key, default)


    fun getString(key: String): String? = context.getString(key)


    fun getBool(key: String, default: Boolean): Boolean =
        context.getBool(key, default)

}
