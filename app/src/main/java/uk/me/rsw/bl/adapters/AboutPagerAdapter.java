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
        return switch (position) {
            case 0 -> new AboutFragment();
            case 1 -> new HelpFragment();
            case 2 -> new PrivacyFragment();
            case 3 -> new CopyrightFragment();
            default -> null;
        };
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return switch (position) {
            case 0 -> "About";
            case 1 -> "Help";
            case 2 -> "Privacy";
            case 3 -> "Copyright";
            default -> null;
        };
    }
}
