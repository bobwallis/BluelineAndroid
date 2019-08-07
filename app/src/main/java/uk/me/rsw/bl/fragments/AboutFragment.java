package uk.me.rsw.bl.fragments;


import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.text.HtmlCompat;
import androidx.fragment.app.Fragment;

import uk.me.rsw.bl.BuildConfig;
import uk.me.rsw.bl.R;
import uk.me.rsw.bl.widgets.TextView_h3;
import uk.me.rsw.bl.widgets.TextView_li;
import uk.me.rsw.bl.widgets.TextView_p;

public class AboutFragment extends Fragment {

    public AboutFragment() {
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_textcontainer, container, false);
        ViewGroup ll = (ViewGroup) view.findViewById(R.id.container);
        ViewGroup.LayoutParams lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        TextView t;

        t = new TextView_p(getActivity());
        t.setPadding(0, 0, 0, 12);
        t.setText(HtmlCompat.fromHtml("This is the Android app for the website <a href=\"https://rsw.me.uk/blueline/\">rsw.me.uk/blueline</a>. You're running version "+BuildConfig.VERSION_NAME+".", HtmlCompat.FROM_HTML_MODE_LEGACY));
        ll.addView(t, lp);
        ll.addView(new TextView_p(getActivity(), "The app works offline and integrates into the Android OS in various ways not possible with the web-based app, although there is much re-use of code between the two."), lp);
        ll.addView(new TextView_p(getActivity(), HtmlCompat.fromHtml("The source code is <a href=\"https://github.com/bobwallis/BluelineAndroid\">made available</a> for interested people. Feedback is welcome.", HtmlCompat.FROM_HTML_MODE_LEGACY)), lp);
        ll.addView(new TextView_h3(getActivity(), "Database"), lp);
        ll.addView(new TextView_p(getActivity(), "Method data is taken from the Central Council method collections. The database is only updated when the app is, and so methods recently added to the Central Council lists may be missing."), lp);
        ll.addView(new TextView_p(getActivity(), "Calls are not part of the Central Council data, and are either manually set by me based on common practice, or guessed. In general:"), lp);
        ll.addView(new TextView_li(getActivity(), "Even-bell methods with 1 hunt bell and a 12 lead end are given 14 Bobs and 1234 Singles."), lp);
        ll.addView(new TextView_li(getActivity(), "Even-bell methods with 1 hunt bell and a 1n lead end are given 1(n-2) Bobs and 1(n-2)(n-1)n Singles unless they are on Major or above and have a lead head code of M, in which case they are treated the same as those with a 12 lead end."), lp);
        ll.addView(new TextView_li(getActivity(), "Methods with 2 hunt bells are given Grandsire Bobs and Singles if they have a 1 lead end followed by a 3 or n for the first change of the lead."), lp);
        ll.addView(new TextView_li(getActivity(), "Calls are not guessed for Differentials, Minimus methods and principles."), lp);
        ll.addView(new TextView_p(getActivity(), "Always check with the conductor if unsure."), lp);

        return view;
    }

}
