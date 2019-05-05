package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;

import androidx.viewpager.widget.ViewPager;

public class ViewPager2 extends ViewPager {

    public ViewPager2(Context context) {
        super(context);
    }

    public ViewPager2(Context context, AttributeSet attrs) {
        super(context, attrs);
    }


    // Allow paging to be enabled or disabled
    private boolean isPagingEnabled = true;

    public void setPagingEnabled(boolean b) {
        this.isPagingEnabled = b;
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        return (this.isPagingEnabled || event.getAction() != MotionEvent.ACTION_DOWN) && super.onTouchEvent(event);
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
            return this.isPagingEnabled && super.onInterceptTouchEvent(event);
        } catch (IllegalArgumentException e) {
            //e.printStackTrace();
            return false;
        }
    }

}
