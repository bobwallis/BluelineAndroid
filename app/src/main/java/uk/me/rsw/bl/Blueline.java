package uk.me.rsw.bl;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.preference.PreferenceManager;
import android.webkit.WebView;

import com.crashlytics.android.Crashlytics;
import com.google.firebase.FirebaseApp;

import java.util.Map;

public class Blueline extends Application {

    public void onCreate() {
        // Firebase
        FirebaseApp.initializeApp(this);

        super.onCreate();

        // Initialise preferences and set initial Crashlytics keys
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);
        Map<String,?> keys = PreferenceManager.getDefaultSharedPreferences(this).getAll();
        for(Map.Entry<String,?> entry : keys.entrySet()) {
            Crashlytics.setString(entry.getKey(), entry.getValue().toString());
        }

        // Enable WebView debugging if developing
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (0 != (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE)) {
                WebView.setWebContentsDebuggingEnabled(true);
            }
        }
    }
}
