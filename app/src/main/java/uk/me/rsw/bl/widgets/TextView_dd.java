package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.os.Build;
import android.text.Layout;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.ViewGroup;

import androidx.appcompat.widget.AppCompatTextView;

public class TextView_dd extends AppCompatTextView {

    public TextView_dd(Context context) {
        this(context, null, 0);
    }

    public TextView_dd(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TextView_dd(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        setDefaults();
    }

    public TextView_dd(Context context, String text) {
        this(context);
        this.setText(text);
    }

    private void setDefaults() {
        this.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        this.setPadding(0, 0, 0, 18);
        this.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        if(Build.VERSION.SDK_INT >= 23) {
            this.setHyphenationFrequency(Layout.HYPHENATION_FREQUENCY_FULL);
        }
    }
}
