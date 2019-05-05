package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebView;

import androidx.core.widget.NestedScrollView;

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


    // Allow scrolling to be enabled or disabled
    private boolean isScrollingEnabled = true;

    public void setScrollingEnabled(boolean enabled) {
        isScrollingEnabled = enabled;
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        return (this.isScrollingEnabled || event.getAction() != MotionEvent.ACTION_DOWN) && super.onTouchEvent(event);
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent event) {
        // Bit of a bodge... but sometimes we hit a race condition when touch events happen
        // while we're in the middle of swapping between consuming touches in the WebView and in
        // the ViewPager/NestedScrollView. This ends up with Android firing a touch event for a
        // pointer that it never actually started tracking. Which causes a crash when it looks up
        // the pointer in the list of pointers being tracked and can't find it.
        // Stop a crash by catching the error and ignoring it.
        try {
            return this.isScrollingEnabled && super.onInterceptTouchEvent(event);
        } catch (IllegalArgumentException e) {
            //e.printStackTrace();
            return false;
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
