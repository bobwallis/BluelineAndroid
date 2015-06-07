package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.util.AttributeSet;
import android.view.View;
import android.webkit.WebView;
import android.widget.ScrollView;

public class ScrollView2 extends ScrollView {
    public ScrollView2(Context context) {
        super(context);
    }
    public ScrollView2(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }
    public ScrollView2(Context context, AttributeSet attributeSet, int defStyle) {
        super(context, attributeSet, defStyle);
    }

    // Allow scroll listeners
    public interface OnScrollChangedListener {
        void onScrollChanged(ScrollView who, int l, int t, int oldl, int oldt);
    }
    private OnScrollChangedListener mOnScrollChangedListener;
    public void setOnScrollChangedListener(OnScrollChangedListener listener) {
        mOnScrollChangedListener = listener;
    }
    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {
        super.onScrollChanged(l, t, oldl, oldt);
        if (mOnScrollChangedListener != null) {
            mOnScrollChangedListener.onScrollChanged(this, l, t, oldl, oldt);
        }
    }

    // Prevent WebView children from stealing focus
    @Override
    public void requestChildFocus(View child, View focused) {
        if (focused instanceof WebView)
            return;
        super.requestChildFocus(child, focused);
    }
}
