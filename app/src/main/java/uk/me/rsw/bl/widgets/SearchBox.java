package uk.me.rsw.bl.widgets;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Handler;
import android.speech.RecognizerIntent;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;

import androidx.appcompat.app.AlertDialog;

import com.balysv.materialmenu.MaterialMenuDrawable.IconState;
import com.balysv.materialmenu.MaterialMenuView;

import java.util.ArrayList;

import uk.me.rsw.bl.R;

public class SearchBox extends RelativeLayout {

    private MaterialMenuView materialMenu;
    private TextView logo;
    private EditText search;
    private Context context;
    private boolean searchOpen;
    private boolean isMic;
    private ImageView mic;
    private SearchListener listener;
    private MenuListener menuListener;
    private String logoText;

    public SearchBox(Context context) {
        this(context, null);
    }

    public SearchBox(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public SearchBox(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        inflate(context, R.layout.widget_searchbox, this);
        this.searchOpen = false;
        this.isMic = true;
        this.materialMenu = (MaterialMenuView) findViewById(R.id.material_menu_button);
        this.logo = (TextView) findViewById(R.id.logo);
        this.search = (EditText) findViewById(R.id.search);
        this.context = context;
        this.mic = (ImageView) findViewById(R.id.mic);
        materialMenu.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                if (searchOpen) {
                    setLogoText(logoText);
                    setSearchText("");
                    closeSearch();
                } else {
                    if (menuListener != null)
                        menuListener.onMenuClick();
                }
            }

        });
        logo.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                openSearch();
            }

        });
        search.setOnEditorActionListener(new OnEditorActionListener() {
            public boolean onEditorAction(TextView v, int actionId,
                    KeyEvent event) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                    search(getSearchText());
                    return true;
                }
                return false;
            }
        });
        search.setOnKeyListener(new OnKeyListener() {
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_ENTER) {
                    search(getSearchText());
                    return true;
                }
                return false;
            }
        });
        logoText = context.getString(R.string.search_hint);
    }

    public void setMenuListener(MenuListener menuListener) {
        this.menuListener = menuListener;
    }
    public void setSearchListener(SearchListener listener) {
        this.listener = listener;
    }

    public void setLogoText(String text) {
        logo.setText(text);
    }

    public String getSearchText() {
        return search.getText().toString();
    }
    public void setSearchText(String text) {
        search.setText(text);
    }

    public void search(String text) {
        setSearchText(text);
        if (!TextUtils.isEmpty(getSearchText())) {
            if (listener != null)
                listener.onSearch(text);
        }
        closeSearch();
    }

    // Functions to open and close the search interface
    public void openSearch() {
        this.materialMenu.animateState(IconState.ARROW);
        this.logo.setVisibility(View.GONE);
        this.search.setVisibility(View.VISIBLE);
        search.requestFocus();
        search.addTextChangedListener(new TextWatcher() {

            @Override
            public void afterTextChanged(Editable s) {
                if (s.length() > 0) {
                    isMic = false;
                    mic.setImageResource(R.drawable.ic_clear);
                } else {
                    isMic = true;
                    mic.setImageResource(R.drawable.ic_mic);
                }

                if (listener != null)
                    listener.onSearchTermChanged();
            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

        });

        if (getSearchText().length() > 0) {
            isMic = false;
            mic.setImageResource(R.drawable.ic_clear);
        }

        if (listener != null)
            listener.onSearchOpened();

        Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                InputMethodManager inputMethodManager = (InputMethodManager) context
                        .getSystemService(Context.INPUT_METHOD_SERVICE);
                if (inputMethodManager != null) {
                    inputMethodManager.toggleSoftInputFromWindow(
                            getApplicationWindowToken(),
                            InputMethodManager.SHOW_FORCED, 0);
                }
            }
        };
        handler.postDelayed(runnable, 150);

        searchOpen = true;
    }

    public void closeSearch() {
        setLogoText(TextUtils.isEmpty(getSearchText())? logoText : getSearchText());
        this.materialMenu.animateState(IconState.BURGER);
        this.logo.setVisibility(View.VISIBLE);
        this.search.setVisibility(View.GONE);

        isMic = true;
        mic.setImageResource(R.drawable.ic_mic);

        if (listener != null)
            listener.onSearchClosed();

        Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                InputMethodManager inputMethodManager = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
                if (inputMethodManager != null) {
                    inputMethodManager.hideSoftInputFromWindow(getApplicationWindowToken(), 0);
                }
            }
        };
        handler.postDelayed(runnable, 150);

        searchOpen = false;
    }


    // Voice input related functions
    public void startVoiceRecognitionActivity(Activity activity) {
        if (activity != null) {
            try {
                Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                intent.putExtra(RecognizerIntent.EXTRA_PROMPT, context.getString(R.string.speak_now));
                activity.startActivityForResult(intent, 1234);
            }
            catch(ActivityNotFoundException e) {
                AlertDialog.Builder alertDialogB = new AlertDialog.Builder(activity);
                alertDialogB.setTitle("Voice search unavailable")
                        .setMessage("No app capable of recognising speech is installed on this device.")
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                            }
                        });
                alertDialogB.create().show();
            }
        }
    }

    public void micClick(Activity activity) {
        if (!isMic) {
            setSearchText("");
            if (listener != null)
                listener.onSearchCleared();
        } else {
            startVoiceRecognitionActivity(activity);
        }

    }

    public void populateEditText(ArrayList<String> matches) {
        openSearch();
        search(matches.get(0).trim());
    }


    // Define interfaces
    public interface SearchListener {
        void onSearchOpened();
        void onSearchCleared();
        void onSearchClosed();
        void onSearchTermChanged();
        void onSearch(String result);
    }

    public interface MenuListener {
        void onMenuClick();
    }

}
