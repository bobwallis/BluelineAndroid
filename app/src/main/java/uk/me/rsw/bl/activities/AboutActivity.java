package uk.me.rsw.bl.activities;

import android.os.Bundle;
import android.support.v4.app.NavUtils;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBarActivity;
import android.view.MenuItem;
import android.widget.ScrollView;

import com.astuetz.PagerSlidingTabStrip;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.adapters.AboutPagerAdapter;
import uk.me.rsw.bl.widgets.Toolbar;

public class AboutActivity extends ActionBarActivity implements uk.me.rsw.bl.widgets.ScrollView2.OnScrollChangedListener {

    Toolbar mToolbar;
    AboutPagerAdapter mSectionsPagerAdapter;
    ViewPager mViewPager;
    PagerSlidingTabStrip mTabs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        // Set up toolbar
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        // Set up tabs
        mSectionsPagerAdapter = new AboutPagerAdapter(getSupportFragmentManager());
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);
        // Set up tab bar
        mTabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        mTabs.setViewPager(mViewPager);
        mTabs.setOnPageChangeListener(
            new ViewPager.OnPageChangeListener() {
                @Override
                public void onPageSelected(int position) {
                }
                @Override
                public void onPageScrollStateChanged(int position) {
                }
                @Override
                public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                    mToolbar.setAmountVisible(Math.max(mToolbar.getAmountVisible(), Math.abs(positionOffset) * mToolbar.getHeight()));
                }
            }
        );
    }

    @Override
    public void onScrollChanged(ScrollView who, int l, int t, int oldl, int oldt) {
        mToolbar.setAmountVisible(mToolbar.getAmountVisible() - t + oldt);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                NavUtils.navigateUpFromSameTask(this);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
