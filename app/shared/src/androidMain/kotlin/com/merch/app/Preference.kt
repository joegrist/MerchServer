package com.merch.app

const val SP_NAME = "merch_app"

actual fun PreferenceContext.putInt(key: String, value: Int) {
    getSpEditor().putInt(key, value).apply()
}

actual fun PreferenceContext.getInt(key: String, default: Int): Int {
    return  getSp().getInt(key, default )
}

actual fun PreferenceContext.putString(key: String, value: String) {
    getSpEditor().putString(key, value).apply()
}

actual fun PreferenceContext.getString(key: String): String? {
    return  getSp().getString(key, null)
}

actual fun PreferenceContext.putBool(key: String, value: Boolean) {
    getSpEditor().putBoolean(key, value).apply()
}

actual fun PreferenceContext.getBool(key: String, default: Boolean): Boolean {
    return getSp().getBoolean(key, default)
}

private fun PreferenceContext.getSp() = getSharedPreferences(SP_NAME, 0)

private fun PreferenceContext.getSpEditor() = getSp().edit()