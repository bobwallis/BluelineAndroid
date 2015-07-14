package uk.me.rsw.bl.fragments;


import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ScrollView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.ProveActivity;

public class ProveFragment extends Fragment {

    private ScrollView mNestedScrollView;
    private ProveActivity mActivity;
    private WebView mWebView;

    public ProveFragment() {
    }

    public class WebAppInterface {
        Context mContext;

        WebAppInterface(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void scrollToBottom() {
            mNestedScrollView.post(new Runnable() {
                @Override
                public void run() {
                    mNestedScrollView.fullScroll(View.FOCUS_DOWN);
                }
            });
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_webview_in_card_and_scrollview, container, false);

        mNestedScrollView = (ScrollView) view.findViewById(R.id.scrollview);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.addJavascriptInterface(new WebAppInterface(getActivity()), "Android");
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDatabaseEnabled(true);
        String databasePath = mActivity.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        webSettings.setDatabasePath(databasePath);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            mWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        }

        mWebView.loadUrl("file:///android_asset/webviews/prove.html");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ((ViewGroup) mWebView.getParent()).setTransitionGroup(true);
        }

        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mActivity = (ProveActivity) activity;
    }

    @Override
    public void onPause() {
        super.onPause();
        mWebView.loadUrl("javascript:onPause()");
    }

}
