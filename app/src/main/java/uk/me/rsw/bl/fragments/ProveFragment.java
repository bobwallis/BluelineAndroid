package uk.me.rsw.bl.fragments;


import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.widget.NestedScrollView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.ProveActivity;

public class ProveFragment extends Fragment {

    private NestedScrollView mNestedScrollView;
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
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_webview_in_nestedscrollview, container, false);

        mNestedScrollView = (NestedScrollView) view.findViewById(R.id.scrollview);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.addJavascriptInterface(new WebAppInterface(getActivity()), "Android");
        mWebView.setWebViewClient(new blWebViewClient());
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

        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        mActivity = (ProveActivity) context;
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


    private class blWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
            return true;
        }
    }
}
