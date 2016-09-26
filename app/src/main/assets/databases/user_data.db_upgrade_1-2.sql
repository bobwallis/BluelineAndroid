-- add a custom column to stars
ALTER TABLE "stars" RENAME TO 'stars_tmp';
CREATE TABLE "stars" ("title" UNIQUE, "stage" INTEGER, "notationExpanded", "custom" INTEGER);
INSERT INTO "stars"  ("title", "stage", "notationExpanded", "custom") SELECT "title", "stage", "notationExpanded", 0 FROM "stars_tmp";
DROP TABLE "stars_tmp";