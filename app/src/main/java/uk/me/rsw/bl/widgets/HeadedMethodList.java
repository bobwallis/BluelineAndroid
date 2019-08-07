package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.util.AttributeSet;
import android.view.View;
import android.widget.AdapterView;
import android.widget.FrameLayout;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MainActivity;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.adapters.StarsAdapter;
import uk.me.rsw.bl.data.UserDataDatabase;
import uk.me.rsw.bl.models.Star;

public class HeadedMethodList extends FrameLayout implements AdapterView.OnItemClickListener {

    private Context mContext;
    private ListView stars_list;

    public HeadedMethodList(Context context) {
        this(context, null);
    }

    public HeadedMethodList(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public HeadedMethodList(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        inflate(context, R.layout.widget_headedlistincard, this);
        mContext = context;
        ((TextView) findViewById(R.id.header)).setText(getResources().getString(R.string.title_starred));
        stars_list = (ListView) findViewById(R.id.list);
        stars_list.setOnItemClickListener(this);
    }

    @Override
    public void onItemClick(AdapterView<?> adapter, View v, int position, long id) {
        Cursor c = ((StarsAdapter) adapter.getAdapter()).getCursor();
        c.moveToPosition(position);
        Intent intent = new Intent(mContext, MethodActivity.class);
        intent.putExtra(MainActivity.METHOD_TITLE, c.getString(c.getColumnIndexOrThrow("title")));
        intent.putExtra(MainActivity.METHOD_CUSTOM, c.getInt(c.getColumnIndexOrThrow("custom")) == 1);
        intent.putExtra(MainActivity.METHOD_STAGE, c.getInt(c.getColumnIndexOrThrow("stage")));
        intent.putExtra(MainActivity.METHOD_NOTATION, c.getString(c.getColumnIndexOrThrow("notationExpanded")));
        mContext.startActivity(intent);
    }

}
