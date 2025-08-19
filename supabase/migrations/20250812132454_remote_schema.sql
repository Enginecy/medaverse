drop extension if exists "pg_net";

alter table "public"."goals" drop constraint "goals_goal_type_check";

alter table "public"."insurance_products" alter column "id" set default gen_random_uuid();

alter table "public"."profile" drop column "address";

alter table "public"."profile" drop column "regional";

alter table "public"."profile" drop column "upline";

alter table "public"."profile" add column "office" text not null;

alter table "public"."goals" add constraint "goals_goal_type_check" CHECK (((goal_type)::text = ANY ((ARRAY['sales'::character varying, 'revenue'::character varying])::text[]))) not valid;

alter table "public"."goals" validate constraint "goals_goal_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_users_bulk_optimized(user_data jsonb[])
 RETURNS uuid[]
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_ids uuid[] := '{}';
  users_to_insert jsonb[] := '{}';
  identities_to_insert jsonb[] := '{}';
  user_record jsonb;
  user_id uuid;
  encrypted_pw text;
  email_val text;
  password_val text;
  meta_data jsonb;
BEGIN
  -- Prepare data for batch insert
  FOREACH user_record IN ARRAY user_data
  LOOP
    email_val := user_record->>'email';
    password_val := user_record->>'password';
    meta_data := COALESCE(user_record->'user_meta_data', '{}'::jsonb);
    
    IF email_val IS NULL OR password_val IS NULL THEN
      RAISE EXCEPTION 'Email and password are required for each user';
    END IF;
    
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password_val, gen_salt('bf'));
    user_ids := array_append(user_ids, user_id);
    
    -- Prepare user data
    users_to_insert := array_append(users_to_insert, jsonb_build_object(
      'id', user_id,
      'email', email_val,
      'encrypted_password', encrypted_pw,
      'raw_user_meta_data', meta_data
    ));
    
    -- Prepare identity data
    identities_to_insert := array_append(identities_to_insert, jsonb_build_object(
      'id', gen_random_uuid(),
      'user_id', user_id,
      'email', email_val
    ));
  END LOOP;
  
  -- Batch insert users
  INSERT INTO auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  SELECT 
    '00000000-0000-0000-0000-000000000000',
    (u->>'id')::uuid,
    'authenticated',
    'authenticated',
    u->>'email',
    u->>'encrypted_password',
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    u->'raw_user_meta_data',
    now(),
    now(),
    '',
    '',
    '',
    ''
  FROM unnest(users_to_insert) AS u;
  
  -- Batch insert identities
  INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  SELECT 
    (i->>'id')::uuid,
    (i->>'user_id')::text,
    (i->>'user_id')::uuid,
    format('{"sub":"%s","email":"%s"}', i->>'user_id', i->>'email')::jsonb,
    'email',
    now(),
    now(),
    now()
  FROM unnest(identities_to_insert) AS i;
  
  RETURN user_ids;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_resource_permissions(resource_name text, actions text[])
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.can_manage_document(document_id uuid, required_permission text DEFAULT 'documents:update'::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.can_manage_user(target_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN issuperadmin() OR isuserleader(target_user_id) OR target_user_id = auth.uid();
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_and_reset_goals()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    PERFORM reset_recurring_goals();
    RETURN 'Goals reset check completed at ' || NOW()::TEXT;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_manageable_users()
 RETURNS TABLE(user_id uuid, username text, name text, role_names text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_accessible_documents(p_category document_category DEFAULT NULL::document_category, p_search text DEFAULT NULL::text, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, file_name character varying, original_file_name character varying, file_type file_type, file_size bigint, file_path text, category document_category, title character varying, uploaded_by jsonb, created_at timestamp with time zone, updated_at timestamp with time zone, can_update boolean, can_delete boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid uuid)
 RETURNS TABLE(permission_name text, resource text, action text, source_type text, source_name text, expires_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.issuperadmin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$SELECT EXISTS (
    SELECT 1 FROM public.profile 
    WHERE user_id = (select auth.uid()) 
      AND role IN ('SuperAdmin')
      AND status = 'active'
      AND deleted_at IS NULL
  );$function$
;

CREATE OR REPLACE FUNCTION public.isuserleader(target_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$SELECT EXISTS (
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
  );$function$
;

CREATE OR REPLACE FUNCTION public.reset_recurring_goals()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_documents_search_vector()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        coalesce(NEW.title, '') || ' ' || 
        coalesce(NEW.original_file_name, '') || ' ' || 
        coalesce(NEW.description, '') || ' ' ||
        array_to_string(NEW.tags, ' ')
    );
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_goals_on_sale()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_total_sale_value()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.user_has_permission(user_uuid uuid, permission_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.user_has_permission(user_uuid uuid, resource_name text, action_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN user_has_permission(user_uuid, resource_name || ':' || action_name);
END;
$function$
;

grant delete on table "public"."insurance_companies" to "rls_user";

grant insert on table "public"."insurance_companies" to "rls_user";

grant references on table "public"."insurance_companies" to "rls_user";

grant select on table "public"."insurance_companies" to "rls_user";

grant trigger on table "public"."insurance_companies" to "rls_user";

grant truncate on table "public"."insurance_companies" to "rls_user";

grant update on table "public"."insurance_companies" to "rls_user";

grant delete on table "public"."insurance_products" to "rls_user";

grant insert on table "public"."insurance_products" to "rls_user";

grant references on table "public"."insurance_products" to "rls_user";

grant select on table "public"."insurance_products" to "rls_user";

grant trigger on table "public"."insurance_products" to "rls_user";

grant truncate on table "public"."insurance_products" to "rls_user";

grant update on table "public"."insurance_products" to "rls_user";

grant delete on table "public"."profile" to "rls_user";

grant insert on table "public"."profile" to "rls_user";

grant references on table "public"."profile" to "rls_user";

grant select on table "public"."profile" to "rls_user";

grant trigger on table "public"."profile" to "rls_user";

grant truncate on table "public"."profile" to "rls_user";

grant update on table "public"."profile" to "rls_user";

grant delete on table "public"."sale_items" to "rls_user";

grant insert on table "public"."sale_items" to "rls_user";

grant references on table "public"."sale_items" to "rls_user";

grant select on table "public"."sale_items" to "rls_user";

grant trigger on table "public"."sale_items" to "rls_user";

grant truncate on table "public"."sale_items" to "rls_user";

grant update on table "public"."sale_items" to "rls_user";

grant delete on table "public"."sales" to "rls_user";

grant insert on table "public"."sales" to "rls_user";

grant references on table "public"."sales" to "rls_user";

grant select on table "public"."sales" to "rls_user";

grant trigger on table "public"."sales" to "rls_user";

grant truncate on table "public"."sales" to "rls_user";

grant update on table "public"."sales" to "rls_user";

grant delete on table "public"."user_hierarchy" to "rls_user";

grant insert on table "public"."user_hierarchy" to "rls_user";

grant references on table "public"."user_hierarchy" to "rls_user";

grant select on table "public"."user_hierarchy" to "rls_user";

grant trigger on table "public"."user_hierarchy" to "rls_user";

grant truncate on table "public"."user_hierarchy" to "rls_user";

grant update on table "public"."user_hierarchy" to "rls_user";


