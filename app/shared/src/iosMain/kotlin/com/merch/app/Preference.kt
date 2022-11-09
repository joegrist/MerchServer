package com.merch.app

import platform.Foundation.NSUserDefaults
import platform.darwin.NSObject

actual typealias PreferenceContext = NSObject

actual fun PreferenceContext.putInt(key: String, value: Int) {
    NSUserDefaults.standardUserDefaults.setInteger(value.toLong(), key)
}

actual fun PreferenceContext.getInt(key: String, default: Int): Int {
    return NSUserDefaults.standardUserDefaults.integerForKey(key).toInt()
}

actual fun PreferenceContext.putString(key: String, value: String) {
    NSUserDefaults.standardUserDefaults.setObject(value, key)
}

actual fun PreferenceContext.getString(key: String): String? {
    return NSUserDefaults.standardUserDefaults.stringForKey(key)
}

actual fun PreferenceContext.putBool(key: String, value: Boolean) {
    NSUserDefaults.standardUserDefaults.setBool(value, key)
}

actual fun PreferenceContext.getBool(key: String, default: Boolean): Boolean {
    return NSUserDefaults.standardUserDefaults.boolForKey(key)
}