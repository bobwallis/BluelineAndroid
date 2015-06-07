package uk.me.rsw.bl.activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ScrollView;
import android.widget.TextView;

import com.astuetz.PagerSlidingTabStrip;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.adapters.MethodPagerAdapter;
import uk.me.rsw.bl.data.Database;
import uk.me.rsw.bl.models.Method;
import uk.me.rsw.bl.widgets.Toolbar;


public class MethodActivity extends ActionBarActivity implements uk.me.rsw.bl.widgets.ScrollView2.OnScrollChangedListener {

    private Toolbar mToolbar;
    private MethodPagerAdapter mSectionsPagerAdapter;
    private ViewPager mViewPager;
    private PagerSlidingTabStrip mTabs;

    private String title;
    private Method method;
    private Boolean[] tabs;
    private String[] layouts;
    private String[] sizes;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_method);

        // Get the title from the intent
        Intent intent = getIntent();
        title = intent.getStringExtra(MainActivity.METHOD_TITLE);
        setTitle(title);

        // Get the method data
        Database db = new Database(this);
        method = db.get(title);

        // Set up toolbar
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle(title);
        ((TextView) findViewById(R.id.title)).setText(title);

        // Decide which tabs to display based on preferences
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        tabs = new Boolean[]{
            true,
            prefs.getBoolean("numbers_show", true),
            prefs.getBoolean("lines_show", false),
            prefs.getBoolean("grid_show", true)
        };
        layouts = new String[] {
            prefs.getString("numbers_layout", "oneColumn"),
            prefs.getString("lines_layout", "oneColumn"),
            prefs.getString("grid_layout", "oneColumn")
        };
        sizes = new String[] {
                prefs.getString("numbers_size", "medium"),
                prefs.getString("lines_size", "medium"),
                prefs.getString("grid_size", "medium")
        };

        // Set up the tabs
        mSectionsPagerAdapter = new MethodPagerAdapter(getSupportFragmentManager(), method, tabs);
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);
        mViewPager.setCurrentItem(Math.min(1, mSectionsPagerAdapter.getCount() - 1));

        // Set up tab bar
        mTabs = (PagerSlidingTabStrip) findViewById(R.id.tabs);
        mTabs.setViewPager(mViewPager);
        mTabs.setOnPageChangeListener(
            new ViewPager.OnPageChangeListener() {
                int lastPosition = Math.min(1, mSectionsPagerAdapter.getCount()-1);
                @Override
                public void onPageSelected(int position) {
                }
                @Override
                public void onPageScrollStateChanged(int position) {
                }
                @Override
                public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                    float offset = (position == lastPosition)? positionOffset : 1-positionOffset;
                    if(offset <= 0.0 || offset >= 1.0) {
                        lastPosition = position;
                    }
                    mToolbar.setAmountVisible(Math.max(mToolbar.getAmountVisible(), offset * mToolbar.getHeight()));
                }
            }
        );
    }

    @Override
    public void onResume() {
        super.onResume();

        // Check for changes to the preferences deciding which tabs to show and restart the activity if needed
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        if( prefs.getBoolean("numbers_show", true) != tabs[1] ||
            prefs.getBoolean("lines_show", false) != tabs[2] ||
            prefs.getBoolean("grid_show", false) != tabs[3] ||
            prefs.getString("numbers_layout", "oneColumn") != layouts[0] ||
            prefs.getString("lines_layout", "oneColumn") != layouts[1] ||
            prefs.getString("grid_layout", "oneColumn") != layouts[2] ||
            prefs.getString("numbers_size", "medium") != sizes[0] ||
            prefs.getString("lines_size", "medium") != sizes[1] ||
            prefs.getString("grid_size", "medium") != sizes[2]
        ) {
            Intent intent = getIntent();
            finish();
            startActivity(intent);
        };
    }

    @Override
    public void onScrollChanged(ScrollView who, int l, int t, int oldl, int oldt) {
        if(t <= 1) { // For some reason there's a little bit of a bounce at the top if you don't do this
            mToolbar.setAmountVisible(mToolbar.getHeight());
        }
        else {
            mToolbar.setAmountVisible(mToolbar.getAmountVisible() - t + oldt);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_method, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        Intent intent;

        switch (item.getItemId()) {
            case android.R.id.home:
                onBackPressed();
                return true;

            case R.id.action_settings:
                intent = new Intent(this, SettingsActivity.class);
                startActivity(intent);
                return true;

            case R.id.action_about:
                intent = new Intent(this, AboutActivity.class);
                startActivity(intent);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

}
