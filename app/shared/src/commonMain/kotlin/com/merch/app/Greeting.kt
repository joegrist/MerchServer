package com.merch.app

class Greeting {
    fun greeting(): String {
        return "Hello, ${Platform().platform}!"
    }
}