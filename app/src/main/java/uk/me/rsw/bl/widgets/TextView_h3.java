package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.ViewGroup;

import androidx.appcompat.widget.AppCompatTextView;
import androidx.core.view.GravityCompat;

import uk.me.rsw.bl.R;

public class TextView_h3 extends AppCompatTextView {

    public TextView_h3(Context context) {
        this(context, null, 0);
    }

    public TextView_h3(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TextView_h3(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        setDefaults();
    }

    public TextView_h3(Context context, String text) {
        this(context);
        setDefaults();
        this.setText(text);
    }

    private void setDefaults() {
        this.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        this.setPadding(0, 18, 0, 8);
        this.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        this.setGravity(GravityCompat.START | Gravity.CENTER_VERTICAL);
        this.setTextColor(getResources().getColor(R.color.darkBlue));
        this.setAllCaps(true);
    }
}
