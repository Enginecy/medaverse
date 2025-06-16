-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION getCurrentUserProfile()
RETURNS TABLE(user_id UUID, role public.title, status public.status)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT p.user_id, p.role, p.status 
  FROM public.profile p 
  WHERE p.user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION isUserLeader(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    WITH RECURSIVE hierarchy_chain AS (
      -- Base case: direct reports
      SELECT user_id, leader_id, 1 as level
      FROM public.user_hierarchy 
      WHERE leader_id = auth.uid() 
        AND status = 'active'
        AND deleted_at IS NULL
      
      UNION ALL
      
      -- Recursive case: reports of reports
      SELECT uh.user_id, uh.leader_id, hc.level + 1
      FROM public.user_hierarchy uh
      INNER JOIN hierarchy_chain hc ON uh.leader_id = hc.user_id
      WHERE uh.status = 'active' 
        AND uh.deleted_at IS NULL
        AND hc.level < 10 -- Prevent infinite recursion
    )
    SELECT 1 FROM hierarchy_chain WHERE user_id = target_user_id
  );
$$;

CREATE OR REPLACE FUNCTION isSuperAdmin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profile 
    WHERE user_id = auth.uid() 
      AND role IN ('SuperAdmin')
      AND status = 'active'
      AND deleted_at IS NULL
  );
$$;

-- =============================================
-- PROFILE TABLE POLICIES
-- =============================================

CREATE POLICY "Users can view their own profile and profiles of their subordinates" ON public.profile
FOR SELECT USING (
  user_id = auth.uid() OR 
  isUserLeader(user_id) OR
  isSuperAdmin()
);


CREATE POLICY "Users can only update their own profile, leaders can update subordinates' profiles" ON public.profile
FOR UPDATE USING (
  user_id = auth.uid() OR 
  isUserLeader(user_id) OR
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can insert new profiles" ON public.profile
FOR INSERT WITH CHECK (
  isSuperAdmin()
);

-- =============================================
-- INSURANCE COMPANIES POLICIES
-- =============================================

CREATE POLICY "All active users can view insurance companies" ON public.insurance_companies
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profile 
    WHERE user_id = auth.uid() 
      AND status = 'active' 
      AND deleted_at IS NULL
  )
);

CREATE POLICY "Only SuperAdmin users can insert new insurance companies" ON public.insurance_companies
FOR INSERT WITH CHECK (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can update insurance companies" ON public.insurance_companies
FOR UPDATE USING (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can delete insurance companies" ON public.insurance_companies
FOR DELETE USING (
  isSuperAdmin()
);

-- =============================================
-- INSURANCE PRODUCTS POLICIES
-- =============================================

CREATE POLICY "All active users can view active insurance products" ON public.insurance_products
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profile 
    WHERE user_id = auth.uid() 
      AND status = 'active' 
      AND deleted_at IS NULL
  ) AND (
    status = 'active' OR isSuperAdmin()
  )
);

CREATE POLICY "Only SuperAdmin users can insert new insurance products" ON public.insurance_products
FOR INSERT WITH CHECK (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can update insurance products" ON public.insurance_products
FOR UPDATE USING (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can delete insurance products" ON public.insurance_products
FOR DELETE USING (
  isSuperAdmin()
);

-- =============================================
-- SALES POLICIES
-- =============================================

CREATE POLICY "Users can view their own sales and sales of their subordinates" ON public.sales
FOR SELECT USING (
  user_id = auth.uid() OR 
  isUserLeader(user_id) OR
  isSuperAdmin()
);

CREATE POLICY "Users can only create sales for themselves" ON public.sales
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.profile 
    WHERE user_id = auth.uid() 
      AND status = 'active' 
      AND deleted_at IS NULL
  )
);

CREATE POLICY "Users can update their own sales, leaders can update subordinates' sales" ON public.sales
FOR UPDATE USING (
  user_id = auth.uid() OR 
  (isUserLeader(user_id) AND isSuperAdmin())
);

-- Only high-level users can delete sales
CREATE POLICY "Only SuperAdmin users can delete sales" ON public.sales
FOR DELETE USING (
  isSuperAdmin()
);

-- =============================================
-- SALE ITEMS POLICIES
-- =============================================

CREATE POLICY "Users can view sale items for sales they have access to" ON public.sale_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.sales s
    WHERE s.id = sale_id AND (
      s.user_id = auth.uid() OR 
      isUserLeader(s.user_id) OR
      isSuperAdmin()
    )
  )
);

-- Users can insert sale items for their own sales
CREATE POLICY "Users can insert sale items for their own sales" ON public.sale_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sales s
    WHERE s.id = sale_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update sale items for their own sales, leaders for subordinates" ON public.sale_items
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.sales s
    WHERE s.id = sale_id AND (
      s.user_id = auth.uid() OR 
      (isUserLeader(s.user_id) AND isSuperAdmin())
    )
  )
);

CREATE POLICY "Only SuperAdmin users can delete sale items" ON public.sale_items
FOR DELETE USING (
  isSuperAdmin()
);

-- =============================================
-- USER HIERARCHY POLICIES
-- =============================================

CREATE POLICY "Users can view hierarchy information for themselves and their network" ON public.user_hierarchy
FOR SELECT USING (
  user_id = auth.uid() OR 
  leader_id = auth.uid() OR
  isUserLeader(user_id) OR
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can insert new hierarchy relationships" ON public.user_hierarchy
FOR INSERT WITH CHECK (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can update hierarchy relationships" ON public.user_hierarchy
FOR UPDATE USING (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can delete hierarchy relationships" ON public.user_hierarchy
FOR DELETE USING (
  isSuperAdmin()
);

-- =============================================
-- USER PERMISSIONS POLICIES
-- =============================================

CREATE POLICY "Users can view their own permissions, leaders can view subordinates' permissions" ON public.user_permissions
FOR SELECT USING (
  user_id = auth.uid() OR 
  isUserLeader(user_id) OR
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can insert new permissions" ON public.user_permissions
FOR INSERT WITH CHECK (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can update permissions" ON public.user_permissions
FOR UPDATE USING (
  isSuperAdmin()
);

CREATE POLICY "Only SuperAdmin users can delete permissions" ON public.user_permissions
FOR DELETE USING (
  isSuperAdmin()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Indexes to support RLS policy performance
CREATE INDEX IF NOT EXISTS idx_profile_user_id ON public.profile(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_role_status ON public.profile(role, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_hierarchy_leader_id ON public.user_hierarchy(leader_id) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_hierarchy_user_id ON public.user_hierarchy(user_id) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON public.sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON public.sale_items(sale_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Allow users to read auth.users table if they are authenticated
CREATE POLICY "Users can read auth.users table" ON auth.users FOR SELECT USING (auth.uid() = id OR isSuperAdmin());

-- Allow users to upload their own images or SuperAdmins to upload any images
CREATE POLICY "Users can upload their own profile images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR isSuperAdmin()));

-- Allow users to view their own images or SuperAdmins to view any images
CREATE POLICY "Users can view their own profile images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-images' AND (auth.uid()::text = (storage.foldername(name))[1] OR isSuperAdmin()));

-- Allow public read access
CREATE POLICY "Profile images are publicly viewable" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-images');