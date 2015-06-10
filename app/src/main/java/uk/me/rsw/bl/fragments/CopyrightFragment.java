package uk.me.rsw.bl.fragments;


import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.AboutActivity;
import uk.me.rsw.bl.widgets.ScrollView2;

public class CopyrightFragment extends Fragment {

    private AboutActivity mActivity;
    private ScrollView2 mScrollView;
    private WebView mWebView;

    public CopyrightFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_webview_in_card, container, false);

        TypedValue tv = new TypedValue();
        int actionBarHeight = 56;
        if (mActivity.getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
            actionBarHeight = TypedValue.complexToDimensionPixelSize(tv.data, getResources().getDisplayMetrics());
        }

        mScrollView = (ScrollView2) view.findViewById(R.id.scrollview);
        mScrollView.setPadding(0, actionBarHeight, 0, 0);
        mScrollView.setOnScrollChangedListener(mActivity);

        mWebView = (WebView) view.findViewById(R.id.webview);
        mWebView.loadUrl("file:///android_asset/html/copyright.html");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            ((ViewGroup) mWebView.getParent()).setTransitionGroup(true);
        }

        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mActivity = (AboutActivity) activity;
    }

}
