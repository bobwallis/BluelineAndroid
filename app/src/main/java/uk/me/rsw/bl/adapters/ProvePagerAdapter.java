package uk.me.rsw.bl.adapters;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import uk.me.rsw.bl.fragments.ProveFragment;


public class ProvePagerAdapter extends FragmentPagerAdapter {

    public ProvePagerAdapter(FragmentManager fm) {
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
                return new ProveFragment();
        }
        return null;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        switch (position) {
            case 0:
                return "Touch prover";
        }
        return null;
    }
}
