package uk.me.rsw.bl.fragments;

import android.graphics.Typeface;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.models.Method;

public class MethodDetailsFragment extends Fragment {

    private static final String METHOD_DATA = "method_data";
    Method method;

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
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        method = (Method) getArguments().getSerializable(METHOD_DATA);

        View view = inflater.inflate(R.layout.fragment_method_details, container, false);
        ViewGroup ll = (ViewGroup) view.findViewById(R.id.container);
        ViewGroup.LayoutParams lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        TextView t;

        if(method.getProvisional()) {
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText("Method is provisionally named");
            t.setTypeface(null, Typeface.BOLD);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(" ");
            t.setTextIsSelectable(true);
            ll.addView(t, lp);
        }

        t = new TextView(getActivity());
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        t.setText("Classification");
        t.setTypeface(null, Typeface.BOLD);
        ll.addView(t, lp);
        t = new TextView(getActivity());
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        t.setText(method.getFullClassification());
        t.setTextIsSelectable(true);
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
        t.setTextIsSelectable(true);
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
            t.setTextIsSelectable(true);
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
            t.setTextIsSelectable(true);
            ll.addView(t, lp);
        }

        if( !TextUtils.isEmpty(method.getFchGroups())) {
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText("FCH Groups");
            t.setPadding(0, 24, 0, 8);
            t.setTypeface(null, Typeface.BOLD);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(method.getFchGroups());
            t.setTextIsSelectable(true);
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
            t.setTextIsSelectable(true);
            ll.addView(t, lp);
        }

        if (method.getLengthOfLead() != 0) {
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText("Lengths");
            t.setPadding(0, 24, 0, 8);
            t.setTypeface(null, Typeface.BOLD);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(method.getLengthOfLead().toString() + " rows per lead");
            t.setTextIsSelectable(true);
            ll.addView(t, lp);
            t = new TextView(getActivity());
            t.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
            t.setText(method.getLengthOfCourse().toString() + " rows per course ("+(String.valueOf(method.getLengthOfCourse()/method.getLengthOfLead()))+" leads)");
            t.setTextIsSelectable(true);
            ll.addView(t, lp);
        }

        return view;
    }

}
