package uk.me.rsw.bl.fragments;


import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import uk.me.rsw.bl.R;

public class AboutFragment extends Fragment {

    private WebView mWebView;

    public AboutFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_nonfocusable_webview_in_card_and_nestedscrollview, container, false);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.setWebViewClient(new blWebViewClient());
        mWebView.loadUrl("file:///android_asset/webviews/about.html");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ((ViewGroup) mWebView.getParent()).setTransitionGroup(true);
        }

        return view;
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
