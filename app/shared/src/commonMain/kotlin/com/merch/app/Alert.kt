package com.merch.app

data class AlertDetails(public val title: String, public val message: String)

object AlertStore {
    val checkoutFailed = AlertDetails("Purchase Failed", "Try again later")
    val checkoutSucceeded = AlertDetails("All Done", "We have your order!")
}

