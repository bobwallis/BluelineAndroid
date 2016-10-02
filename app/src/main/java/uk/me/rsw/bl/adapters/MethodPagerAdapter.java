package uk.me.rsw.bl.adapters;

import android.os.Build;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import uk.me.rsw.bl.fragments.MethodDetailsFragment;
import uk.me.rsw.bl.fragments.MethodGridFragment;
import uk.me.rsw.bl.fragments.MethodLineFragment;
import uk.me.rsw.bl.fragments.MethodPracticeFragment;
import uk.me.rsw.bl.models.Method;


public class MethodPagerAdapter extends FragmentPagerAdapter {

    private Method method;

    private Integer TAB_DETAILS = 0;
    private Integer TAB_LINE = 1;
    private Integer TAB_GRID = 2;
    private Integer TAB_PRACTICE = 3;
    private Integer count = 4;

    public MethodPagerAdapter(FragmentManager fm, Method arg1) {
        super(fm);
        method = arg1;
        // Hide the practice interface if the Android version is too low
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
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
        if (position == TAB_LINE) {
            return MethodLineFragment.newInstance(method);
        }
        if (position == TAB_GRID) {
            return MethodGridFragment.newInstance(method);
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
        if (position == TAB_LINE) {
            return "Line";
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
