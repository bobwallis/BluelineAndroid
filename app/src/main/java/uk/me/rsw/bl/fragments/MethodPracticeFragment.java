package uk.me.rsw.bl.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.preference.PreferenceManager;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.models.Method;


public class MethodPracticeFragment extends Fragment {

    private static final String ARG_METHOD = "method";
    private Method method;
    private String workingBell;

    private MethodActivity mActivity;
    private WebView mWebView;

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
        public void buzz() {
            Vibrator v = (Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
            v.vibrate(50);
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
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_webview_in_card_and_nestedscrollview, container, false);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.addJavascriptInterface(new WebAppInterface(getActivity()), "Android");
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);

        mWebView.loadUrl("file:///android_asset/webviews/practice.html");
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
