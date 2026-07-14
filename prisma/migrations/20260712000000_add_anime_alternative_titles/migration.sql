-- Add columns used for local library search across Kitsu title variants.
ALTER TABLE "anime" ADD COLUMN "alternative_titles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "anime" ADD COLUMN "search_text" TEXT NOT NULL DEFAULT '';

UPDATE "anime"
SET "search_text" = lower(concat_ws(' ', "title", "title_english"));

CREATE INDEX "anime_search_text_idx" ON "anime"("search_text");
