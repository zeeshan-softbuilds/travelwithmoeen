-- Additive. T-45: the database assigns the ids of new gallery photos, reviews, and home slides.
-- Each id column gets its own sequence, as a serial column has, moved on to the current max(id), so
-- existing ids are kept and the next add takes the next free id. No row is changed.
-- site_settings keeps its fixed id 1. npm run db:push gives the same columns from lib/db/schema.ts.
SET client_min_messages TO warning;
BEGIN;

CREATE SEQUENCE IF NOT EXISTS photos_id_seq AS integer OWNED BY photos.id;
ALTER TABLE photos ALTER COLUMN id SET DEFAULT nextval('photos_id_seq');
SELECT setval('photos_id_seq', coalesce(max(id), 1), max(id) IS NOT NULL) FROM photos;

CREATE SEQUENCE IF NOT EXISTS reviews_id_seq AS integer OWNED BY reviews.id;
ALTER TABLE reviews ALTER COLUMN id SET DEFAULT nextval('reviews_id_seq');
SELECT setval('reviews_id_seq', coalesce(max(id), 1), max(id) IS NOT NULL) FROM reviews;

CREATE SEQUENCE IF NOT EXISTS slides_id_seq AS integer OWNED BY slides.id;
ALTER TABLE slides ALTER COLUMN id SET DEFAULT nextval('slides_id_seq');
SELECT setval('slides_id_seq', coalesce(max(id), 1), max(id) IS NOT NULL) FROM slides;

COMMIT;
