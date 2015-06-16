package uk.me.rsw.bl.fragments;


import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import uk.me.rsw.bl.R;

public class AboutFragment extends Fragment {

    private WebView mWebView;

    public AboutFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_nonfocusable_webview_in_card, container, false);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.loadUrl("file:///android_asset/webviews/about.html");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ((ViewGroup) mWebView.getParent()).setTransitionGroup(true);
        }

        return view;
    }

}
