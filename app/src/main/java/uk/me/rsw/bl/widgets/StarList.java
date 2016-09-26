package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.support.v7.app.AlertDialog;
import android.util.AttributeSet;
import android.view.View;
import android.widget.AdapterView;
import android.widget.FrameLayout;
import android.widget.ListView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MainActivity;
import uk.me.rsw.bl.activities.MethodActivity;
import uk.me.rsw.bl.adapters.StarsAdapter;
import uk.me.rsw.bl.data.UserDataDatabase;
import uk.me.rsw.bl.models.Star;

public class StarList extends FrameLayout implements AdapterView.OnItemClickListener, AdapterView.OnItemLongClickListener {

    private Context mContext;
    private UserDataDatabase userDataDB;
    private ListView stars_list;

    public StarList(Context context) {
        this(context, null);
    }

    public StarList(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public StarList(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        inflate(context, R.layout.widget_starlist, this);

        mContext = context;
        userDataDB = new UserDataDatabase(mContext);
        stars_list = (ListView) findViewById(R.id.stars_list);
        stars_list.setOnItemLongClickListener(this);
        stars_list.setOnItemClickListener(this);
        reloadList();
    }

    public void reloadList() {
        StarsAdapter stars_adapter = new StarsAdapter(mContext, userDataDB.listStars());
        stars_list.setAdapter(stars_adapter);
        if(getCount() == 0) {
            setVisibility(View.GONE);
        }
    }

    public int getCount() {
        return stars_list.getAdapter().getCount();
    }

    @Override
    public boolean onItemLongClick(AdapterView<?> adapter, View v, int position, long id) {
        Cursor c = ((StarsAdapter) adapter.getAdapter()).getCursor();
        c.moveToPosition(position);
        final Star star = new Star(c.getString(c.getColumnIndexOrThrow("title")), c.getInt(c.getColumnIndexOrThrow("stage")), c.getString(c.getColumnIndexOrThrow("notationExpanded")), c.getInt(c.getColumnIndexOrThrow("custom")));
        AlertDialog.Builder builder = new AlertDialog.Builder(v.getContext());
        builder.setMessage(R.string.dialog_confirm_unstar)
                .setPositiveButton(R.string.yes, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        userDataDB.removeStar(star);
                        reloadList();
                    }
                })
                .setNegativeButton(R.string.no, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                    }
                });
        builder.create().show();
        return true;
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

    public void destroy() {
        userDataDB.close();
    }

}
