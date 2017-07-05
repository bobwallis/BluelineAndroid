package uk.me.rsw.bl.adapters;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import uk.me.rsw.bl.fragments.AboutFragment;
import uk.me.rsw.bl.fragments.CopyrightFragment;
import uk.me.rsw.bl.fragments.HelpFragment;


public class AboutPagerAdapter extends FragmentPagerAdapter {

    public AboutPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public int getCount() {
        return 3;
    }

    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                return new AboutFragment();
            case 1:
                return new HelpFragment();
            case 2:
                return new CopyrightFragment();
        }
        return null;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        switch (position) {
            case 0:
                return "About";
            case 1:
                return "Help";
            case 2:
                return "Copyright";
        }
        return null;
    }
}
