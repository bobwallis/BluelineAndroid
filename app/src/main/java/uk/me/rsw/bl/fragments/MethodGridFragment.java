package uk.me.rsw.bl.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.models.Method;


public class MethodGridFragment extends Fragment {

    private static final String ARG_METHOD = "method";
    private static final String ARG_TYPE = "type";
    private Method method;
    private String type;
    private String layout;
    private String size;
    private String workingBell;

    private MethodActivity mActivity;
    private WebView mWebView;

    public MethodGridFragment() {
    }

    // Use this to workaround Android bug 17535
    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public String queryString() {
            return "size=" + size + "&layout=" + layout + "&type=" + type + "&workingBell="+ workingBell +"&notation=" + method.getNotationExpanded() + "&stage=" + method.getStage() + "&calls=" + method.getCalls() + "&callingPositions=" + method.getCallingPositions() + "&ruleOffs=" + method.getRuleOffs();
        }

        @JavascriptInterface
        public int maxLayoutHeight() {
            return mActivity.getAvailableSpace();
        }
    }

    public static MethodGridFragment newInstance(Method passedMethod, String type) {
        MethodGridFragment fragment = new MethodGridFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_METHOD, passedMethod);
        args.putString(ARG_TYPE, type);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(mActivity);
            method = (Method) getArguments().getSerializable(ARG_METHOD);
            type = getArguments().getString(ARG_TYPE);
            if (type != "grid") {
                type = prefs.getString("line_style", "numbers");
            }
            layout = prefs.getString("line_layout", "oneRow");
            size = prefs.getString("line_size", "medium");
            workingBell = prefs.getString("workingBell", "heaviest");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_nonfocusable_webview_in_nestedscrollview, container, false);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.addJavascriptInterface(new WebAppInterface(getActivity()), "Android");
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDatabaseEnabled(true);
        String databasePath = mActivity.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        webSettings.setDatabasePath(databasePath);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setMinimumFontSize(1);

        mWebView.loadUrl("file:///android_asset/webviews/grids.html");
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
