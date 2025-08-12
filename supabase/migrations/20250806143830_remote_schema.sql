

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."document_category" AS ENUM (
    'news',
    'contracts',
    'recruiting'
);


ALTER TYPE "public"."document_category" OWNER TO "postgres";


CREATE TYPE "public"."file_type" AS ENUM (
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'txt',
    'png',
    'jpg',
    'jpeg'
);


ALTER TYPE "public"."file_type" OWNER TO "postgres";


CREATE TYPE "public"."goal_recurring_duration" AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'yearly'
);


ALTER TYPE "public"."goal_recurring_duration" OWNER TO "postgres";


COMMENT ON TYPE "public"."goal_recurring_duration" IS 'How often the goal repeats (daily, weekly, monthly, yearly)';



CREATE TYPE "public"."payment_status" AS ENUM (
    'pending',
    'paid',
    'overdue',
    'cancelled',
    'refunded'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


COMMENT ON TYPE "public"."payment_status" IS 'Premium payment status types';



CREATE TYPE "public"."premium_frequency" AS ENUM (
    'monthly',
    'quarterly',
    'annually'
);


ALTER TYPE "public"."premium_frequency" OWNER TO "postgres";


COMMENT ON TYPE "public"."premium_frequency" IS 'How often premiums are paid: monthly, quarterly, annually';



CREATE TYPE "public"."regional" AS ENUM (
    'North',
    'South',
    'West',
    'East'
);


ALTER TYPE "public"."regional" OWNER TO "postgres";


CREATE TYPE "public"."status" AS ENUM (
    'active',
    'disabled',
    'delete'
);


ALTER TYPE "public"."status" OWNER TO "postgres";


COMMENT ON TYPE "public"."status" IS 'User account status types';



CREATE TYPE "public"."title" AS ENUM (
    'SuperAdmin',
    'NationalDirector',
    'RegionalDirector',
    'DivisionalDirector',
    'AssociateDirector',
    'PlatinumAssociate',
    'SeniorAssociate',
    'Associate',
    'Leads'
);


ALTER TYPE "public"."title" OWNER TO "postgres";


COMMENT ON TYPE "public"."title" IS 'User role/position in the organization hierarchy';



CREATE OR REPLACE FUNCTION "public"."add_resource_permissions"("resource_name" "text", "actions" "text"[]) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    action_item TEXT;
    inserted_count INT := 0;
BEGIN
    FOREACH action_item IN ARRAY actions
    LOOP
        INSERT INTO permissions (resource, action, description)
        VALUES (
            resource_name, 
            action_item, 
            INITCAP(action_item) || ' access to ' || resource_name
        )
        ON CONFLICT (resource, action) DO NOTHING;
        
        IF FOUND THEN
            inserted_count := inserted_count + 1;
        END IF;
    END LOOP;
    
    RETURN inserted_count;
END;
$$;


ALTER FUNCTION "public"."add_resource_permissions"("resource_name" "text", "actions" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_manage_document"("document_id" "uuid", "required_permission" "text" DEFAULT 'documents:update'::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    doc_owner UUID;
BEGIN
    -- Get document owner
    SELECT uploaded_by INTO doc_owner
    FROM public.documents
    WHERE id = document_id AND deleted_at IS NULL;
    
    -- If document doesn't exist, return false
    IF doc_owner IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- SuperAdmin can manage all documents
    IF issuperadmin() THEN
        RETURN TRUE;
    END IF;
    
    -- Document owner can manage their own documents
    IF doc_owner = auth.uid() THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user has the required permission
    IF user_has_permission(auth.uid(), required_permission) THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."can_manage_document"("document_id" "uuid", "required_permission" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_manage_user"("target_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN issuperadmin() OR isuserleader(target_user_id) OR target_user_id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."can_manage_user"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_and_reset_goals"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    PERFORM reset_recurring_goals();
    RETURN 'Goals reset check completed at ' || NOW()::TEXT;
END;
$$;


ALTER FUNCTION "public"."check_and_reset_goals"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."check_and_reset_goals"() IS 'Manual function to check and reset recurring goals - should be called periodically';



CREATE OR REPLACE FUNCTION "public"."get_manageable_users"() RETURNS TABLE("user_id" "uuid", "username" "text", "name" "text", "role_names" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    IF issuperadmin() THEN
        -- SuperAdmin can manage everyone
        RETURN QUERY
        SELECT 
            p.user_id,
            p.username,
            p.name,
            STRING_AGG(r.name, ', ' ORDER BY r.level, r.name) as role_names
        FROM profile p
        LEFT JOIN user_roles ur ON p.user_id = ur.user_id AND ur.status = 'active' AND ur.deleted_at IS NULL
        LEFT JOIN roles r ON ur.role_id = r.id AND r.status = 'active' AND r.deleted_at IS NULL
        WHERE p.status = 'active' AND p.deleted_at IS NULL
        GROUP BY p.user_id, p.username, p.name;
    ELSE
        -- Regular users can only manage users they lead + themselves
        RETURN QUERY
        SELECT 
            p.user_id,
            p.username,
            p.name,
            STRING_AGG(r.name, ', ' ORDER BY r.level, r.name) as role_names
        FROM profile p
        LEFT JOIN user_roles ur ON p.user_id = ur.user_id AND ur.status = 'active' AND ur.deleted_at IS NULL
        LEFT JOIN roles r ON ur.role_id = r.id AND r.status = 'active' AND r.deleted_at IS NULL
        WHERE p.status = 'active' 
        AND p.deleted_at IS NULL
        AND (isuserleader(p.user_id) OR p.user_id = auth.uid())
        GROUP BY p.user_id, p.username, p.name;
    END IF;
END;
$$;


ALTER FUNCTION "public"."get_manageable_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_accessible_documents"("p_category" "public"."document_category" DEFAULT NULL::"public"."document_category", "p_search" "text" DEFAULT NULL::"text", "p_limit" integer DEFAULT 50, "p_offset" integer DEFAULT 0) RETURNS TABLE("id" "uuid", "file_name" character varying, "original_file_name" character varying, "file_type" "public"."file_type", "file_size" bigint, "file_path" "text", "category" "public"."document_category", "title" character varying, "uploaded_by" "jsonb", "created_at" timestamp with time zone, "updated_at" timestamp with time zone, "can_update" boolean, "can_delete" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.file_name,
        d.original_file_name,
        d.file_type,
        d.file_size,
        d.file_path,
        d.category,
        d.title,
        jsonb_build_object(
            'id', d.uploaded_by,
            'email', u.email,
            'name', p.name,
            'avatar', p.avatar_url
        ) as uploaded_by,
        d.created_at,
        d.updated_at,
        public.can_manage_document(d.id, 'documents:update') as can_update,
        public.can_manage_document(d.id, 'documents:delete') as can_delete
    FROM public.documents d
    LEFT JOIN public.profile p ON d.uploaded_by = p.user_id
    LEFT JOIN auth.users u ON d.uploaded_by = u.id
    WHERE d.deleted_at IS NULL
    AND (p_category IS NULL OR d.category = p_category)
    AND (p_search IS NULL OR d.search_vector @@ plainto_tsquery('english', p_search))
    AND (
        -- User has read permission
        public.user_has_permission(auth.uid(), 'documents:read')
        OR
        -- Or is the document owner
        d.uploaded_by = auth.uid()
        OR
        -- Or is SuperAdmin
        public.issuperadmin()
    )
    ORDER BY d.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;


ALTER FUNCTION "public"."get_user_accessible_documents"("p_category" "public"."document_category", "p_search" "text", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_permissions"("user_uuid" "uuid") RETURNS TABLE("permission_name" "text", "resource" "text", "action" "text", "source_type" "text", "source_name" "text", "expires_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    -- Permissions from roles
    SELECT 
        p.name as permission_name,
        p.resource,
        p.action,
        'role' as source_type,
        r.name as source_name,
        ur.expires_at
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid
    AND ur.status = 'active'
    AND ur.deleted_at IS NULL
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND rp.deleted_at IS NULL
    AND p.deleted_at IS NULL
    AND r.status = 'active'
    AND r.deleted_at IS NULL

    UNION

    -- Direct permissions
    SELECT 
        p.name as permission_name,
        p.resource,
        p.action,
        'direct' as source_type,
        'Direct Assignment' as source_name,
        upe.expires_at
    FROM user_permissions_enhanced upe
    JOIN permissions p ON upe.permission_id = p.id
    WHERE upe.user_id = user_uuid
    AND upe.status = 'active'
    AND upe.deleted_at IS NULL
    AND (upe.expires_at IS NULL OR upe.expires_at > NOW())
    AND p.deleted_at IS NULL;
END;
$$;


ALTER FUNCTION "public"."get_user_permissions"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."issuperadmin"() RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$SELECT EXISTS (
    SELECT 1 FROM public.profile 
    WHERE user_id = (select auth.uid()) 
      AND role IN ('SuperAdmin')
      AND status = 'active'
      AND deleted_at IS NULL
  );$$;


ALTER FUNCTION "public"."issuperadmin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."isuserleader"("target_user_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$SELECT EXISTS (
    WITH RECURSIVE hierarchy_chain AS (
      -- Base case: direct reports
      SELECT user_id, leader_id, 1 as level
      FROM public.user_hierarchy 
      WHERE leader_id = (select auth.uid()) 
        AND deleted_at IS NULL
      
      UNION ALL
      
      -- Recursive case: reports of reports
      SELECT uh.user_id, uh.leader_id, hc.level + 1
      FROM public.user_hierarchy uh
      INNER JOIN hierarchy_chain hc ON uh.leader_id = hc.user_id
      WHERE uh.deleted_at IS NULL
        AND hc.level < 10 -- Prevent infinite recursion
    )
    SELECT 1 FROM hierarchy_chain WHERE user_id = target_user_id
  );$$;


ALTER FUNCTION "public"."isuserleader"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reset_recurring_goals"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    goal_record RECORD;
    should_reset BOOLEAN;
    next_reset_date TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Loop through all active recurring goals
    FOR goal_record IN 
        SELECT * FROM goals 
        WHERE recurring_duration IS NOT NULL 
        AND deleted_at IS NULL
    LOOP
        should_reset := FALSE;
        
        -- Check if it's time to reset based on recurring_duration
        CASE goal_record.recurring_duration
            WHEN 'daily' THEN
                should_reset := (EXTRACT(DAY FROM NOW()) != EXTRACT(DAY FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('day', NOW()) > DATE_TRUNC('day', goal_record.last_reset_date));
                next_reset_date := DATE_TRUNC('day', NOW()) + INTERVAL '1 day';
                
            WHEN 'weekly' THEN
                should_reset := (EXTRACT(WEEK FROM NOW()) != EXTRACT(WEEK FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('week', NOW()) > DATE_TRUNC('week', goal_record.last_reset_date));
                next_reset_date := DATE_TRUNC('week', NOW()) + INTERVAL '1 week';
                
            WHEN 'monthly' THEN
                should_reset := (EXTRACT(MONTH FROM NOW()) != EXTRACT(MONTH FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('month', NOW()) > DATE_TRUNC('month', goal_record.last_reset_date));
                next_reset_date := DATE_TRUNC('month', NOW()) + INTERVAL '1 month';
                
            WHEN 'yearly' THEN
                should_reset := (EXTRACT(YEAR FROM NOW()) != EXTRACT(YEAR FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('year', NOW()) > DATE_TRUNC('year', goal_record.last_reset_date));
                next_reset_date := DATE_TRUNC('year', NOW()) + INTERVAL '1 year';
        END CASE;
        
        -- Reset if needed
        IF should_reset THEN
            UPDATE goals 
            SET achieved = 0, 
                last_reset_date = NOW(),
                updated_at = NOW()
            WHERE id = goal_record.id;
        END IF;
    END LOOP;
    
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."reset_recurring_goals"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."reset_recurring_goals"() IS 'Resets achieved values for recurring goals when their duration period has passed';



CREATE OR REPLACE FUNCTION "public"."update_documents_search_vector"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        coalesce(NEW.title, '') || ' ' || 
        coalesce(NEW.original_file_name, '') || ' ' || 
        coalesce(NEW.description, '') || ' ' ||
        array_to_string(NEW.tags, ' ')
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_documents_search_vector"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_goals_on_sale"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    user_profile_id UUID;
    goal_record RECORD;
    should_reset BOOLEAN;
BEGIN
    -- Get the profile_id for the user who made the sale
    SELECT id INTO user_profile_id 
    FROM profile 
    WHERE user_id = NEW.user_id;
    
    -- If no profile found, skip
    IF user_profile_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Loop through all active recurring goals for the user
    FOR goal_record IN 
        SELECT * FROM goals 
        WHERE profile_id = user_profile_id 
        AND recurring_duration IS NOT NULL 
        AND deleted_at IS NULL
    LOOP
        should_reset := FALSE;

        -- Check if it's time to reset based on recurring_duration
        CASE goal_record.recurring_duration
            WHEN 'daily' THEN
                should_reset := (EXTRACT(DAY FROM NOW()) != EXTRACT(DAY FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('day', NOW()) > DATE_TRUNC('day', goal_record.last_reset_date));
                
            WHEN 'weekly' THEN
                should_reset := (EXTRACT(WEEK FROM NOW()) != EXTRACT(WEEK FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('week', NOW()) > DATE_TRUNC('week', goal_record.last_reset_date));
                
            WHEN 'monthly' THEN
                should_reset := (EXTRACT(MONTH FROM NOW()) != EXTRACT(MONTH FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('month', NOW()) > DATE_TRUNC('month', goal_record.last_reset_date));
                
            WHEN 'yearly' THEN
                should_reset := (EXTRACT(YEAR FROM NOW()) != EXTRACT(YEAR FROM goal_record.last_reset_date))
                    OR (DATE_TRUNC('year', NOW()) > DATE_TRUNC('year', goal_record.last_reset_date));
        END CASE;

        -- Reset if needed
        IF should_reset THEN
            UPDATE goals 
            SET achieved = 0, 
                last_reset_date = NOW(),
                updated_at = NOW()
            WHERE id = goal_record.id;
        END IF;
    END LOOP;

    -- Update sales count goals
    FOR goal_record IN 
        SELECT * FROM goals 
        WHERE profile_id = user_profile_id 
        AND goal_type = 'sales'
        AND deleted_at IS NULL
        AND (
            (recurring_duration IS NOT NULL) OR 
            (recurring_duration IS NULL AND end_date >= CURRENT_DATE)
        )
    LOOP
        UPDATE goals 
        SET achieved = achieved + 1,
            updated_at = NOW()
        WHERE id = goal_record.id;
    END LOOP;
    
    -- Update revenue goals
    FOR goal_record IN 
        SELECT * FROM goals 
        WHERE profile_id = user_profile_id 
        AND goal_type = 'revenue'
        AND deleted_at IS NULL
        AND (
            (recurring_duration IS NOT NULL) OR 
            (recurring_duration IS NULL AND end_date >= CURRENT_DATE)
        )
    LOOP
        UPDATE goals 
        SET achieved = achieved + NEW.total_sale_value,
            updated_at = NOW()
        WHERE id = goal_record.id;
    END LOOP;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_goals_on_sale"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_goals_on_sale"() IS 'Updates goal achievement when a new sale is made';



CREATE OR REPLACE FUNCTION "public"."update_total_sale_value"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE sales
    SET total_sale_value = (
        SELECT COALESCE(SUM(premium_amount), 0)
        FROM sale_items
        WHERE sale_id = NEW.sale_id
    )
    WHERE id = NEW.sale_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_total_sale_value"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if user has permission through roles
    IF EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_uuid
        AND p.name = permission_name
        AND ur.status = 'active'
        AND ur.deleted_at IS NULL
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        AND rp.deleted_at IS NULL
        AND p.deleted_at IS NULL
    ) THEN
        RETURN TRUE;
    END IF;

    -- Check if user has direct permission
    IF EXISTS (
        SELECT 1
        FROM user_permissions_enhanced upe
        JOIN permissions p ON upe.permission_id = p.id
        WHERE upe.user_id = user_uuid
        AND p.name = permission_name
        AND upe.status = 'active'
        AND upe.deleted_at IS NULL
        AND (upe.expires_at IS NULL OR upe.expires_at > NOW())
        AND p.deleted_at IS NULL
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "resource_name" "text", "action_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN user_has_permission(user_uuid, resource_name || ':' || action_name);
END;
$$;


ALTER FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "resource_name" "text", "action_name" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "file_name" character varying(255) NOT NULL,
    "original_file_name" character varying(255) NOT NULL,
    "file_type" "public"."file_type" NOT NULL,
    "file_size" bigint NOT NULL,
    "file_path" "text" NOT NULL,
    "storage_bucket" character varying(100) DEFAULT 'documents'::character varying,
    "category" "public"."document_category" NOT NULL,
    "tags" "text"[],
    "title" character varying(500),
    "description" "text",
    "uploaded_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone,
    "search_vector" "tsvector"
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."goals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" NOT NULL,
    "label" character varying(255) NOT NULL,
    "target" numeric,
    "end_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone,
    "recurring_duration" "public"."goal_recurring_duration",
    "achieved" numeric DEFAULT '0'::numeric NOT NULL,
    "last_reset_date" timestamp with time zone DEFAULT "now"(),
    "goal_type" character varying(50) DEFAULT 'sales'::character varying,
    CONSTRAINT "goals_goal_type_check" CHECK ((("goal_type")::"text" = ANY ((ARRAY['sales'::character varying, 'revenue'::character varying])::"text"[])))
);


ALTER TABLE "public"."goals" OWNER TO "postgres";


COMMENT ON COLUMN "public"."goals"."achieved" IS 'Achieved value for the goal (numeric)';



COMMENT ON COLUMN "public"."goals"."last_reset_date" IS 'Last time this recurring goal was reset';



COMMENT ON COLUMN "public"."goals"."goal_type" IS 'Type of goal: sales (count), revenue (amount), or custom';



CREATE TABLE IF NOT EXISTS "public"."insurance_companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "code" character varying(10) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(20) NOT NULL,
    "website" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone,
    "image_url" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."insurance_companies" OWNER TO "postgres";


COMMENT ON TABLE "public"."insurance_companies" IS 'Insurance companies that offer products through our system';



COMMENT ON COLUMN "public"."insurance_companies"."id" IS 'Unique identifier for each insurance company';



COMMENT ON COLUMN "public"."insurance_companies"."name" IS 'Full company name';



COMMENT ON COLUMN "public"."insurance_companies"."code" IS 'Short company identifier code';



COMMENT ON COLUMN "public"."insurance_companies"."email" IS 'Company contact email address';



COMMENT ON COLUMN "public"."insurance_companies"."phone" IS 'Company contact phone number';



COMMENT ON COLUMN "public"."insurance_companies"."website" IS 'Company website URL';



COMMENT ON COLUMN "public"."insurance_companies"."created_at" IS 'When the company record was created';



COMMENT ON COLUMN "public"."insurance_companies"."updated_at" IS 'When the company record was last updated';



COMMENT ON COLUMN "public"."insurance_companies"."deleted_at" IS 'Soft delete timestamp, null if not deleted';



CREATE TABLE IF NOT EXISTS "public"."insurance_products" (
    "id" "uuid" NOT NULL,
    "name" character varying(255) NOT NULL,
    "product_code" character varying(50) NOT NULL,
    "status" "public"."status" DEFAULT 'active'::"public"."status" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone
);


ALTER TABLE "public"."insurance_products" OWNER TO "postgres";


COMMENT ON TABLE "public"."insurance_products" IS 'Insurance products offered by partner companies';



COMMENT ON COLUMN "public"."insurance_products"."id" IS 'Unique identifier for each insurance product';



COMMENT ON COLUMN "public"."insurance_products"."name" IS 'Product name/title';



COMMENT ON COLUMN "public"."insurance_products"."product_code" IS 'Unique product identifier code';



COMMENT ON COLUMN "public"."insurance_products"."status" IS 'Product availability status: active, inactive, deleted';



COMMENT ON COLUMN "public"."insurance_products"."created_at" IS 'When the product was added to system';



COMMENT ON COLUMN "public"."insurance_products"."updated_at" IS 'When the product was last modified';



COMMENT ON COLUMN "public"."insurance_products"."deleted_at" IS 'Soft delete timestamp, null if not deleted';



CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "resource" "text" NOT NULL,
    "action" "text" NOT NULL,
    "name" "text" GENERATED ALWAYS AS ((("resource" || ':'::"text") || "action")) STORED,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone,
    CONSTRAINT "permissions_action_no_colon" CHECK (("action" !~ ':'::"text")),
    CONSTRAINT "permissions_resource_no_colon" CHECK (("resource" !~ ':'::"text"))
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profile" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "username" character varying NOT NULL,
    "status" "public"."status" NOT NULL,
    "name" character varying NOT NULL,
    "address" character varying NOT NULL,
    "dob" "date" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone,
    "avatar_url" "text" DEFAULT 'https://axdfmmwtobzrqbdcikrt.supabase.co/storage/v1/object/public/profile-images//default.jpg'::"text" NOT NULL,
    "role" "public"."title" DEFAULT 'SuperAdmin'::"public"."title",
    "phone_number" "text",
    "regional" "text",
    "upline" "text",
    "npn_number" "text",
    "states" "jsonb"[]
);


ALTER TABLE "public"."profile" OWNER TO "postgres";


COMMENT ON TABLE "public"."profile" IS 'Extended profile information for users';



COMMENT ON COLUMN "public"."profile"."id" IS 'Unique identifier for each profile';



COMMENT ON COLUMN "public"."profile"."user_id" IS 'Reference to the user this profile belongs to';



COMMENT ON COLUMN "public"."profile"."username" IS 'Unique username';



COMMENT ON COLUMN "public"."profile"."status" IS 'User account status - active, disabled, or deleted';



COMMENT ON COLUMN "public"."profile"."name" IS 'Full name of the user';



COMMENT ON COLUMN "public"."profile"."address" IS 'Physical address of the user';



COMMENT ON COLUMN "public"."profile"."dob" IS 'Date of birth';



COMMENT ON COLUMN "public"."profile"."created_at" IS 'When the profile record was created';



COMMENT ON COLUMN "public"."profile"."updated_at" IS 'When the profile record was last updated';



COMMENT ON COLUMN "public"."profile"."deleted_at" IS 'Soft delete timestamp, null if not deleted';



COMMENT ON COLUMN "public"."profile"."avatar_url" IS 'URL for user avatar';



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role_id" "uuid" NOT NULL,
    "permission_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL,
    "description" "text",
    "level" smallint NOT NULL,
    "is_system_role" boolean DEFAULT false,
    "status" "public"."status" DEFAULT 'active'::"public"."status",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sale_items" (
    "id" "uuid" NOT NULL,
    "sale_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "premium_amount" numeric(10,2) NOT NULL,
    "policy_number" character varying(100) NOT NULL,
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone,
    "company_id" "uuid"
);


ALTER TABLE "public"."sale_items" OWNER TO "postgres";


COMMENT ON TABLE "public"."sale_items" IS 'Individual products/policies within a sale - allows multiple policies per sale transaction';



COMMENT ON COLUMN "public"."sale_items"."id" IS 'Unique identifier for each sale item';



COMMENT ON COLUMN "public"."sale_items"."sale_id" IS 'Reference to the main sale transaction';



COMMENT ON COLUMN "public"."sale_items"."product_id" IS 'Reference to the insurance product being sold';



COMMENT ON COLUMN "public"."sale_items"."premium_amount" IS 'Premium amount for this specific product/person';



COMMENT ON COLUMN "public"."sale_items"."policy_number" IS 'Unique policy identifier for this specific coverage';



COMMENT ON COLUMN "public"."sale_items"."notes" IS 'Additional notes about this specific policy/person';



COMMENT ON COLUMN "public"."sale_items"."created_at" IS 'When the sale item was created';



COMMENT ON COLUMN "public"."sale_items"."updated_at" IS 'When the sale item was last updated';



COMMENT ON COLUMN "public"."sale_items"."deleted_at" IS 'Soft delete timestamp, null if not deleted';



CREATE TABLE IF NOT EXISTS "public"."sales" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "customer_name" character varying(255) NOT NULL,
    "sale_date" "date" DEFAULT "now"() NOT NULL,
    "total_sale_value" numeric(15,2) NOT NULL,
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone
);


ALTER TABLE "public"."sales" OWNER TO "postgres";


COMMENT ON TABLE "public"."sales" IS 'Sales transactions - can contain multiple insurance products for different family members';



COMMENT ON COLUMN "public"."sales"."id" IS 'Unique identifier for each sale transaction';



COMMENT ON COLUMN "public"."sales"."user_id" IS 'Reference to the sales agent/user who made the sale';



COMMENT ON COLUMN "public"."sales"."customer_name" IS 'Name of the primary customer who purchased the policies';



COMMENT ON COLUMN "public"."sales"."sale_date" IS 'Date when the sale was completed';



COMMENT ON COLUMN "public"."sales"."total_sale_value" IS 'Total value of all products in this sale';



COMMENT ON COLUMN "public"."sales"."notes" IS 'Additional notes or comments about the sale';



COMMENT ON COLUMN "public"."sales"."created_at" IS 'When the sale record was created';



COMMENT ON COLUMN "public"."sales"."updated_at" IS 'When the sale record was last updated';



COMMENT ON COLUMN "public"."sales"."deleted_at" IS 'Soft delete timestamp, null if not deleted';



CREATE TABLE IF NOT EXISTS "public"."user_hierarchy" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "leader_id" "uuid",
    "region" character varying(100) NOT NULL,
    "division" character varying(100),
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "deleted_at" timestamp without time zone
);


ALTER TABLE "public"."user_hierarchy" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_hierarchy" IS 'Organizational hierarchy defining reporting relationships and levels';



COMMENT ON COLUMN "public"."user_hierarchy"."id" IS 'Unique identifier for hierarchy relationship';



COMMENT ON COLUMN "public"."user_hierarchy"."user_id" IS 'Reference to the user';



COMMENT ON COLUMN "public"."user_hierarchy"."leader_id" IS 'Reference to this user''s direct leader/manager';



COMMENT ON COLUMN "public"."user_hierarchy"."region" IS 'Geographic region this user manages/belongs to';



COMMENT ON COLUMN "public"."user_hierarchy"."division" IS 'Division or area this user manages/belongs to';



COMMENT ON COLUMN "public"."user_hierarchy"."created_at" IS 'When this hierarchy record was created';



COMMENT ON COLUMN "public"."user_hierarchy"."updated_at" IS 'When this hierarchy record was last updated';



COMMENT ON COLUMN "public"."user_hierarchy"."deleted_at" IS 'Soft delete timestamp, null if not deleted';



CREATE TABLE IF NOT EXISTS "public"."user_permissions_enhanced" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "permission_id" "uuid" NOT NULL,
    "granted_by" "uuid",
    "granted_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "reason" "text",
    "status" "public"."status" DEFAULT 'active'::"public"."status",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."user_permissions_enhanced" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role_id" "uuid" NOT NULL,
    "assigned_by" "uuid",
    "assigned_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    "status" "public"."status" DEFAULT 'active'::"public"."status",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."insurance_companies"
    ADD CONSTRAINT "insurance_companies_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."insurance_companies"
    ADD CONSTRAINT "insurance_companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."insurance_products"
    ADD CONSTRAINT "insurance_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."insurance_products"
    ADD CONSTRAINT "insurance_products_product_code_key" UNIQUE ("product_code");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_resource_action_key" UNIQUE ("resource", "action");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_permission_key" UNIQUE ("role_id", "permission_id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sale_items"
    ADD CONSTRAINT "sale_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sale_items"
    ADD CONSTRAINT "sale_items_policy_number_key" UNIQUE ("policy_number");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_hierarchy"
    ADD CONSTRAINT "user_hierarchy_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_permissions_enhanced"
    ADD CONSTRAINT "user_permissions_enhanced_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_permissions_enhanced"
    ADD CONSTRAINT "user_permissions_enhanced_user_permission_key" UNIQUE ("user_id", "permission_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_role_key" UNIQUE ("user_id", "role_id");



CREATE INDEX "idx_documents_category" ON "public"."documents" USING "btree" ("category");



CREATE INDEX "idx_documents_created_at" ON "public"."documents" USING "btree" ("created_at");



CREATE INDEX "idx_documents_deleted_at" ON "public"."documents" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_documents_file_type" ON "public"."documents" USING "btree" ("file_type");



CREATE INDEX "idx_documents_search_vector" ON "public"."documents" USING "gin" ("search_vector");



CREATE INDEX "idx_documents_tags" ON "public"."documents" USING "gin" ("tags");



CREATE INDEX "idx_documents_uploaded_by" ON "public"."documents" USING "btree" ("uploaded_by");



CREATE INDEX "idx_goals_deleted_at" ON "public"."goals" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_goals_profile_id" ON "public"."goals" USING "btree" ("profile_id");



CREATE INDEX "idx_permissions_action" ON "public"."permissions" USING "btree" ("action");



CREATE INDEX "idx_permissions_deleted_at" ON "public"."permissions" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_permissions_name" ON "public"."permissions" USING "btree" ("name");



CREATE INDEX "idx_permissions_resource" ON "public"."permissions" USING "btree" ("resource");



CREATE INDEX "idx_profile_user_id" ON "public"."profile" USING "btree" ("user_id");



CREATE INDEX "idx_role_permissions_deleted_at" ON "public"."role_permissions" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_role_permissions_permission_id" ON "public"."role_permissions" USING "btree" ("permission_id");



CREATE INDEX "idx_role_permissions_role_id" ON "public"."role_permissions" USING "btree" ("role_id");



CREATE INDEX "idx_roles_code" ON "public"."roles" USING "btree" ("code");



CREATE INDEX "idx_roles_deleted_at" ON "public"."roles" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_roles_level" ON "public"."roles" USING "btree" ("level");



CREATE INDEX "idx_roles_status" ON "public"."roles" USING "btree" ("status");



CREATE INDEX "idx_sale_items_sale_id" ON "public"."sale_items" USING "btree" ("sale_id");



CREATE INDEX "idx_sales_user_id" ON "public"."sales" USING "btree" ("user_id");



CREATE INDEX "idx_user_permissions_enhanced_deleted_at" ON "public"."user_permissions_enhanced" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_user_permissions_enhanced_expires_at" ON "public"."user_permissions_enhanced" USING "btree" ("expires_at") WHERE ("expires_at" IS NOT NULL);



CREATE INDEX "idx_user_permissions_enhanced_permission_id" ON "public"."user_permissions_enhanced" USING "btree" ("permission_id");



CREATE INDEX "idx_user_permissions_enhanced_status" ON "public"."user_permissions_enhanced" USING "btree" ("status");



CREATE INDEX "idx_user_permissions_enhanced_user_id" ON "public"."user_permissions_enhanced" USING "btree" ("user_id");



CREATE INDEX "idx_user_roles_deleted_at" ON "public"."user_roles" USING "btree" ("deleted_at") WHERE ("deleted_at" IS NULL);



CREATE INDEX "idx_user_roles_expires_at" ON "public"."user_roles" USING "btree" ("expires_at") WHERE ("expires_at" IS NOT NULL);



CREATE INDEX "idx_user_roles_role_id" ON "public"."user_roles" USING "btree" ("role_id");



CREATE INDEX "idx_user_roles_status" ON "public"."user_roles" USING "btree" ("status");



CREATE INDEX "idx_user_roles_user_id" ON "public"."user_roles" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "sale_premium_sumation" AFTER INSERT OR DELETE OR UPDATE ON "public"."sale_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_total_sale_value"();



CREATE OR REPLACE TRIGGER "trigger_update_documents_search_vector" BEFORE INSERT OR UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_documents_search_vector"();



CREATE OR REPLACE TRIGGER "trigger_update_goals_on_sale" AFTER INSERT ON "public"."sales" FOR EACH ROW EXECUTE FUNCTION "public"."update_goals_on_sale"();



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."goals"
    ADD CONSTRAINT "goals_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profile"
    ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sale_items"
    ADD CONSTRAINT "sale_items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."insurance_companies"("id");



ALTER TABLE ONLY "public"."sale_items"
    ADD CONSTRAINT "sale_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."insurance_products"("id");



ALTER TABLE ONLY "public"."sale_items"
    ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_hierarchy"
    ADD CONSTRAINT "user_hierarchy_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_hierarchy"
    ADD CONSTRAINT "user_hierarchy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_permissions_enhanced"
    ADD CONSTRAINT "user_permissions_enhanced_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_permissions_enhanced"
    ADD CONSTRAINT "user_permissions_enhanced_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_permissions_enhanced"
    ADD CONSTRAINT "user_permissions_enhanced_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "All active users can view active insurance products" ON "public"."insurance_products" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profile"."status" = 'active'::"public"."status") AND ("profile"."deleted_at" IS NULL)))) AND (("status" = 'active'::"public"."status") OR "public"."issuperadmin"())));



CREATE POLICY "All active users can view active roles" ON "public"."roles" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."user_id" = "auth"."uid"()) AND ("p"."status" = 'active'::"public"."status") AND ("p"."deleted_at" IS NULL)))) AND ("status" = 'active'::"public"."status")));



CREATE POLICY "All active users can view insurance companies" ON "public"."insurance_companies" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profile"."status" = 'active'::"public"."status") AND ("profile"."deleted_at" IS NULL)))));



CREATE POLICY "All active users can view permissions" ON "public"."permissions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."user_id" = "auth"."uid"()) AND ("p"."status" = 'active'::"public"."status") AND ("p"."deleted_at" IS NULL)))));



CREATE POLICY "All active users can view role permissions" ON "public"."role_permissions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profile" "p"
  WHERE (("p"."user_id" = "auth"."uid"()) AND ("p"."status" = 'active'::"public"."status") AND ("p"."deleted_at" IS NULL)))));



CREATE POLICY "Only SuperAdmin users can delete hierarchy relationships" ON "public"."user_hierarchy" FOR DELETE USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can delete insurance companies" ON "public"."insurance_companies" FOR DELETE USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can delete insurance products" ON "public"."insurance_products" FOR DELETE USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can delete sale items" ON "public"."sale_items" FOR DELETE USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can delete sales" ON "public"."sales" FOR DELETE USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can insert new hierarchy relationships" ON "public"."user_hierarchy" FOR INSERT WITH CHECK ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can insert new insurance companies" ON "public"."insurance_companies" FOR INSERT WITH CHECK ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can insert new insurance products" ON "public"."insurance_products" FOR INSERT WITH CHECK ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can insert new profiles" ON "public"."profile" FOR INSERT WITH CHECK ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can manage permissions" ON "public"."permissions" USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can manage role permissions" ON "public"."role_permissions" USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can manage roles" ON "public"."roles" USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can update hierarchy relationships" ON "public"."user_hierarchy" FOR UPDATE USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can update insurance companies" ON "public"."insurance_companies" FOR UPDATE USING ("public"."issuperadmin"());



CREATE POLICY "Only SuperAdmin users can update insurance products" ON "public"."insurance_products" FOR UPDATE USING ("public"."issuperadmin"());



CREATE POLICY "SuperAdmin and user leaders can manage user permissions" ON "public"."user_permissions_enhanced" USING (("public"."issuperadmin"() OR "public"."isuserleader"("user_id")));



CREATE POLICY "SuperAdmin and user leaders can manage user roles" ON "public"."user_roles" USING (("public"."issuperadmin"() OR "public"."isuserleader"("user_id")));



CREATE POLICY "Users can delete documents with permission" ON "public"."documents" FOR DELETE TO "authenticated" USING ((("deleted_at" IS NULL) AND ("public"."issuperadmin"() OR (("uploaded_by" = "auth"."uid"()) AND "public"."user_has_permission"("auth"."uid"(), 'documents:delete'::"text")) OR "public"."user_has_permission"("auth"."uid"(), 'documents:manage'::"text"))));



CREATE POLICY "Users can insert sale items for their own sales" ON "public"."sale_items" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."sales" "s"
  WHERE (("s"."id" = "sale_items"."sale_id") AND ("s"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "Users can only create sales for themselves" ON "public"."sales" FOR INSERT WITH CHECK ((("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."profile"
  WHERE (("profile"."user_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profile"."status" = 'active'::"public"."status") AND ("profile"."deleted_at" IS NULL))))));



CREATE POLICY "Users can only update their own profile, leaders can update sub" ON "public"."profile" FOR UPDATE USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR "public"."isuserleader"("user_id") OR "public"."issuperadmin"()));



CREATE POLICY "Users can update documents with permission" ON "public"."documents" FOR UPDATE TO "authenticated" USING ((("deleted_at" IS NULL) AND ("public"."issuperadmin"() OR (("uploaded_by" = "auth"."uid"()) AND "public"."user_has_permission"("auth"."uid"(), 'documents:update'::"text")) OR "public"."user_has_permission"("auth"."uid"(), 'documents:manage'::"text"))));



CREATE POLICY "Users can update sale items for their own sales, leaders for su" ON "public"."sale_items" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."sales" "s"
  WHERE (("s"."id" = "sale_items"."sale_id") AND (("s"."user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("public"."isuserleader"("s"."user_id") AND "public"."issuperadmin"()))))));



CREATE POLICY "Users can update their own sales, leaders can update subordinat" ON "public"."sales" FOR UPDATE USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("public"."isuserleader"("user_id") AND "public"."issuperadmin"())));



CREATE POLICY "Users can upload documents with permission" ON "public"."documents" FOR INSERT TO "authenticated" WITH CHECK ((("uploaded_by" = "auth"."uid"()) AND ("public"."user_has_permission"("auth"."uid"(), 'documents:create'::"text") OR "public"."issuperadmin"())));



CREATE POLICY "Users can view documents based on permissions" ON "public"."documents" FOR SELECT TO "authenticated" USING ((("deleted_at" IS NULL) AND ("public"."user_has_permission"("auth"."uid"(), 'documents:read'::"text") OR ("uploaded_by" = "auth"."uid"()) OR "public"."issuperadmin"())));



CREATE POLICY "Users can view hierarchy information for themselves and their n" ON "public"."user_hierarchy" FOR SELECT USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("leader_id" = ( SELECT "auth"."uid"() AS "uid")) OR "public"."isuserleader"("user_id") OR "public"."issuperadmin"()));



CREATE POLICY "Users can view sale items for sales they have access to" ON "public"."sale_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."sales" "s"
  WHERE (("s"."id" = "sale_items"."sale_id") AND (("s"."user_id" = ( SELECT "auth"."uid"() AS "uid")) OR "public"."isuserleader"("s"."user_id") OR "public"."issuperadmin"())))));



CREATE POLICY "Users can view their own permissions and leaders can view subor" ON "public"."user_permissions_enhanced" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR "public"."issuperadmin"() OR "public"."isuserleader"("user_id")));



CREATE POLICY "Users can view their own profile and profiles of their subordin" ON "public"."profile" FOR SELECT USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR "public"."isuserleader"("user_id") OR "public"."issuperadmin"()));



CREATE POLICY "Users can view their own roles and leaders can view subordinate" ON "public"."user_roles" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR "public"."issuperadmin"() OR "public"."isuserleader"("user_id")));



CREATE POLICY "Users can view their own sales and sales of their subordinates" ON "public"."sales" FOR SELECT USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR "public"."isuserleader"("user_id") OR "public"."issuperadmin"()));



ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."insurance_companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."insurance_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sale_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_hierarchy" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_permissions_enhanced" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."profile";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."sales";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."add_resource_permissions"("resource_name" "text", "actions" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."add_resource_permissions"("resource_name" "text", "actions" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_resource_permissions"("resource_name" "text", "actions" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."can_manage_document"("document_id" "uuid", "required_permission" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."can_manage_document"("document_id" "uuid", "required_permission" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_manage_document"("document_id" "uuid", "required_permission" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."can_manage_user"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."can_manage_user"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_manage_user"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."check_and_reset_goals"() TO "anon";
GRANT ALL ON FUNCTION "public"."check_and_reset_goals"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_and_reset_goals"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_manageable_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_manageable_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_manageable_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_accessible_documents"("p_category" "public"."document_category", "p_search" "text", "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_accessible_documents"("p_category" "public"."document_category", "p_search" "text", "p_limit" integer, "p_offset" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_accessible_documents"("p_category" "public"."document_category", "p_search" "text", "p_limit" integer, "p_offset" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_permissions"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_permissions"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_permissions"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."issuperadmin"() TO "anon";
GRANT ALL ON FUNCTION "public"."issuperadmin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."issuperadmin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."isuserleader"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."isuserleader"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."isuserleader"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."reset_recurring_goals"() TO "anon";
GRANT ALL ON FUNCTION "public"."reset_recurring_goals"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_recurring_goals"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_documents_search_vector"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_documents_search_vector"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_documents_search_vector"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_goals_on_sale"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_goals_on_sale"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_goals_on_sale"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_total_sale_value"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_total_sale_value"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_total_sale_value"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "permission_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "resource_name" "text", "action_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "resource_name" "text", "action_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_permission"("user_uuid" "uuid", "resource_name" "text", "action_name" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."goals" TO "anon";
GRANT ALL ON TABLE "public"."goals" TO "authenticated";
GRANT ALL ON TABLE "public"."goals" TO "service_role";



GRANT ALL ON TABLE "public"."insurance_companies" TO "anon";
GRANT ALL ON TABLE "public"."insurance_companies" TO "authenticated";
GRANT ALL ON TABLE "public"."insurance_companies" TO "service_role";




GRANT ALL ON TABLE "public"."insurance_products" TO "anon";
GRANT ALL ON TABLE "public"."insurance_products" TO "authenticated";
GRANT ALL ON TABLE "public"."insurance_products" TO "service_role";




GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON TABLE "public"."profile" TO "anon";
GRANT ALL ON TABLE "public"."profile" TO "authenticated";
GRANT ALL ON TABLE "public"."profile" TO "service_role";




GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."sale_items" TO "anon";
GRANT ALL ON TABLE "public"."sale_items" TO "authenticated";
GRANT ALL ON TABLE "public"."sale_items" TO "service_role";




GRANT ALL ON TABLE "public"."sales" TO "anon";
GRANT ALL ON TABLE "public"."sales" TO "authenticated";
GRANT ALL ON TABLE "public"."sales" TO "service_role";




GRANT ALL ON TABLE "public"."user_hierarchy" TO "anon";
GRANT ALL ON TABLE "public"."user_hierarchy" TO "authenticated";
GRANT ALL ON TABLE "public"."user_hierarchy" TO "service_role";




GRANT ALL ON TABLE "public"."user_permissions_enhanced" TO "anon";
GRANT ALL ON TABLE "public"."user_permissions_enhanced" TO "authenticated";
GRANT ALL ON TABLE "public"."user_permissions_enhanced" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
