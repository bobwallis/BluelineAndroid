package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.webkit.WebView;

public class WebView2 extends WebView {
    public WebView2(Context context) {
        super(context);
    }
    public WebView2(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }
    public WebView2(Context context, AttributeSet attributeSet, int defStyle) {
        super(context, attributeSet, defStyle);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN){

            int temp_ScrollY = getScrollY();
            scrollTo(getScrollX(), getScrollY() + 1);
            scrollTo(getScrollX(), temp_ScrollY);

        }
        return super.onTouchEvent(event);
    }

}
