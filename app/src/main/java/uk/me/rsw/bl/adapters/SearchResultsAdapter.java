package uk.me.rsw.bl.adapters;

import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import uk.me.rsw.bl.R;
import uk.me.rsw.bl.activities.MainActivity;
import uk.me.rsw.bl.activities.MethodActivity;

public class SearchResultsAdapter extends CursorRecyclerAdapter<SearchResultsAdapter.ViewHolder> {

    private Context mContext;
    private static final int LAST = 1; // viewType of the last item in the adapter

    public SearchResultsAdapter(Context context, Cursor c) {
        super(c);
        mContext = context;
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        View mView;

        ViewHolder(View v) {
            super(v);
            v.findViewById(R.id.text).setOnClickListener(this);
            mView = v;
        }

        @Override
        public void onClick(View view) {
            Intent intent = new Intent(mContext, MethodActivity.class);
            intent.putExtra(MainActivity.METHOD_TITLE, ((TextView) view).getText());
            mContext.startActivity(intent);
            InputMethodManager inputMethodManager = (InputMethodManager) mContext.getSystemService(Context.INPUT_METHOD_SERVICE);
            if (inputMethodManager != null) {
                inputMethodManager.hideSoftInputFromWindow(view.getApplicationWindowToken(), 0);
            }
        }
    }

    @Override
    public int getItemViewType(int position) {
        return (position == getItemCount()-1)? LAST : 0;
    }

    @NonNull
    @Override
    public SearchResultsAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == LAST) {
            return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.list_item_search_result_last, parent, false));
        }
        return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.list_item_search_result, parent, false));
    }

    @Override
    public void onBindViewHolderCursor(ViewHolder holder, Cursor c) {
        ((TextView) holder.mView.findViewById(R.id.text)).setText(c.getString(c.getColumnIndexOrThrow("title")));
    }

}