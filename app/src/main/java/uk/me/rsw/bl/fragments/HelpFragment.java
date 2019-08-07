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
import uk.me.rsw.bl.widgets.TextView_dd;
import uk.me.rsw.bl.widgets.TextView_dt;
import uk.me.rsw.bl.widgets.TextView_h3;
import uk.me.rsw.bl.widgets.TextView_li;
import uk.me.rsw.bl.widgets.TextView_p;

public class HelpFragment extends Fragment {

    public HelpFragment() {
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_textcontainer, container, false);
        ViewGroup ll = (ViewGroup) view.findViewById(R.id.container);
        ViewGroup.LayoutParams lp = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        TextView t;

        t = new TextView_h3(getActivity());
        t.setPadding(0, 0, 0, 8);
        t.setText("Basic Usage");
        ll.addView(t, lp);
        ll.addView(new TextView_p(getActivity(), "Find a method by typing its name into the search box, then tap the name to load full details, a copy of the method diagram, and a practice interface allowing you to tap through the blue line on screen."), lp);
        ll.addView(new TextView_p(getActivity(), "If you're not sure what to search for, try the \"Discover Methods\" section in the navigation drawer for inspiration."), lp);
        ll.addView(new TextView_h3(getActivity(), "Settings"), lp);
        ll.addView(new TextView_p(getActivity(), "Access the Settings interface via the navigation drawer on the main page, or from the overflow menu in the method view. Sensible defaults are chosen for you based on your device size, but you are free to tweak to your preference."), lp);
        ll.addView(new TextView_h3(getActivity(), "Searching"), lp);
        ll.addView(new TextView_p(getActivity(), "Search by method name by typing in the box on the main screen, or tap the microphone icon to do a voice search. Searches are not case sensitive, and you can abbreviate the stage (Major, Minor, Maximus, etc) to just a number to reduce typing. Methods are sorted with more popular/common methods towards the top of the results, so it is generally possible to find the method you are looking for in a few taps."), lp);
        ll.addView(new TextView_h3(getActivity(), "Custom Method"), lp);
        ll.addView(new TextView_p(getActivity(), "If you would like to view a method which is not in the library you can enter the method's place notation on this screen by accessing it via the navigation drawer on the main page. Select the stage using the drop down and then type the place notation into the box. For those unfamiliar with place notation a brief guide is below:"), lp);
        ll.addView(new TextView_h3(getActivity(), "Place Notation"), lp);
        ll.addView(new TextView_p(getActivity(), "Place notation is used to define methods in a compact way. For example: the place notation for Single Court Minimus is \"34.14x14x14.34.14\"."), lp);
        ll.addView(new TextView_p(getActivity(), "This consists of 8 changes, each specified by numbers or an 'x'. When two adjacent changes are both defined by numbers they are separated by a dot."), lp);
        ll.addView(new TextView_p(getActivity(), "The numbers show which positions remain static in the change. Any positions which don't remain static swap with the position next to them. An 'x' means there are no static positions, so all pairs swap ('-' is often used instead of 'x')."), lp);
        ll.addView(new TextView_p(getActivity(), "So on Minimus: 'x' takes 1234 to 2143; '34' takes 1234 to 2134; '14' takes 1234 to 1324."), lp);
        ll.addView(new TextView_p(getActivity(), HtmlCompat.fromHtml("For a more detailed introduction to the basics see <a href=\"http://www.cccbr.org.uk/education/thelearningcurve/pdfs/200404.pdf\" class=\"external\">this guide</a> published by the Central Council as part of The Learning Curve series.", HtmlCompat.FROM_HTML_MODE_LEGACY)), lp);
        ll.addView(new TextView_p(getActivity(), "The place notation can be abbreviated in various common ways including the microSIRIL format widely used by proving programs. All of the following are ways of expressing Plain Bob Minor:"), lp);
        ll.addView(new TextView_li(getActivity(), "x16x16x16x16x16x12"), lp);
        ll.addView(new TextView_li(getActivity(), "&x16x16x16,+12"), lp);
        ll.addView(new TextView_li(getActivity(), "x1x1x1x1x1x2"), lp);
        ll.addView(new TextView_li(getActivity(), "x1x1x1-2"), lp);
        ll.addView(new TextView_li(getActivity(), "-1-1-1LH2"), lp);
        ll.addView(new TextView_li(getActivity(), "-1-1-1 le2"), lp);
        ll.addView(new TextView_li(getActivity(), "x1x1x hl 6 le 2"), lp);
        ll.addView(new TextView_li(getActivity(), "&-1-1-1 le2"), lp);
        ll.addView(new TextView_li(getActivity(), "-1-1-1,2"), lp);
        ll.addView(new TextView_li(getActivity(), "&x1x1x1+2"), lp);
        ll.addView(new TextView_li(getActivity(), "a &x1x1x1"), lp);
        ll.addView(new TextView_li(getActivity(), "&x1x1x1 2"), lp);
        ll.addView(new TextView_h3(getActivity(), "Viewing Method Details"), lp);
        ll.addView(new TextView_p(getActivity(), "Select a method by searching in the app or on Google. This opens a screen with several tabs to show the method in different ways:"), lp);
        ll.addView(new TextView_dt(getActivity(), "Details"), lp);
        ll.addView(new TextView_dd(getActivity(), "This tab displays all the classification details about the method stored in the Central Council database, and some basic information about the number of changes and  hunt bells the method has."), lp);
        ll.addView(new TextView_dt(getActivity(), "Line"), lp);
        ll.addView(new TextView_dd(getActivity(), "This tab shows a view of the method with a red line through hunt bells, and a blue line through one of the working bells. For Differential methods a different coloured line is drawn through one example of each type of working bell."), lp);
        ll.addView(new TextView_dd(getActivity(), "3 different styles of line are available, and you can select whether to draw through the heaviest or lightest working bell in each group. Access Settings through the overflow menu in the toolbar."), lp);
        ll.addView(new TextView_dt(getActivity(), "Grid"), lp);
        ll.addView(new TextView_dd(getActivity(), "This tab shows the pattern made by drawing a line through all of the bell paths in a lead, and over each of the calls for the method. This is useful for seeing how the work of each of the bells fits together. Hunt bells are drawn in red. This tab support the pinch-to-zoom gesture to resize the grid if required."), lp);
        ll.addView(new TextView_dt(getActivity(), "Practice"), lp);
        ll.addView(new TextView_dd(getActivity(), "This tab allows you to test your knowledge of the method by guiding a bell through the blue line. Tap on the left/bottom/right part of the screen to steer your bell in that direction, and try to get to the end of the method while making the fewest number of mistakes."), lp);
        ll.addView(new TextView_dd(getActivity(), "You can disable the vibration that happens when you make a mistake in the settings."), lp);
        ll.addView(new TextView_h3(getActivity(), "Starred Methods"), lp);
        ll.addView(new TextView_p(getActivity(), "When viewing method details a star button appears in the right of the toolbar. Tap this to add the method to the list of 'starred methods'. This will make the method appear in a list on the app's start screen for quick access."), lp);
        ll.addView(new TextView_h3(getActivity(), "Composition Prover"), lp);
        ll.addView(new TextView_p(getActivity(), HtmlCompat.fromHtml("Access the composition prover from the navigation menu on the main page. The section contains a simple interface to the <a href=\"http://www.ex-parrot.com/~richard/gsiril/\" class=\"external\">GSiril</a> program for proving touches. Use the drop-down to select between the microSIRIL compatibility mode and the normal GSiril mode. Enter the proving code into the textarea and click \"Prove\" to run GSiril with the code as the input file.", HtmlCompat.FROM_HTML_MODE_LEGACY)), lp);

        return view;
    }

}
