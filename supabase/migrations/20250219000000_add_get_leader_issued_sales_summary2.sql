-- Issued business version of get_leader_sales_summary2
-- Aggregates only sale_items where is_issued = true
CREATE OR REPLACE FUNCTION public.get_leader_issued_sales_summary2(filter_type text DEFAULT 'alltime'::text, custom_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone, custom_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone, filter_role_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(leader_id uuid, leader_name character varying, avatar_url text, total_sales_count bigint, total_sales_amount numeric, full_total_sales numeric, full_total_sales_count bigint, subordinates jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
  start_date TIMESTAMPTZ;
  end_date TIMESTAMPTZ;
BEGIN
  IF custom_start_date IS NOT NULL AND custom_end_date IS NOT NULL THEN
    start_date := custom_start_date;
    end_date := custom_end_date;
  ELSIF filter_type = 'week' THEN
    start_date := DATE_TRUNC('week', NOW()) - INTERVAL '2 days';
    end_date := NOW();
  ELSIF filter_type = 'month' THEN
    start_date := DATE_TRUNC('month', NOW());
    end_date := NOW();
  ELSE
    start_date := NULL;
    end_date := NULL;
  END IF;

  RETURN QUERY
  WITH
  all_relationships AS (
    SELECT leader_id1 AS leader_id, user_id AS subordinate_id FROM public.user_leadership_chain WHERE leader_id1 IS NOT NULL
    UNION ALL
    SELECT leader_id2, user_id FROM public.user_leadership_chain WHERE leader_id2 IS NOT NULL
    UNION ALL
    SELECT leader_id3, user_id FROM public.user_leadership_chain WHERE leader_id3 IS NOT NULL
    UNION ALL
    SELECT leader_id4, user_id FROM public.user_leadership_chain WHERE leader_id4 IS NOT NULL
    UNION ALL
    SELECT leader_id5, user_id FROM public.user_leadership_chain WHERE leader_id5 IS NOT NULL
    UNION ALL
    SELECT leader_id6, user_id FROM public.user_leadership_chain WHERE leader_id6 IS NOT NULL
    UNION ALL
    SELECT leader_id7, user_id FROM public.user_leadership_chain WHERE leader_id7 IS NOT NULL
  ),
  subordinate_sales AS (
    SELECT
      ar.leader_id,
      ar.subordinate_id,
      p.name AS subordinate_name,
      r.name as subordinate_role,
      p.avatar_url AS subordinate_avatar_url,
      COUNT(DISTINCT s.id) AS sales_count,
      COALESCE(SUM(si.premium_amount), 0) AS sales_amount
    FROM all_relationships ar
    LEFT JOIN public.profile p ON ar.subordinate_id = p.user_id AND p.deleted_at IS NULL
    INNER JOIN public.user_roles ur ON p.user_id = ur.user_id
    INNER JOIN public.roles r ON r.id = ur.role_id
    INNER JOIN public.sales s ON ar.subordinate_id = s.user_id
      AND (start_date IS NULL OR s.created_at >= start_date)
      AND (end_date IS NULL OR s.created_at <= end_date)
      AND s.deleted_at IS NULL
    INNER JOIN public.sale_items si ON s.id = si.sale_id
      AND si.is_issued = true
      AND si.deleted_at IS NULL
    WHERE p.deleted_at IS NULL
    GROUP BY ar.leader_id, ar.subordinate_id, p.name, p.avatar_url, r.name
    HAVING COUNT(DISTINCT s.id) > 0
    ORDER BY sales_amount DESC
  ),
  leader_own_sales AS (
    SELECT
      u.id AS leader_id,
      p.name AS leader_name,
      p.avatar_url as avatar_url,
      COUNT(DISTINCT CASE WHEN si.id IS NOT NULL THEN s.id END)::BIGINT AS own_sales_count,
      COALESCE(SUM(si.premium_amount), 0) AS own_sales_amount
    FROM auth.users u
    LEFT JOIN public.profile p ON u.id = p.user_id AND p.deleted_at IS NULL
    LEFT JOIN public.user_roles ur ON u.id = ur.user_id
    LEFT JOIN public.sales s ON u.id = s.user_id
      AND (start_date IS NULL OR s.created_at >= start_date)
      AND (end_date IS NULL OR s.created_at <= end_date)
      AND s.deleted_at IS NULL
    LEFT JOIN public.sale_items si ON s.id = si.sale_id
      AND si.is_issued = true
      AND si.deleted_at IS NULL
    WHERE (filter_role_id IS NULL OR ur.role_id = filter_role_id)
    GROUP BY u.id, p.name, p.avatar_url
  ),
  subordinate_aggregates AS (
    SELECT
      ss.leader_id,
      SUM(ss.sales_count)::BIGINT AS total_sub_sales_count,
      SUM(ss.sales_amount) AS total_sub_sales_amount,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', ss.subordinate_id,
          'name', ss.subordinate_name,
          'role', ss.subordinate_role,
          'avatar_url', ss.subordinate_avatar_url,
          'total_sales_count', ss.sales_count,
          'total_sales_amount', ss.sales_amount
        )
      ) AS subordinates_array
    FROM subordinate_sales ss
    GROUP BY ss.leader_id
  )
  SELECT
    los.leader_id,
    los.leader_name,
    los.avatar_url,
    COALESCE(los.own_sales_count, 0)::BIGINT AS total_sales_count,
    COALESCE(los.own_sales_amount, 0) AS total_sales_amount,
    (COALESCE(los.own_sales_amount, 0) + COALESCE(sa.total_sub_sales_amount, 0)) AS full_total_sales,
    (COALESCE(los.own_sales_count, 0) + COALESCE(sa.total_sub_sales_count, 0))::BIGINT AS full_total_sales_count,
    COALESCE(sa.subordinates_array, '[]'::JSONB) AS subordinates
  FROM leader_own_sales los
  LEFT JOIN subordinate_aggregates sa ON los.leader_id = sa.leader_id
  WHERE EXISTS (
    SELECT 1 FROM all_relationships ar WHERE ar.leader_id = los.leader_id
  ) AND (COALESCE(los.own_sales_amount, 0) + COALESCE(sa.total_sub_sales_amount, 0)) > 0
  ORDER BY full_total_sales DESC;

END;
$function$;
