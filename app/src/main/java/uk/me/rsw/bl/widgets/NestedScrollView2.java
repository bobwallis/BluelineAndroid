package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.support.v4.widget.NestedScrollView;
import android.util.AttributeSet;
import android.view.View;
import android.webkit.WebView;

public class NestedScrollView2 extends NestedScrollView {
    public NestedScrollView2(Context context) {
        super(context);
    }
    public NestedScrollView2(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }
    public NestedScrollView2(Context context, AttributeSet attributeSet, int defStyle) {
        super(context, attributeSet, defStyle);
    }

    // Prevent WebView children from stealing focus
    @Override
    public void requestChildFocus(View child, View focused) {
        if (focused instanceof WebView)
            return;
        super.requestChildFocus(child, focused);
    }
}
