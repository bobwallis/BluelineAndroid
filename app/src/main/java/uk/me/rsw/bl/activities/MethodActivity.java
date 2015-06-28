package uk.me.rsw.bl.activities;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;

import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.common.api.GoogleApiClient;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.adapters.MethodPagerAdapter;
import uk.me.rsw.bl.data.Database;
import uk.me.rsw.bl.models.Method;


public class MethodActivity extends AppCompatActivity {

    private Toolbar mToolbar;
    private MethodPagerAdapter mSectionsPagerAdapter;
    private ViewPager mViewPager;
    private TabLayout mTabLayout;

    private String title;
    private Method method;
    private Boolean[] tabs;
    private String[] layouts;
    private String[] sizes;
    private String workingBell;

    private Uri APP_URI = Uri.parse("android-app://uk.me.rsw.bl/blueline/methods/");
    private Uri WEB_URL = Uri.parse("https://rsw.me.uk/blueline/methods/view/");
    private GoogleApiClient mClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_methods);

        // Get the title from the intent
        Intent intent = getIntent();


        // If we've been given a definite title from another activity
        if( intent.getStringExtra(MainActivity.METHOD_TITLE) != null ) {
            title = intent.getStringExtra(MainActivity.METHOD_TITLE);
            setTitle(title);
            if (title.equals("Custom Method")) {
                method = new Method();
                method.setStage(intent.getIntExtra(CustomActivity.METHOD_STAGE, 0));
                method.setNotation(intent.getStringExtra(CustomActivity.METHOD_NOTATION));
                method.setNotationExpanded(intent.getStringExtra(CustomActivity.METHOD_NOTATION));
            } else {
                Database db = new Database(this);
                method = db.getFromTitle(title);
                db.close();
                if( method == null ) {
                    setResult(Activity.RESULT_CANCELED);
                    finish();
                }
            }
        }
        // Otherwise we've been started from the URL intent
        else if( intent.getData() != null ) {
            Database db = new Database(this);
            method = db.getFromURL(intent.getData().getLastPathSegment());
            db.close();
            if( method == null ) {
                setResult(Activity.RESULT_CANCELED);
                finish();
            }
            else {
                title = method.getTitle();
            }
        }
        // Otherwise fail
        else {
            setResult(Activity.RESULT_CANCELED);
            finish();
        }

        // Start app indexing client if needed
        if( !title.equals("Custom Method")) {
            APP_URI = Uri.parse("android-app://uk.me.rsw.bl/blueline/methods/"+method.getURL());
            WEB_URL = Uri.parse("https://rsw.me.uk/blueline/methods/view/"+method.getURL());
            mClient = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();
        }

        // Set up toolbar
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(mToolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setTitle(title);

        // Decide which tabs to display based on preferences
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        tabs = new Boolean[]{
            true,
            prefs.getBoolean("numbers_show", true),
            prefs.getBoolean("lines_show", false),
            prefs.getBoolean("grid_show", true),
            prefs.getBoolean("practice_show", true)
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
        workingBell = prefs.getString("workingBell", "heaviest");

        // Set up the view pager
        mSectionsPagerAdapter = new MethodPagerAdapter(getSupportFragmentManager(), method, tabs);
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        // Set up tab bar
        mTabLayout = (TabLayout) findViewById(R.id.tabs);
        mTabLayout.setTabMode(TabLayout.MODE_SCROLLABLE);
        mTabLayout.setupWithViewPager(mViewPager);

        // Select the relevant tab
        mViewPager.setCurrentItem(Math.min(1, mSectionsPagerAdapter.getCount() - 1));
    }

    @Override
    public void onStart() {
        super.onStart();
        if( !title.equals("Custom Method")) {
            mClient.connect();
            Action viewAction = Action.newAction(Action.TYPE_VIEW, title, WEB_URL, APP_URI);
            AppIndex.AppIndexApi.start(mClient, viewAction);
        }
    }

    @Override
    public void onResume() {
        super.onResume();

        // Check for changes to the preferences deciding which tabs to show and restart the activity if needed
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(this);
        if( prefs.getBoolean("numbers_show", true) != tabs[1] ||
            prefs.getBoolean("lines_show", false) != tabs[2] ||
            prefs.getBoolean("grid_show", true) != tabs[3] ||
            prefs.getBoolean("practice_show", true) != tabs[4] ||
            prefs.getString("numbers_layout", "oneColumn") != layouts[0] ||
            prefs.getString("lines_layout", "oneColumn") != layouts[1] ||
            prefs.getString("grid_layout", "oneColumn") != layouts[2] ||
            prefs.getString("numbers_size", "medium") != sizes[0] ||
            prefs.getString("lines_size", "medium") != sizes[1] ||
            prefs.getString("grid_size", "medium") != sizes[2] ||
            prefs.getString("workingBell", "heaviest") != workingBell
        ) {
            Intent intent = getIntent();
            finish();
            startActivity(intent);
        };
    }

    @Override
    public void onStop() {
        if( !title.equals("Custom Method")) {
            Action viewAction = Action.newAction(Action.TYPE_VIEW, title, WEB_URL, APP_URI);
            AppIndex.AppIndexApi.end(mClient, viewAction);
            mClient.disconnect();
        }
        super.onStop();
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
