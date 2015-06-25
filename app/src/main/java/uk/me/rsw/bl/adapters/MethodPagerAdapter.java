package uk.me.rsw.bl.adapters;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import uk.me.rsw.bl.fragments.MethodDetailsFragment;
import uk.me.rsw.bl.fragments.MethodGridFragment;
import uk.me.rsw.bl.fragments.MethodPracticeFragment;
import uk.me.rsw.bl.models.Method;


public class MethodPagerAdapter extends FragmentPagerAdapter {

    private Method method;

    private Integer TAB_DETAILS = 0;
    private Integer TAB_NUMBERS = 1;
    private Integer TAB_LINES = 2;
    private Integer TAB_GRID = 3;
    private Integer TAB_PRACTICE = 4;
    private Integer count = 5;

    public MethodPagerAdapter(FragmentManager fm, Method arg1, Boolean[] arg2) {
        super(fm);
        method = arg1;
        if(arg2[1] == false) {
            TAB_NUMBERS = 999;
            TAB_LINES--;
            TAB_GRID--;
            TAB_PRACTICE--;
            count--;
        }
        if(arg2[2] == false) {
            TAB_LINES = 999;
            TAB_GRID--;
            TAB_PRACTICE--;
            count--;
        }
        if(arg2[3] == false) {
            TAB_GRID = 999;
            TAB_PRACTICE--;
            count--;
        }
        if(arg2[4] == false) {
            TAB_PRACTICE = 999;
            count--;
        }
    }

    @Override
    public int getCount() {
        return count;
    }

    @Override
    public Fragment getItem(int position) {
        if (position == TAB_DETAILS) {
            return MethodDetailsFragment.newInstance(method);
        }
        if (position == TAB_NUMBERS) {
            return MethodGridFragment.newInstance(method, "numbers");
        }
        if (position == TAB_LINES) {
            return MethodGridFragment.newInstance(method, "lines");
        }
        if (position == TAB_GRID) {
            return MethodGridFragment.newInstance(method, "grid");
        }
        if (position == TAB_PRACTICE) {
            return MethodPracticeFragment.newInstance(method);
        }
        return null;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        if (position == TAB_DETAILS) {
            return "Details";
        }
        if (position == TAB_NUMBERS) {
            return "Numbers";
        }
        if (position == TAB_LINES) {
            return "Lines";
        }
        if (position == TAB_GRID) {
            return "Grid";
        }
        if (position == TAB_PRACTICE) {
            return "Practice";
        }
        return null;
    }
}
