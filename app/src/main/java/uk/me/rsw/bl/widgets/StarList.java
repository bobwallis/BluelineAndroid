package uk.me.rsw.bl.widgets;

import android.content.Context;
import android.content.DialogInterface;
import android.database.Cursor;
import android.util.AttributeSet;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.adapters.StarsAdapter;
import uk.me.rsw.bl.data.UserDataDatabase;
import uk.me.rsw.bl.models.Star;

public class StarList extends HeadedMethodList implements AdapterView.OnItemLongClickListener {

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

        mContext = context;
        userDataDB = new UserDataDatabase(mContext);
        ((TextView) findViewById(R.id.header)).setText(getResources().getString(R.string.title_starred));
        stars_list = (ListView) findViewById(R.id.list);
        stars_list.setOnItemLongClickListener(this);
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

    public void destroy() {
        userDataDB.close();
    }

}
