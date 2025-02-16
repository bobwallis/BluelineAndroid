package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.graphics.text.LineBreaker;
import android.os.Build;
import android.text.Layout;
import android.text.Spanned;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.ViewGroup;

import androidx.appcompat.widget.AppCompatTextView;

import java.util.Locale;

public class TextView_p extends AppCompatTextView {

    public TextView_p(Context context) {
        this(context, null, 0);
    }

    public TextView_p(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TextView_p(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        setDefaults();
    }

    public TextView_p(Context context, String text) {
        this(context);
        this.setText(text);
    }

    public TextView_p(Context context, Spanned text) {
        this(context);
        this.setText(text);
    }

    private void setDefaults() {
        this.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        this.setPadding(0, 18, 0, 18);
        this.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        this.setTextLocale(Locale.UK);
        if(Build.VERSION.SDK_INT >= 26) {
            this.setJustificationMode(Layout.JUSTIFICATION_MODE_INTER_WORD);
        }
        if(Build.VERSION.SDK_INT < 29) {
            if (Build.VERSION.SDK_INT >= 23) {
                this.setHyphenationFrequency(Layout.HYPHENATION_FREQUENCY_FULL);
                this.setBreakStrategy(Layout.BREAK_STRATEGY_HIGH_QUALITY);
            }
        }
        else {
            this.setJustificationMode(LineBreaker.JUSTIFICATION_MODE_INTER_WORD);
            this.setBreakStrategy(LineBreaker.BREAK_STRATEGY_HIGH_QUALITY);
        }
        this.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
    }
}
