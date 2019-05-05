package uk.me.rsw.bl.fragments;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.models.Method;


public class MethodLineFragment extends Fragment {

    private static final String ARG_METHOD = "method";
    private static final String ARG_TYPE = "type";
    private Method method;
    private String type;
    private String layout;
    private String size;
    private String workingBell;

    private MethodActivity mActivity;
    private WebView mWebView;

    public MethodLineFragment() {
    }

    // Use this to workaround Android bug 17535
    public class WebAppInterface {

        WebAppInterface() {}

        @JavascriptInterface
        public String queryString() {
            return "size=" + size + "&layout=" + layout + "&type=" + type + "&workingBell="+ workingBell +"&notation=" + method.getNotationExpanded() + "&stage=" + method.getStage() + "&calls=" + method.getCalls() + "&callingPositions=" + method.getCallingPositions() + "&ruleOffs=" + method.getRuleOffs();
        }

        @JavascriptInterface
        public int maxLayoutHeight() {
            return mActivity.getAvailableSpace();
        }
    }

    public static MethodLineFragment newInstance(Method passedMethod) {
        MethodLineFragment fragment = new MethodLineFragment();
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
            type = prefs.getString("line_style", "numbers");
            layout = prefs.getString("line_layout", "oneRow");
            size = prefs.getString("line_size", "medium");
            workingBell = prefs.getString("workingBell", "heaviest");
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_nonfocusable_webview_in_nestedscrollview, container, false);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.addJavascriptInterface(new WebAppInterface(), "Android");
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDatabaseEnabled(true);
        String databasePath = mActivity.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        webSettings.setDatabasePath(databasePath);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setMinimumFontSize(1);
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
            webSettings.setTextZoom(100);
        }

        mWebView.loadUrl("file:///android_asset/webviews/lines.html");
        mWebView.setOnLongClickListener(new View.OnLongClickListener() {
            public boolean onLongClick(View v) {
                return true;
            }
        });

        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        mActivity = (MethodActivity) context;
    }

}
