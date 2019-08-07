package uk.me.rsw.bl.fragments;


import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.text.HtmlCompat;
import androidx.fragment.app.Fragment;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.widgets.TextView_h3;
import uk.me.rsw.bl.widgets.TextView_p;

public class CopyrightFragment extends Fragment {

    public CopyrightFragment() {
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_textcontainer, container, false);
        ViewGroup ll = (ViewGroup) view.findViewById(R.id.container);
        ViewGroup.LayoutParams lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        TextView t;

        t = new TextView_h3(getActivity());
        t.setPadding(0, 0, 0, 8);
        t.setText("Application");
        ll.addView(t, lp);
        ll.addView(new TextView_p(getActivity(), "This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 2 of the License, or (at your option) any later version."), lp);
        ll.addView(new TextView_p(getActivity(), HtmlCompat.fromHtml("This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the <a href=\"https://github.com/bobwallis/BluelineAndroid/blob/master/LICENSE\">GNU General Public License</a> for more details.", HtmlCompat.FROM_HTML_MODE_LEGACY)), lp);
        ll.addView(new TextView_p(getActivity(), HtmlCompat.fromHtml("The source code is <a href=\"https://github.com/bobwallis/BluelineAndroid\">available online</a>.", HtmlCompat.FROM_HTML_MODE_LEGACY)), lp);

        ll.addView(new TextView_h3(getActivity(), "Method Data"), lp);
        ll.addView(new TextView_p(getActivity(), HtmlCompat.fromHtml("Method details are derived from the Central Council of Church Bellringers data maintained at <a href=\"http://methods.cccbr.org.uk\">methods.cccbr.org.uk</a>.", HtmlCompat.FROM_HTML_MODE_LEGACY)), lp);

        return view;
    }
}
