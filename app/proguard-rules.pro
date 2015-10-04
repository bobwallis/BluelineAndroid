# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /home/bob/Projects/AndroidSdk/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class android.support.design.widget.** { *; }
-keep interface android.support.design.widget.** { *; }
-dontwarn android.support.design.**
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**