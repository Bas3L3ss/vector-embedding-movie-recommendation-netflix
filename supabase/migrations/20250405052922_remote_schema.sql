

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";






CREATE TYPE "public"."Genre" AS ENUM (
    'ACTION',
    'ADVENTURE',
    'ANIMATION',
    'COMEDY',
    'CRIME',
    'DOCUMENTARY',
    'DRAMA',
    'FAMILY',
    'FANTASY',
    'HISTORY',
    'HORROR',
    'MUSIC',
    'MYSTERY',
    'ROMANCE',
    'SCI_FI',
    'THRILLER',
    'WAR',
    'WESTERN',
    'INDIE',
    'PSYCHOLOGICAL',
    'HISTORICAL',
    'SUPERHERO',
    'MARVEL',
    'DC',
    'BOLLYWOOD',
    'TVSHOW'
);


ALTER TYPE "public"."Genre" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."match_movie"("query_embedding" "extensions"."vector", "similarity_threshold" double precision DEFAULT 0.3, "match_count" integer DEFAULT 10, "genre_filter" "public"."Genre"[] DEFAULT NULL::"public"."Genre"[]) RETURNS TABLE("id" bigint, "title" character varying, "description" "text", "releaseyear" integer, "genre" "public"."Genre"[], "director" character varying, "movie_cast" "text"[], "duration" integer, "language" character varying[], "country" character varying, "rating" numeric, "posterurl" character varying[], "trailerurl" character varying[], "videourl" character varying[], "embedding" "extensions"."vector", "createdat" timestamp without time zone, "updatedat" timestamp without time zone, "featured" boolean, "tags" "text"[], "similarity" double precision)
    LANGUAGE "sql"
    AS $$
select
    *,
    1 - ("Movie".embedding <=> query_embedding) as similarity -- Cosine similarity
from "Movie"
where 1 - ("Movie".embedding <=> query_embedding) > similarity_threshold -- Filter by threshold
and (genre_filter is NULL or genre_filter = '{}' or  "Movie".genre && genre_filter)
ORDER BY similarity DESC
limit match_count;
$$;


ALTER FUNCTION "public"."match_movie"("query_embedding" "extensions"."vector", "similarity_threshold" double precision, "match_count" integer, "genre_filter" "public"."Genre"[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Favorite" (
    "id" bigint NOT NULL,
    "userId" "uuid" NOT NULL,
    "filmId" bigint NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE "public"."Favorite" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Favorite_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Favorite_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Favorite_id_seq" OWNED BY "public"."Favorite"."id";



CREATE TABLE IF NOT EXISTS "public"."Movie" (
    "id" bigint NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "releaseYear" integer NOT NULL,
    "genre" "public"."Genre"[],
    "director" character varying(255),
    "cast" "text"[],
    "duration" integer NOT NULL,
    "language" character varying(50)[],
    "country" character varying(100),
    "rating" numeric(3,1),
    "posterUrl" character varying(255)[],
    "trailerUrl" character varying(255)[],
    "videoUrl" character varying(255)[],
    "embedding" "extensions"."vector"(1024) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "featured" boolean NOT NULL,
    "tags" "text"[] DEFAULT ARRAY[]::"text"[],
    CONSTRAINT "Movie_duration_check" CHECK (("duration" > 0)),
    CONSTRAINT "Movie_rating_check" CHECK ((("rating" >= (0)::numeric) AND ("rating" <= (10)::numeric)))
);


ALTER TABLE "public"."Movie" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Movie_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Movie_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Movie_id_seq" OWNED BY "public"."Movie"."id";



ALTER TABLE ONLY "public"."Favorite" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Favorite_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Movie" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Movie_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Favorite"
    ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Movie"
    ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "Favorite_userId_filmId_key" ON "public"."Favorite" USING "btree" ("userId", "filmId");



CREATE INDEX "Favorite_userId_idx" ON "public"."Favorite" USING "btree" ("userId");



CREATE INDEX "Movie_createdAt_idx" ON "public"."Movie" USING "btree" ("createdAt");



CREATE UNIQUE INDEX "Movie_title_key" ON "public"."Movie" USING "btree" ("title");



ALTER TABLE ONLY "public"."Favorite"
    ADD CONSTRAINT "Favorite_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "public"."Movie"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Allow read access for authenticated users only" ON "public"."Movie" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."Favorite" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "userId"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."Movie" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for users based on user_id" ON "public"."Favorite" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "userId"));



CREATE POLICY "Enable users to view their own data only" ON "public"."Favorite" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "userId"));



ALTER TABLE "public"."Favorite" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Movie" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































































































































































































































































































































































































































GRANT ALL ON TABLE "public"."Favorite" TO "anon";
GRANT ALL ON TABLE "public"."Favorite" TO "authenticated";
GRANT ALL ON TABLE "public"."Favorite" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Favorite_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Favorite_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Favorite_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Movie" TO "anon";
GRANT ALL ON TABLE "public"."Movie" TO "authenticated";
GRANT ALL ON TABLE "public"."Movie" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Movie_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Movie_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Movie_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
