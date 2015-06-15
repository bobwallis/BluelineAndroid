package uk.me.rsw.bl.adapters;


import android.app.Fragment;
import android.app.FragmentManager;
import android.support.v13.app.FragmentPagerAdapter;

import uk.me.rsw.bl.fragments.SettingsFragment;


public class SettingsPagerAdapter extends FragmentPagerAdapter {

    public SettingsPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public int getCount() {
        return 1;
    }

    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                return new SettingsFragment();
        }
        return null;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        switch (position) {
            case 0:
                return "Settings";
        }
        return null;
    }
}
