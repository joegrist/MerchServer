buildscript {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
    dependencies {
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.6.20")
        classpath("com.android.tools.build:gradle:7.3.1")
        classpath("io.realm.kotlin:gradle-plugin:1.4.0") // 1.4.0 broke Realm
        classpath("androidx.navigation:navigation-safe-args-gradle-plugin:2.5.3")
    }
}

plugins {
    kotlin("multiplatform") version "1.7.20" apply false
    kotlin("native.cocoapods") version "1.7.20" apply false
    id("io.realm.kotlin") version "1.4.0" apply false
    kotlin("plugin.serialization") version "1.7.20" apply false
}

allprojects {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}

//tasks.register("clean", Delete::class) {
//    delete(rootProject.buildDir)
//}