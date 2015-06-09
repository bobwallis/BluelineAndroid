package uk.me.rsw.bl.models;

import android.database.Cursor;
import android.text.TextUtils;

import java.io.Serializable;


public class Method implements Serializable {

    private String title = "";

    private Boolean differential = false;
    private Boolean little = false;
    private String classification = "";

    private Integer stage;

    private String notation;
    private String notationExpanded;

    private String leadHead = "";
    private String leadHeadCode = "";

    private Boolean doubleSym = false;
    private Boolean palindromic = false;
    private Boolean rotational = false;

    private Integer numberOfHunts = -1;
    private Integer lengthOfLead = 0;

    private String callingPositions = "{}";
    private String ruleOffs = "{}";
    private String calls = "{}";

    public Method() {
    }

    public String getTitle() {
        return title;
    }

    public Boolean getDifferential() {
        return differential;
    }

    public Boolean getLittle() {
        return little;
    }

    public String getClassification() {
        return classification;
    }

    public String getFullClassification() {
        return (differential?"Differential ":"") + (little?"Little ":"") + getClassification() + " " + getStageText();
    }

    public Integer getStage() {
        return stage;
    }
    public void setStage(Integer set_stage) {
        stage = set_stage;
    }

    public String getStageText() {
        switch(stage) {
            case 3:
                return "Singles";
            case 4:
                return "Minimus";
            case 5:
                return "Doubles";
            case 6:
                return "Minor";
            case 7:
                return "Triples";
            case 8:
                return "Major";
            case 9:
                return "Caters";
            case 10:
                return "Royal";
            case 11:
                return "Cinques";
            case 12:
                return "Maximus";
            case 13:
                return "Sextuples";
            case 14:
                return "Fourteen";
            case 15:
                return "Septuples";
            case 16:
                return "Sixteen";
            case 17:
                return "Octuples";
            case 18:
                return "Eighteen";
            case 19:
                return "Nineteen";
            case 20:
                return "Twenty";
            case 21:
                return "Twenty-one";
            case 22:
                return "Twenty-two";
        }
        return "";
    }

    public String getNotation() {
        return notation;
    }
    public void setNotation(String set_notation) {
        notation = set_notation;
    }

    public String getNotationExpanded() {
        return notationExpanded;
    }
    public void setNotationExpanded(String set_notationExpanded) {
        notationExpanded = set_notationExpanded;
    }

    public String getLeadHead() {
        return leadHead;
    }

    public String getLeadHeadCode() {
        return leadHeadCode;
    }

    public Boolean getPalindromic() {
        return palindromic;
    }

    public Boolean getRotational() {
        return rotational;
    }

    public Boolean getDouble() {
        return doubleSym;
    }

    public String getSymmetry() {
        if(palindromic && doubleSym) {
            return "Palindromic, double and rotational";
        }
        else if(doubleSym) {
            return "Double";
        }
        else if(palindromic) {
            return "Palindromic";
        }
        return "None";
    }

    public Integer getLengthOfLead() {
        return lengthOfLead;
    }

    public Integer getNumberOfHunts() {
        return numberOfHunts;
    }

    public String getRuleOffs() {
        return ruleOffs;
    }

    public String getCalls() {
        return calls;
    }

    public String getCallingPositions() {
        return callingPositions;
    }

    public void setWithCursor(Cursor c) {
        title = c.getString(c.getColumnIndexOrThrow("title"));

        differential = c.getInt(c.getColumnIndexOrThrow("differential")) == 1;
        little = c.getInt(c.getColumnIndexOrThrow("little")) == 1;
        classification = c.getString(c.getColumnIndexOrThrow("classification"));

        stage = c.getInt(c.getColumnIndexOrThrow("stage"));

        notation = c.getString(c.getColumnIndexOrThrow("notation"));
        notationExpanded = c.getString(c.getColumnIndexOrThrow("notationExpanded"));

        leadHead = c.getString(c.getColumnIndexOrThrow("leadHead"));
        leadHeadCode = c.getString(c.getColumnIndexOrThrow("leadHeadCode"));

        doubleSym = c.getInt(c.getColumnIndexOrThrow("doubleSym")) == 1;
        palindromic = c.getInt(c.getColumnIndexOrThrow("palindromic")) == 1;
        rotational = c.getInt(c.getColumnIndexOrThrow("rotational")) == 1;

        numberOfHunts = c.getInt(c.getColumnIndexOrThrow("numberOfHunts"));
        lengthOfLead = c.getInt(c.getColumnIndexOrThrow("lengthOfLead"));

        callingPositions = c.getString(c.getColumnIndexOrThrow("callingPositions"));
        ruleOffs = c.getString(c.getColumnIndexOrThrow("ruleOffs"));
        calls = c.getString(c.getColumnIndexOrThrow("calls"));
    }
}
