package uk.me.rsw.bl;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.preference.PreferenceManager;
import android.webkit.WebView;

import com.google.firebase.FirebaseApp;

public class Blueline extends Application {

    public void onCreate() {
        // Firebase
        FirebaseApp.initializeApp(this);

        super.onCreate();

        // Set default preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);

        // Enable WebView debugging if developing
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (0 != (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE)) {
                WebView.setWebContentsDebuggingEnabled(true);
            }
        }
    }
}
