package uk.me.rsw.bl;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.preference.PreferenceManager;
import android.webkit.WebView;

import com.google.firebase.FirebaseApp;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.util.Map;

public class Blueline extends Application {

    public void onCreate() {
        // Firebase
        FirebaseApp.initializeApp(this);

        super.onCreate();

        // Initialise preferences
        PreferenceManager.setDefaultValues(this, R.xml.preferences, false);
        Map<String,?> keys = PreferenceManager.getDefaultSharedPreferences(this).getAll();

        // Disable Firebase analytics data collection
        FirebaseAnalytics.getInstance(this).setAnalyticsCollectionEnabled(false);

        // Enable WebView debugging if developing
        if (0 != (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE)) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
    }
}
