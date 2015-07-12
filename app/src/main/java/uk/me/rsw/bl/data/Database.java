package uk.me.rsw.bl.data;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.readystatesoftware.sqliteasset.SQLiteAssetHelper;

import uk.me.rsw.bl.models.Method;

public class Database extends SQLiteAssetHelper {

    private static final String DATABASE_NAME = "blueline.db";
    private static final int DATABASE_VERSION = 16;

    private static final String[] sqlSelect = {"title", "provisional", "url", "little", "differential", "classification", "stage", "notation", "notationExpanded", "leadHeadCode", "leadHead", "palindromic", "rotational", "doubleSym", "fchGroups", "numberOfHunts", "lengthOfLead", "callingPositions", "ruleOffs", "calls"};

    public Database(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        setForcedUpgrade(); // Database is read only so we can just throw away the old one
    }

    public Cursor search(String query) {
        SQLiteDatabase db = getReadableDatabase();

        String actualQuery = "%" + (query+"%")
                .replaceAll(" 4%$", " Minimus")
                .replaceAll(" 5%$", " Doubles")
                .replaceAll(" 6%$", " Minor")
                .replaceAll(" 7%$", " Triples")
                .replaceAll(" 8%$", " Major")
                .replaceAll(" 9%$", " Caters")
                .replaceAll(" 10%$", " Royal")
                .replaceAll(" 11%$", " Cinques")
                .replaceAll(" 12%$", " Maximus")
                .replace('*', '%')
                .replace('?','_')
                .replace('.',' ')
                .replace(',',' ')
                .replace(' ','%')
                .replaceAll("%+", "%");

        String[] sqlSelect     = {"rowid _id", "title"};
        String[] sqlSelectArgs = {actualQuery};
        return db.query("methods", sqlSelect, "title LIKE ?", sqlSelectArgs, null, null, "magic ASC", null);

    }

    public Method getFromTitle(String title) {
        SQLiteDatabase db = getReadableDatabase();
        Method method = new Method();
        String[] sqlSelectArgs = {title};
        Cursor c               = db.query("methods", sqlSelect, "title = ?", sqlSelectArgs, null, null, null, "1");
        if (c.getCount() > 0 && c.moveToNext()) {
            method.setWithCursor(c);
            return method;
        }
        return null;
    }

    public Method getFromURL(String url) {
        SQLiteDatabase db = getReadableDatabase();
        Method method = new Method();
        String[] sqlSelectArgs = {url};
        Cursor c               = db.query("methods", sqlSelect, "url = ?", sqlSelectArgs, null, null, null, "1");
        if (c.getCount() > 0 && c.moveToNext()) {
            method.setWithCursor(c);
            return method;
        }
        return null;
    }

    public Method getFromNotationExpandedAndStage(String notationExpanded, Integer stage) {
        SQLiteDatabase db = getReadableDatabase();
        Method method = new Method();
        String[] sqlSelectArgs = {notationExpanded, stage.toString()};
        Cursor c               = db.query("methods", sqlSelect, "notationExpanded = ? AND stage = ?", sqlSelectArgs, null, null, null, "1");
        if (c.getCount() > 0 && c.moveToNext()) {
            method.setWithCursor(c);
            return method;
        }
        return null;
    }
}