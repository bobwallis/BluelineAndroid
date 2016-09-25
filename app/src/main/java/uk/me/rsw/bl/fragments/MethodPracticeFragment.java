package uk.me.rsw.bl.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.support.v4.widget.NestedScrollView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.models.Method;
import uk.me.rsw.bl.widgets.WebView2;


public class MethodPracticeFragment extends Fragment {

    private static final String ARG_METHOD = "method";
    private Method method;
    private String workingBell;
    private Boolean vibrate;

    private MethodActivity mActivity;
    private WebView2 mWebView;

    public MethodPracticeFragment() {
    }

    // Use this to workaround Android bug 17535
    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public String queryString() {
            return "title=" + method.getTitle() + "&workingBell="+ workingBell +"&notation=" + method.getNotationExpanded() + "&stage=" + method.getStage() + "&ruleOffs=" + method.getRuleOffs();
        }

        @JavascriptInterface
        public int maxLayoutHeight() {
            Configuration configuration = mActivity.getResources().getConfiguration();
            return (configuration.screenHeightDp-107);
        }

        @JavascriptInterface
        public void buzz() {
            if( vibrate ) {
                Vibrator v = (Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
                v.vibrate(50);
            }
        }
    }

    public static MethodPracticeFragment newInstance(Method passedMethod) {
        MethodPracticeFragment fragment = new MethodPracticeFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_METHOD, passedMethod);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(mActivity);
            method = (Method) getArguments().getSerializable(ARG_METHOD);
            workingBell = prefs.getString("workingBell", "heaviest");
            vibrate = prefs.getBoolean("practice_vibrate", true);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_practice, container, false);
        mWebView = (WebView2) view.findViewById(R.id.webview2);

        mWebView.addJavascriptInterface(new WebAppInterface(getActivity()), "Android");
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDatabaseEnabled(true);
        String databasePath = mActivity.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        webSettings.setDatabasePath(databasePath);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);

        mWebView.loadUrl("file:///android_asset/webviews/practice.html");
        mWebView.setOnLongClickListener(new View.OnLongClickListener() {
            public boolean onLongClick(View v) {
                return true;
            }
        });

        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mActivity = (MethodActivity) activity;
    }

}
