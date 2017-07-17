package uk.me.rsw.bl.fragments;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.models.Method;
import uk.me.rsw.bl.widgets.NestedScrollView2;
import uk.me.rsw.bl.widgets.ViewPager2;


public class MethodGridFragment extends Fragment {

    private static final String ARG_METHOD = "method";
    private Method method;

    private MethodActivity mActivity;
    private NestedScrollView2 mScrollView;
    private WebView mWebView;

    public MethodGridFragment() {
    }

    // Use this to workaround Android bug 17535
    public class WebAppInterface {
        WebAppInterface() {}

        @JavascriptInterface
        public String queryString() {
            return "notation=" + method.getNotationExpanded() + "&stage=" + method.getStage() + "&calls=" + method.getCalls() + "&ruleOffs=" + method.getRuleOffs();
        }

        @JavascriptInterface
        public int maxLayoutHeight() {
            return mActivity.getAvailableSpace();
        }

        @JavascriptInterface
        public void disableNonWebViewTouchEvents() {
            ((ViewPager2) getActivity().findViewById(R.id.pager)).setPagingEnabled(false);
            mScrollView.setScrollingEnabled(false);
        }

        @JavascriptInterface
        public void enableNonWebViewTouchEvents() {
            ((ViewPager2) getActivity().findViewById(R.id.pager)).setPagingEnabled(true);
            mScrollView.setScrollingEnabled(true);
        }
    }

    public static MethodGridFragment newInstance(Method passedMethod) {
        MethodGridFragment fragment = new MethodGridFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_METHOD, passedMethod);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            method = (Method) getArguments().getSerializable(ARG_METHOD);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        mScrollView = (NestedScrollView2) inflater.inflate(R.layout.fragment_nonfocusable_webview_in_nestedscrollview, container, false);

        mWebView = (WebView) mScrollView.findViewById(R.id.webview);
        mWebView.addJavascriptInterface(new WebAppInterface(), "Android");
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDatabaseEnabled(true);
        String databasePath = getActivity().getApplicationContext().getDir("database", Context.MODE_PRIVATE).getPath();
        webSettings.setDatabasePath(databasePath);
        webSettings.setDomStorageEnabled(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setMinimumFontSize(1);

        mWebView.loadUrl("file:///android_asset/webviews/grids.html");
        mWebView.setOnLongClickListener(new View.OnLongClickListener() {
            public boolean onLongClick(View v) {
                return true;
            }
        });

        return mScrollView;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        mActivity = (MethodActivity) context;
    }

}
