package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.os.Build;
import android.text.Layout;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.style.BulletSpan;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.ViewGroup;

import androidx.appcompat.widget.AppCompatTextView;

import java.util.Locale;

import uk.me.rsw.bl.R;

public class TextView_li extends AppCompatTextView {

    public TextView_li(Context context) {
        this(context, null, 0);
    }

    public TextView_li(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TextView_li(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        setDefaults();
    }

    public TextView_li(Context context, String text) {
        this(context);
        this.setTextLi(text);
    }

    public TextView_li(Context context, Spanned text) {
        this(context);
        this.setTextLi(text);
    }

    public void setTextLi(int resid) {
        this.setTextLi(getResources().getText(resid));
    }

    public void setTextLi(CharSequence text) {
        SpannableStringBuilder sb = new SpannableStringBuilder();
        Spannable spannable = new SpannableString(text);
        spannable.setSpan(new BulletSpan(28, getResources().getColor(R.color.darkBlue)), 0, spannable.length(), Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
        sb.append(spannable);
        this.setText(sb);
    }

    private void setDefaults() {
        this.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        this.setPadding(8, 4, 0, 4);
        this.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        if(Build.VERSION.SDK_INT >= 17) {
            this.setTextLocale(Locale.UK);
        }
        if(Build.VERSION.SDK_INT >= 23) {
            this.setHyphenationFrequency(Layout.HYPHENATION_FREQUENCY_FULL);
            this.setBreakStrategy(Layout.BREAK_STRATEGY_HIGH_QUALITY);
        }
        if(Build.VERSION.SDK_INT >= 26) {
            this.setJustificationMode(Layout.JUSTIFICATION_MODE_INTER_WORD);
        }
        this.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
    }
}
