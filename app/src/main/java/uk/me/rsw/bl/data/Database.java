package uk.me.rsw.bl.data;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.readystatesoftware.sqliteasset.SQLiteAssetHelper;

import uk.me.rsw.bl.models.Method;

public class Database extends SQLiteAssetHelper {

    private static final String DATABASE_NAME = "blueline.db";
    private static final int DATABASE_VERSION = 14;

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

    public Method get(String title) {
        SQLiteDatabase db = getReadableDatabase();
        Method method = new Method();

        String[] sqlSelect     = {"title", "little", "differential", "classification", "stage", "notation", "notationExpanded", "leadHeadCode", "leadHead", "palindromic", "rotational", "doubleSym", "fchGroups", "numberOfHunts", "lengthOfLead", "callingPositions", "ruleOffs", "calls"};
        String[] sqlSelectArgs = {title};
        Cursor c               = db.query("methods", sqlSelect, "title = ?", sqlSelectArgs, null, null, null, "1");

        if (c.moveToNext()) {
            method.setWithCursor(c);
        }

        return method;
    }

}