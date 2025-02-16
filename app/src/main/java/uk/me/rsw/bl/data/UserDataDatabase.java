package uk.me.rsw.bl.data;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.readystatesoftware.sqliteasset.SQLiteAssetHelper;

import uk.me.rsw.bl.models.Star;

public class UserDataDatabase extends SQLiteAssetHelper {

    private static final String DATABASE_NAME = "user_data.db";
    private static final int DATABASE_VERSION = 2; // Increment this (and create a SQL upgrade file) each time the database is updated

    public UserDataDatabase(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    public void addStar(Star add_star) {
        SQLiteDatabase db = getWritableDatabase();
        db.insertWithOnConflict("stars", null, add_star.getAsContentValues(), SQLiteDatabase.CONFLICT_REPLACE);
        db.close();
    }

    public void removeStar(Star remove_star) {
        SQLiteDatabase db = getWritableDatabase();
        String[] sqlArgs = { remove_star.getTitle(), Integer.toString(remove_star.getStage()), remove_star.getNotationExpanded() };
        db.delete("stars", "title = ? AND stage = ? AND notationExpanded = ?", sqlArgs);
        db.close();
    }

    public boolean isStar(Star is_star) {
        SQLiteDatabase db = getReadableDatabase();
        String[] sqlSelect = {"title"};
        String[] sqlArgs = { is_star.getTitle(), Integer.toString(is_star.getStage()), is_star.getNotationExpanded() };
        Cursor c = db.query("stars", sqlSelect, "title = ? AND stage = ? AND notationExpanded = ?", sqlArgs,  null, null, null);
        boolean iS = c.getCount() == 1;
        c.close();
        return iS;
    }

    public Cursor listStars() {
        SQLiteDatabase db = getReadableDatabase();
        String[] sqlSelect = {"rowid _id", "title", "stage", "notationExpanded", "custom"};
        return db.query("stars", sqlSelect, null, null, null, null, null);
    }

}