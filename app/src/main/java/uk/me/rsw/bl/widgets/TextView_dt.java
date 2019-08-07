package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.ViewGroup;

import androidx.appcompat.widget.AppCompatTextView;

public class TextView_dt extends AppCompatTextView {

    public TextView_dt(Context context) {
        this(context, null, 0);
    }

    public TextView_dt(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TextView_dt(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        setDefaults();
    }

    public TextView_dt(Context context, String text) {
        this(context);
        this.setText(text);
    }

    private void setDefaults() {
        this.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        this.setPadding(0, 18, 0, 4);
        this.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        this.setTypeface(null, Typeface.BOLD);
    }
}
