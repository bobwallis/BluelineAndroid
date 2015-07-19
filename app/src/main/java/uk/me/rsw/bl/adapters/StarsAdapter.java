package uk.me.rsw.bl.adapters;

import android.content.Context;
import android.database.Cursor;
import android.support.v4.widget.CursorAdapter;
import android.widget.SimpleCursorAdapter;

import uk.me.rsw.bl.R;

public class StarsAdapter extends SimpleCursorAdapter {

    private static String[] from = new String[] { "title" };
    private static int[] to = new int[] { R.id.text };

    private Cursor mCursor;

    public StarsAdapter(Context context, Cursor c) {
        super(context, R.layout.list_item_star, c, from, to, CursorAdapter.FLAG_REGISTER_CONTENT_OBSERVER);
        mCursor = c;
    }

    public Cursor getCursor() {
        return mCursor;
    }

}
