package uk.me.rsw.bl.fragments;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ScrollView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.CustomActivity;
import uk.me.rsw.bl.activities.MainActivity;
import uk.me.rsw.bl.activities.MethodActivity;

public class CustomFragment extends Fragment {

    private CustomActivity mActivity;
    private ScrollView mScrollView;
    private WebView mWebView;

    public CustomFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_custom, container, false);

        TypedValue tv = new TypedValue();
        int actionBarHeight = 56;
        if (mActivity.getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
            actionBarHeight = TypedValue.complexToDimensionPixelSize(tv.data, getResources().getDisplayMetrics());
        }

        mScrollView = (ScrollView) view.findViewById(R.id.scrollview);
        mScrollView.setPadding(0, actionBarHeight, 0, 0);

        mWebView = (WebView) view.findViewById(R.id.webview);
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setBuiltInZoomControls(false);

        mWebView.loadUrl("file:///android_asset/html/custom.html");

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Uri uri= Uri.parse(url);
                Intent intent = new Intent(getActivity(), MethodActivity.class);
                intent.putExtra(MainActivity.METHOD_TITLE, "Custom Method");
                intent.putExtra(CustomActivity.METHOD_STAGE, Integer.parseInt(uri.getQueryParameter("stage")));
                intent.putExtra(CustomActivity.METHOD_NOTATION, uri.getQueryParameter("notation"));
                getActivity().startActivity(intent);
                InputMethodManager inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                inputMethodManager.hideSoftInputFromWindow(mWebView.getApplicationWindowToken(), 0);
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
        mActivity = (CustomActivity) activity;
    }

}
