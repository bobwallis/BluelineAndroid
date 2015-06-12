package uk.me.rsw.bl.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.models.Method;
import uk.me.rsw.bl.widgets.ScrollView2;


public class MethodGridFragment extends Fragment {

    private static final String ARG_METHOD = "method";
    private static final String ARG_TYPE = "type";
    private Method method;
    private String type;
    private String layout;
    private String size;

    private MethodActivity mActivity;
    private ScrollView2 mScrollView;
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
            return "size=" + size + "&layout=" + layout + "&type=" + type + "&notation=" + method.getNotationExpanded() + "&stage=" + method.getStage() + "&calls=" + method.getCalls() + "&callingPositions=" + method.getCallingPositions() + "&ruleOffs=" + method.getRuleOffs();
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
            layout = prefs.getString(type + "_layout", "oneColumn");
            size = prefs.getString(type + "_size", "medium");
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_webview_in_card, container, false);


        TypedValue tv = new TypedValue();
        int actionBarHeight = 98;
        if (mActivity.getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
            actionBarHeight = TypedValue.complexToDimensionPixelSize(tv.data, getResources().getDisplayMetrics()) + (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 42, getResources().getDisplayMetrics());
        }

        mScrollView = (ScrollView2) view.findViewById(R.id.scrollview);
        mScrollView.setPadding(0, actionBarHeight, 0, 0);
        mScrollView.setOnScrollChangedListener(mActivity);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.addJavascriptInterface(new WebAppInterface(getActivity()), "Android");
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);

        mWebView.loadUrl("file:///android_asset/html/grid.html");
        mWebView.setOnLongClickListener(new View.OnLongClickListener() {
            public boolean onLongClick(View v) {
                return true;
            }
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ((ViewGroup) mWebView.getParent()).setTransitionGroup(true);
        }

        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mActivity = (MethodActivity) activity;
    }

}
