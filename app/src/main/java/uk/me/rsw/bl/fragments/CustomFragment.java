package uk.me.rsw.bl.fragments;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.CustomActivity;
import uk.me.rsw.bl.activities.MainActivity;
import uk.me.rsw.bl.activities.MethodActivity;

public class CustomFragment extends Fragment {

    private CustomActivity mActivity;
    private WebView mWebView;

    public CustomFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_webview_in_nestedscrollview, container, false);

        mWebView = (WebView) view.findViewById(R.id.webview);
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDatabaseEnabled(true);
        String databasePath = mActivity.getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        webSettings.setDatabasePath(databasePath);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);

        mWebView.loadUrl("file:///android_asset/webviews/custom.html");

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Uri uri= Uri.parse(url);
                Intent intent = new Intent(getActivity(), MethodActivity.class);
                intent.putExtra(MainActivity.METHOD_TITLE, "Custom Method");
                intent.putExtra(MainActivity.METHOD_CUSTOM, true);
                intent.putExtra(MainActivity.METHOD_STAGE, Integer.parseInt(uri.getQueryParameter("stage")));
                intent.putExtra(MainActivity.METHOD_NOTATION, uri.getQueryParameter("notation"));
                getActivity().startActivity(intent);
                InputMethodManager inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                inputMethodManager.hideSoftInputFromWindow(mWebView.getApplicationWindowToken(), 0);
                return true;
            }
        });

        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mActivity = (CustomActivity) activity;
    }

    @Override
    public void onPause() {
        super.onPause();
        mWebView.loadUrl("javascript:onPause()");
    }

    @Override
    public void onResume() {
        super.onResume();
        mWebView.loadUrl("javascript:onResume()");
    }

}
