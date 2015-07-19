package uk.me.rsw.bl.models;

import android.content.ContentValues;

import java.io.Serializable;


public class Star implements Serializable {

    private String title = "";
    private Integer stage;
    private String notationExpanded;

    public Star() {
    }

    public Star(String set_title, Integer set_stage, String set_notationExpanded) {
        this.setTitle(set_title);
        this.setStage(set_stage);
        this.setNotationExpanded(set_notationExpanded);
    }


    public String getTitle() {
        return title;
    }
    public void setTitle(String set_title) {
        title = set_title;
    }

    public Integer getStage() {
        return stage;
    }
    public void setStage(Integer set_stage) {
        stage = set_stage;
    }

    public String getNotationExpanded() {
        return notationExpanded;
    }
    public void setNotationExpanded(String set_notationExpanded) {
        notationExpanded = set_notationExpanded;
    }

    public ContentValues getAsContentValues() {
        ContentValues star = new ContentValues();
        star.put("title", getTitle());
        star.put("stage", getStage());
        star.put("notationExpanded", getNotationExpanded());
        return star;
    }

}
