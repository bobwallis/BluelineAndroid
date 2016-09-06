package uk.me.rsw.bl.fragments;

import android.app.Activity;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.support.v7.app.AlertDialog;
import android.widget.EditText;

import uk.me.rsw.bl.R;

public class NameRequestDialogFragment extends DialogFragment {

    public interface NoticeDialogListener {
        public void onDialogPositiveClick(final String input);
        public void onDialogNegativeClick();
    }

    NoticeDialogListener listener;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            listener = (NoticeDialogListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString()+" must implement NoticeDialogListener");
        }
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        final EditText edittext = new EditText(getActivity());
        builder.setMessage(R.string.enter_custom_title)
                .setView(edittext)
                .setPositiveButton(R.string.action_star, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        listener.onDialogPositiveClick(edittext.getText().toString());
                    }
                })
                .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        listener.onDialogNegativeClick();
                    }
                });
        return builder.create();
    }
}
