package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.util.AttributeSet;

import com.nineoldandroids.view.ViewHelper;

public class Toolbar extends android.support.v7.widget.Toolbar {

    public Toolbar(Context context) {
        super(context);
    }
    public Toolbar(Context context, AttributeSet attributeSet) {
        super(context, attributeSet);
    }
    public Toolbar(Context context, AttributeSet attributeSet, int defStyle) {
        super(context, attributeSet, defStyle);
    }

    public float getAmountVisible() {
        return getHeight() + ViewHelper.getTranslationY(this);
    }
    public void setAmountVisible(float amountVisible) {
        if (amountVisible < 0.0) {
            amountVisible = 0;
        }
        else if (amountVisible > getHeight()) {
            amountVisible = getHeight();
        }
        ViewHelper.setTranslationY(this, amountVisible - getHeight());
    }
}
