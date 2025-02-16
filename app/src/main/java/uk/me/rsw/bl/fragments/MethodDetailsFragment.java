package uk.me.rsw.bl.fragments;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.models.Method;
import uk.me.rsw.bl.widgets.TextView_dt;
import uk.me.rsw.bl.widgets.TextView_p;

public class MethodDetailsFragment extends Fragment {

    private static final String METHOD_DATA = "method_data";

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
        assert getArguments() != null;
        Method method = (Method) getArguments().getSerializable(METHOD_DATA);

        View view = inflater.inflate(R.layout.fragment_textcontainer, container, false);
        ViewGroup ll = view.findViewById(R.id.container);
        ViewGroup.LayoutParams lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        TextView t;

        if(method.getProvisional()) {
            t = new TextView_dt(getActivity());
            t.setPadding(0, 0, 0, 4);
            t.setText("Method is provisionally named");
            ll.addView(t, lp);
            ll.addView(new TextView_p(getActivity(), " "), lp);
            ll.addView(new TextView_dt(getActivity(), "Classification"), lp);
        }
        else {
            t = new TextView_dt(getActivity());
            t.setPadding(0, 0, 0, 4);
            t.setText("Classification");
            ll.addView(t, lp);
        }
        ll.addView(new TextView_p(getActivity(), method.getFullClassification()), lp);

        ll.addView(new TextView_dt(getActivity(), "Place Notation"), lp);
        ll.addView(new TextView_p(getActivity(), method.getNotation()), lp);

        if( !TextUtils.isEmpty(method.getLeadHead())) {
            ll.addView(new TextView_dt(getActivity(), "Lead Head"), lp);
            ll.addView(new TextView_p(getActivity(), method.getLeadHead() + " (Code: " + method.getLeadHeadCode() + ")"), lp);
        }

        if( !method.getSymmetry().equals("None")) {
            ll.addView(new TextView_dt(getActivity(), "Symmetry"), lp);
            ll.addView(new TextView_p(getActivity(), method.getSymmetry()), lp);
        }

        if( !TextUtils.isEmpty(method.getFchGroups())) {
            ll.addView(new TextView_dt(getActivity(), "FCH Groups"), lp);
            ll.addView(new TextView_p(getActivity(), method.getFchGroups()), lp);
        }

        if (method.getNumberOfHunts() != -1) {
            ll.addView(new TextView_dt(getActivity(), "Hunt Bells"), lp);
            ll.addView(new TextView_p(getActivity(), method.getNumberOfHunts().toString()), lp);
        }

        if (method.getLengthOfLead() != 0) {
            ll.addView(new TextView_dt(getActivity(), "Lengths"), lp);
            t = new TextView_p(getActivity(), method.getLengthOfLead().toString() + " rows per lead");
            t.setPadding(0, 4, 0, 4);
            ll.addView(t, lp);
            ll.addView(new TextView_p(getActivity(), method.getLengthOfCourse().toString() + " rows per course ("+(String.valueOf(method.getLengthOfCourse()/method.getLengthOfLead()))+" leads)"), lp);
        }

        return view;
    }

}
