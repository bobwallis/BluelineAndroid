package uk.me.rsw.bl;

import android.app.Application;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.webkit.WebView;

public class Blueline extends Application {
    public void onCreate() {
        super.onCreate();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (0 != (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE)) {
                WebView.setWebContentsDebuggingEnabled(true);
            }
        }
    }
}
