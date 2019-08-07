package uk.me.rsw.bl.fragments;


import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.widgets.TextView_h3;
import uk.me.rsw.bl.widgets.TextView_p;

public class PrivacyFragment extends Fragment {

    public PrivacyFragment() {
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_textcontainer, container, false);
        ViewGroup ll = (ViewGroup) view.findViewById(R.id.container);
        ViewGroup.LayoutParams lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        TextView t;

        t = new TextView_h3(getActivity());
        t.setPadding(0, 0, 0, 8);
        t.setText("Privacy Policy");
        ll.addView(t, lp);
        ll.addView(new TextView_p(getActivity(), "All data used by the app is stored only on your device and isn't transmitted anywhere, to anyone, at any point."), lp);

        return view;
    }
}
