package uk.me.rsw.bl;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.preference.PreferenceManager;
import android.webkit.WebView;

import com.google.android.gms.analytics.GoogleAnalytics;
import com.google.android.gms.analytics.Logger;
import com.google.android.gms.analytics.Tracker;

public class Blueline extends Application {

    public static GoogleAnalytics analytics;
    public static Tracker tracker;

    public void onCreate() {
        // Analytics
        analytics = GoogleAnalytics.getInstance(this);
        analytics.setLocalDispatchPeriod(1800);
        analytics.enableAutoActivityReports(this);
        tracker = analytics.newTracker("UA-11877145-3");
        tracker.enableExceptionReporting(true);
        tracker.enableAdvertisingIdCollection(true);
        tracker.enableAutoActivityTracking(true);

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
