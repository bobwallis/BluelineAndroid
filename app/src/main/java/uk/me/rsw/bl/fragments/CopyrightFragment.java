package uk.me.rsw.bl.fragments;


import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import uk.me.rsw.bl.R;

public class CopyrightFragment extends Fragment {

    public CopyrightFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_nonfocusable_webview_in_nestedscrollview, container, false);

        WebView mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.setWebViewClient(new blWebViewClient());
        mWebView.loadUrl("file:///android_asset/webviews/copyright.html");

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
