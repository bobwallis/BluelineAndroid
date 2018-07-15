package uk.me.rsw.bl.activities;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.speech.RecognizerIntent;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;

import com.nineoldandroids.animation.ValueAnimator;

import java.util.ArrayList;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.adapters.SearchResultsAdapter;
import uk.me.rsw.bl.data.MethodsDatabase;
import uk.me.rsw.bl.widgets.SearchBox;
import uk.me.rsw.bl.widgets.StarList;


public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    public final static String METHOD_TITLE = "uk.me.rsw.bl.METHOD_TITLE";
    public final static String METHOD_STAGE = "uk.me.rsw.bl.METHOD_STAGE";
    public final static String METHOD_NOTATION = "uk.me.rsw.bl.METHOD_NOTATION";
    public final static String METHOD_CUSTOM = "uk.me.rsw.bl.METHOD_CUSTOM";
    public final static String IS_SEARCHING = "uk.me.rsw.bl.IS_SEARCHING";
    public final static String SEARCH_QUERY = "uk.me.rsw.bl.SEARCH_QUERY";

    private DrawerLayout mDrawerLayout;
    private NavigationView mNavigationView;
    private View toolbarBackground;
    private SearchBox searchBox;
    private RecyclerView searchResults;
    private SearchResultsAdapter searchResults_adapter;
    private RecyclerView.LayoutManager searchResults_layoutManager;
    private StarList stars;
    private MethodsDatabase db;

    private Boolean isSearching = false;
    private String searchQuery = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Restore status variables from any saved state
        if (savedInstanceState != null) {
            isSearching = savedInstanceState.getBoolean(IS_SEARCHING);
            searchQuery = savedInstanceState.getString(SEARCH_QUERY);
        }

        // Check if the intent is to skip straight to searching
        if (getIntent().getAction().equals("android.intent.action.SEARCH")) {
            isSearching = true;
        }

        // Get instance of database
        db = new MethodsDatabase(this);

        // Set up the drawer
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        mNavigationView = (NavigationView) findViewById(R.id.navigation_view);
        mNavigationView.setNavigationItemSelectedListener(this);

        // Set up the toolbar background
        toolbarBackground = findViewById(R.id.toolbar_background);
        if (isSearching) {
            ViewGroup.LayoutParams layoutParams = toolbarBackground.getLayoutParams();
            layoutParams.height = 0;
            toolbarBackground.setLayoutParams(layoutParams);
        }

        // Set up the search results
        searchResults = (RecyclerView) findViewById(R.id.search_results);
        searchResults_layoutManager = new LinearLayoutManager(this);
        searchResults.setLayoutManager(searchResults_layoutManager);
        searchResults_adapter = new SearchResultsAdapter(this, null);
        searchResults.setAdapter(searchResults_adapter);
        if (isSearching) {
            searchResults.setVisibility(View.VISIBLE);
            if (!TextUtils.isEmpty(searchQuery)) {
                searchResults_adapter.changeCursor(db.search(searchQuery));
            }
        }

        // Setup stars list
        stars = (StarList) findViewById(R.id.stars);
        if (stars.getCount() == 0 || isSearching) {
            stars.setVisibility(View.GONE);
        }
        // Set up the search box
        searchBox = (SearchBox) findViewById(R.id.searchbox);
        searchBox.setMenuListener(new SearchBox.MenuListener() {
            @Override
            public void onMenuClick() {
                mDrawerLayout.openDrawer(GravityCompat.START);
            }
        });
        searchBox.setSearchListener(new SearchBox.SearchListener() {
            @Override
            public void onSearchOpened() {
                ValueAnimator anim_toolbarBackground = ValueAnimator.ofInt(toolbarBackground.getMeasuredHeight(), 0);
                anim_toolbarBackground.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                    @Override
                    public void onAnimationUpdate(ValueAnimator valueAnimator) {
                        int val = (Integer) valueAnimator.getAnimatedValue();
                        ViewGroup.LayoutParams layoutParams = toolbarBackground.getLayoutParams();
                        layoutParams.height = val;
                        toolbarBackground.setLayoutParams(layoutParams);
                    }
                });
                ValueAnimator anim_searchBox = ValueAnimator.ofInt(((ViewGroup.MarginLayoutParams) searchBox.getLayoutParams()).topMargin, 0);
                anim_searchBox.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                    @Override
                    public void onAnimationUpdate(ValueAnimator valueAnimator) {
                        int val = (Integer) valueAnimator.getAnimatedValue();
                        ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) searchBox.getLayoutParams();
                        layoutParams.topMargin = val;
                        searchBox.setLayoutParams(layoutParams);
                    }
                });
                anim_toolbarBackground.setDuration(180);
                anim_searchBox.setDuration(180);
                anim_toolbarBackground.start();
                anim_searchBox.start();
                stars.setVisibility(View.GONE);
            }

            @Override
            public void onSearchClosed() {
                if(!isSearching) {
                    ValueAnimator anim_toolbarBackground = ValueAnimator.ofInt(0, getResources().getDimensionPixelSize(R.dimen.toolbar_height_tall));
                    anim_toolbarBackground.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                        @Override
                        public void onAnimationUpdate(ValueAnimator valueAnimator) {
                            int val = (Integer) valueAnimator.getAnimatedValue();
                            ViewGroup.LayoutParams layoutParams = toolbarBackground.getLayoutParams();
                            layoutParams.height = val;
                            toolbarBackground.setLayoutParams(layoutParams);
                        }
                    });
                    ValueAnimator anim_searchBox = ValueAnimator.ofInt(0, getResources().getDimensionPixelSize(R.dimen.searchbox_top_margin));
                    anim_searchBox.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                        @Override
                        public void onAnimationUpdate(ValueAnimator valueAnimator) {
                            int val = (Integer) valueAnimator.getAnimatedValue();
                            ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) searchBox.getLayoutParams();
                            layoutParams.topMargin = val;
                            searchBox.setLayoutParams(layoutParams);
                        }
                    });
                    anim_toolbarBackground.setDuration(180);
                    anim_searchBox.setDuration(180);
                    anim_toolbarBackground.start();
                    anim_searchBox.start();
                    if(stars.getCount() > 0) {
                        final Handler handler = new Handler();
                        handler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                stars.setVisibility(View.VISIBLE);
                            }
                        }, 200);
                    }
                }
            }

            @Override
            public void onSearchTermChanged() {
                searchQuery = searchBox.getSearchText();
                if (TextUtils.isEmpty(searchQuery)) {
                    isSearching = false;
                    searchResults.setVisibility(View.GONE);
                } else {
                    isSearching = true;
                    searchResults.setVisibility(View.VISIBLE);
                    searchResults_layoutManager.scrollToPosition(0);
                    searchResults_adapter.changeCursor(db.search(searchBox.getSearchText()));
                }
            }

            @Override
            public void onSearch(String searchTerm) {
                InputMethodManager inputMethodManager = (InputMethodManager) searchBox.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
                inputMethodManager.hideSoftInputFromWindow(mDrawerLayout.getApplicationWindowToken(), 0);
            }

            @Override
            public void onSearchCleared() {
                isSearching = false;
            }

        });
        if (isSearching) {
            ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams) searchBox.getLayoutParams();
            layoutParams.topMargin = 0;
            searchBox.setLayoutParams(layoutParams);
            searchBox.search(searchQuery);
            if (getIntent().getAction().equals("android.intent.action.SEARCH")) {
                searchBox.openSearch();
            }
        }
    }

    @Override
    public void onSaveInstanceState(Bundle savedInstanceState) {
        savedInstanceState.putBoolean(IS_SEARCHING, isSearching);
        savedInstanceState.putString(SEARCH_QUERY, searchQuery);
        super.onSaveInstanceState(savedInstanceState);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && isSearching) {
            searchBox.setSearchText("");
            searchBox.closeSearch();
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_MENU) {
            mDrawerLayout.openDrawer(GravityCompat.START);
            return true;
        }
        if (keyCode == KeyEvent.KEYCODE_SEARCH) {
            searchBox.openSearch();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 1234 && resultCode == RESULT_OK) {
            ArrayList<String> matches = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
            searchBox.populateEditText(matches);
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    public void mic(View v) {
        searchBox.micClick(this);
    }

    @Override
    public boolean onNavigationItemSelected(MenuItem menuItem) {
        Intent intent;

        switch (menuItem.getItemId()) {
            case R.id.navigation_search:
                mDrawerLayout.closeDrawer(GravityCompat.START);
                searchBox.openSearch();
                return true;
            case R.id.navigation_discover:
                intent = new Intent(this, DiscoverActivity.class);
                startActivity(intent);
                return true;
            case R.id.navigation_custom:
                intent = new Intent(this, CustomActivity.class);
                startActivity(intent);
                return true;
            case R.id.navigation_prove:
                intent = new Intent(this, ProveActivity.class);
                startActivity(intent);
                return true;
            case R.id.navigation_settings:
                intent = new Intent(this, SettingsActivity.class);
                startActivity(intent);
                return true;
            case R.id.navigation_about:
                intent = new Intent(this, AboutActivity.class);
                startActivity(intent);
                return true;
            default:
                return true;
        }
    }

    @Override
    public void onResume() {
        // Update list of stars
        stars.reloadList();
        if(stars.getCount() == 0) {
            stars.setVisibility(View.GONE);
        }
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        db.close();
        stars.destroy();
    }
}
