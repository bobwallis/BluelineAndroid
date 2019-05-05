package uk.me.rsw.bl.adapters;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import uk.me.rsw.bl.fragments.AboutFragment;
import uk.me.rsw.bl.fragments.CopyrightFragment;
import uk.me.rsw.bl.fragments.HelpFragment;
import uk.me.rsw.bl.fragments.PrivacyFragment;


public class AboutPagerAdapter extends FragmentPagerAdapter {

    public AboutPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public int getCount() {
        return 4;
    }

    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                return new AboutFragment();
            case 1:
                return new HelpFragment();
            case 2:
                return new PrivacyFragment();
            case 3:
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
                return "Privacy";
            case 3:
                return "Copyright";
        }
        return null;
    }
}
