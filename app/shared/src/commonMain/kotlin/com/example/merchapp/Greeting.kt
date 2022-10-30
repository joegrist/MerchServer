package com.example.merchapp

class Greeting {
    fun greeting(): String {
        return "Hello, ${Platform().platform}!"
    }
}