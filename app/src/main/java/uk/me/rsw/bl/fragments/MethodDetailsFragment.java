package uk.me.rsw.bl.fragments;

import android.app.Activity;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import org.w3c.dom.Text;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.models.Method;
import uk.me.rsw.bl.widgets.ScrollView2;

public class MethodDetailsFragment extends Fragment {

    private static final String METHOD_DATA = "method_data";
    Method method;

    private MethodActivity mActivity;
    private ScrollView2 mScrollView;

    public MethodDetailsFragment() {
    }

    public static MethodDetailsFragment newInstance(Method passedMethod) {
        MethodDetailsFragment fragment = new MethodDetailsFragment();
        Bundle bundle = new Bundle();
        bundle.putSerializable(METHOD_DATA, passedMethod);
        fragment.setArguments(bundle);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        method = (Method) getArguments().getSerializable(METHOD_DATA);

        View view = inflater.inflate(R.layout.fragment_method_details, container, false);
        ViewGroup ll = (ViewGroup) view.findViewById(R.id.container);
        ViewGroup.LayoutParams lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        TextView t;

        TypedValue tv = new TypedValue();
        int actionBarHeight = 98;
        if (mActivity.getTheme().resolveAttribute(android.R.attr.actionBarSize, tv, true)) {
            actionBarHeight = TypedValue.complexToDimensionPixelSize(tv.data, getResources().getDisplayMetrics()) + (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 42, getResources().getDisplayMetrics());
        }

        mScrollView = (ScrollView2) view.findViewById(R.id.scrollview);
        mScrollView.setPadding(0, actionBarHeight, 0, 0);
        mScrollView.setOnScrollChangedListener(mActivity);

        t = new TextView(getActivity());
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        t.setText("Classification");
        t.setTypeface(null, Typeface.BOLD);
        ll.addView(t, lp);
        t = new TextView(getActivity());
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        t.setText(method.getFullClassification());
        ll.addView(t, lp);

        t = new TextView(getActivity());
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        t.setText("Place Notation");
        t.setPadding(0, 24, 0, 8);
        t.setTypeface(null, Typeface.BOLD);
        ll.addView(t, lp);
        t = new TextView(getActivity());
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        t.setText(method.getNotation());
        ll.addView(t, lp);

        if( !TextUtils.isEmpty(method.getLeadHead())) {
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText("Lead Head");
            t.setPadding(0, 24, 0, 8);
            t.setTypeface(null, Typeface.BOLD);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(method.getLeadHead() + " (Code: " + method.getLeadHeadCode() + ")");
            ll.addView(t, lp);
        }

        if( !method.getSymmetry().equals("None")) {
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText("Symmetry");
            t.setPadding(0, 24, 0, 8);
            t.setTypeface(null, Typeface.BOLD);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(method.getSymmetry());
            ll.addView(t, lp);
        }

        if (method.getLengthOfLead() != 0) {
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText("Lead Length");
            t.setPadding(0, 24, 0, 8);
            t.setTypeface(null, Typeface.BOLD);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(method.getLengthOfLead().toString());
            ll.addView(t, lp);
        }

        if (method.getNumberOfHunts() != -1) {
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText("Hunt Bells");
            t.setPadding(0, 24, 0, 8);
            t.setTypeface(null, Typeface.BOLD);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(method.getNumberOfHunts().toString());
            ll.addView(t, lp);
        }

        return view;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mActivity = (MethodActivity) activity;
    }

}
