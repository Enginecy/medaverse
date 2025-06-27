-- Migration: Create RBAC System (Updated with TEXT fields and isuserleader() function)
-- Run this script against your database

BEGIN;

-- ====================================================================
-- 1. CREATE ENUMS (if not already existing)
-- ====================================================================

-- These might already exist in your schema, so we'll create only if they don't exist
DO $$ BEGIN
    CREATE TYPE status AS ENUM ('active', 'disabled', 'delete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ====================================================================
-- 2. CREATE CORE RBAC TABLES
-- ====================================================================

-- Permissions table with computed name column and resource:action structure
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    -- Computed column that automatically generates name from resource:action
    name TEXT GENERATED ALWAYS AS (resource || ':' || action) STORED,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT permissions_name_key UNIQUE (name),
    CONSTRAINT permissions_resource_action_key UNIQUE (resource, action),
    -- Ensure resource and action don't contain colons to avoid conflicts
    CONSTRAINT permissions_resource_no_colon CHECK (resource !~ ':'),
    CONSTRAINT permissions_action_no_colon CHECK (action !~ ':')
);

-- Roles table (replacing the hardcoded title enum)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL,
    is_system_role BOOLEAN DEFAULT false,
    status status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT roles_name_key UNIQUE (name),
    CONSTRAINT roles_code_key UNIQUE (code)
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT role_permissions_role_permission_key UNIQUE (role_id, permission_id)
);

-- User roles junction table  
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    status status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT user_roles_user_role_key UNIQUE (user_id, role_id)
);

-- Enhanced user permissions table
CREATE TABLE IF NOT EXISTS user_permissions_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON UPDATE CASCADE ON DELETE CASCADE,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    status status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT user_permissions_enhanced_user_permission_key UNIQUE (user_id, permission_id)
);

-- ====================================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ====================================================================

-- Permissions indexes
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions USING btree (resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions USING btree (action);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions USING btree (name);
CREATE INDEX IF NOT EXISTS idx_permissions_deleted_at ON permissions USING btree (deleted_at) WHERE deleted_at IS NULL;

-- Roles indexes
CREATE INDEX IF NOT EXISTS idx_roles_level ON roles USING btree (level);
CREATE INDEX IF NOT EXISTS idx_roles_status ON roles USING btree (status);
CREATE INDEX IF NOT EXISTS idx_roles_code ON roles USING btree (code);
CREATE INDEX IF NOT EXISTS idx_roles_deleted_at ON roles USING btree (deleted_at) WHERE deleted_at IS NULL;

-- Role permissions indexes
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions USING btree (role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions USING btree (permission_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_deleted_at ON role_permissions USING btree (deleted_at) WHERE deleted_at IS NULL;

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles USING btree (role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_status ON user_roles USING btree (status);
CREATE INDEX IF NOT EXISTS idx_user_roles_expires_at ON user_roles USING btree (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_roles_deleted_at ON user_roles USING btree (deleted_at) WHERE deleted_at IS NULL;

-- User permissions enhanced indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_enhanced_user_id ON user_permissions_enhanced USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_enhanced_permission_id ON user_permissions_enhanced USING btree (permission_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_enhanced_status ON user_permissions_enhanced USING btree (status);
CREATE INDEX IF NOT EXISTS idx_user_permissions_enhanced_expires_at ON user_permissions_enhanced USING btree (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_permissions_enhanced_deleted_at ON user_permissions_enhanced USING btree (deleted_at) WHERE deleted_at IS NULL;

-- ====================================================================
-- 4. CREATE RLS POLICIES (Using issuperadmin() and isuserleader() functions)
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions_enhanced ENABLE ROW LEVEL SECURITY;

-- Permissions policies
CREATE POLICY "Only SuperAdmin users can manage permissions" ON permissions
    FOR ALL USING (issuperadmin());

CREATE POLICY "All active users can view permissions" ON permissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profile p
            WHERE p.user_id = auth.uid() 
            AND p.status = 'active'
            AND p.deleted_at IS NULL
        )
    );

-- Roles policies
CREATE POLICY "Only SuperAdmin users can manage roles" ON roles
    FOR ALL USING (issuperadmin());

CREATE POLICY "All active users can view active roles" ON roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profile p
            WHERE p.user_id = auth.uid() 
            AND p.status = 'active'
            AND p.deleted_at IS NULL
        ) AND status = 'active'
    );

-- Role permissions policies
CREATE POLICY "Only SuperAdmin users can manage role permissions" ON role_permissions
    FOR ALL USING (issuperadmin());

CREATE POLICY "All active users can view role permissions" ON role_permissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profile p
            WHERE p.user_id = auth.uid() 
            AND p.status = 'active'
            AND p.deleted_at IS NULL
        )
    );

-- User roles policies
CREATE POLICY "SuperAdmin and user leaders can manage user roles" ON user_roles
    FOR ALL USING (
        issuperadmin() OR 
        isuserleader(user_id)
    );

CREATE POLICY "Users can view their own roles and leaders can view subordinate roles" ON user_roles
    FOR SELECT USING (
        user_id = auth.uid() OR
        issuperadmin() OR
        isuserleader(user_id)
    );

-- User permissions enhanced policies
CREATE POLICY "SuperAdmin and user leaders can manage user permissions" ON user_permissions_enhanced
    FOR ALL USING (
        issuperadmin() OR 
        isuserleader(user_id)
    );

CREATE POLICY "Users can view their own permissions and leaders can view subordinate permissions" ON user_permissions_enhanced
    FOR SELECT USING (
        user_id = auth.uid() OR
        issuperadmin() OR
        isuserleader(user_id)
    );

-- ====================================================================
-- 5. SEED DATA - BASIC PERMISSIONS (Using resource and action)
-- ====================================================================

-- Insert basic permissions (name will be auto-computed)
INSERT INTO permissions (resource, action, description) VALUES
-- User management permissions
('users', 'read', 'View user information'),
('users', 'create', 'Create new users'),
('users', 'update', 'Update user information'),
('users', 'delete', 'Delete users'),
('users', 'manage', 'Full user management access'),

-- Sales permissions
('sales', 'read', 'View sales data'),
('sales', 'create', 'Create new sales'),
('sales', 'update', 'Update sales records'),
('sales', 'delete', 'Delete sales records'),
('sales', 'manage', 'Full sales management access'),


-- Company permissions
('companies', 'read', 'View insurance companies'),
('companies', 'create', 'Create insurance companies'),
('companies', 'update', 'Update insurance companies'),
('companies', 'delete', 'Delete insurance companies'),
('companies', 'manage', 'Full company management access'),

-- Product permissions
('products', 'read', 'View insurance products'),
('products', 'create', 'Create insurance products'),
('products', 'update', 'Update insurance products'),
('products', 'delete', 'Delete insurance products'),
('products', 'manage', 'Full product management access'),

-- Role and permission management
('roles', 'read', 'View roles'),
('roles', 'create', 'Create roles'),
('roles', 'update', 'Update roles'),
('roles', 'delete', 'Delete roles'),
('roles', 'manage', 'Full role management access'),
('permissions', 'read', 'View permissions'),
('permissions', 'create', 'Create permissions'),
('permissions', 'update', 'Update permissions'),
('permissions', 'delete', 'Delete permissions'),
('permissions', 'manage', 'Full permission management access'),

-- User hierarchy permissions
('hierarchy', 'read', 'View user hierarchy'),
('hierarchy', 'create', 'Create hierarchy relationships'),
('hierarchy', 'update', 'Update hierarchy relationships'),
('hierarchy', 'delete', 'Delete hierarchy relationships'),
('hierarchy', 'manage', 'Full hierarchy management access'),

-- User permission management
('user_permissions', 'read', 'View user permissions'),
('user_permissions', 'create', 'Grant permissions to users'),
('user_permissions', 'update', 'Update user permissions'),
('user_permissions', 'delete', 'Revoke user permissions'),
('user_permissions', 'manage', 'Full user permission management access'),

-- User role management
('user_roles', 'read', 'View user roles'),
('user_roles', 'create', 'Assign roles to users'),
('user_roles', 'update', 'Update user role assignments'),
('user_roles', 'delete', 'Remove user role assignments'),
('user_roles', 'manage', 'Full user role management access')

ON CONFLICT (resource, action) DO NOTHING;

-- ====================================================================
-- 6. SEED DATA - BASIC ROLES
-- ====================================================================

-- Insert basic roles
INSERT INTO roles (name, code, description, level, is_system_role) VALUES
('Super Administrator', 'super_admin', 'Full system access', 'executive', true),
('National Director', 'national_director', 'National level management', 'executive', true),
('Regional Director', 'regional_director', 'Regional level management', 'management', true),
('Divisional Director', 'divisional_director', 'Divisional level management', 'management', true),
('Associate Director', 'associate_director', 'Associate level management', 'management', true),
('Platinum Associate', 'platinum_associate', 'Senior sales role', 'staff', true),
('Senior Associate', 'senior_associate', 'Experienced sales role', 'staff', true),
('Associate', 'associate', 'Standard sales role', 'staff', true),
('Lead', 'lead', 'Entry level sales role', 'staff', true)

ON CONFLICT (code) DO NOTHING;

-- ====================================================================
-- 7. SEED DATA - ROLE PERMISSIONS
-- ====================================================================

-- Super Administrator gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- National Director permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'national_director'
AND p.name IN (
    'users:read', 'users:update',
    'sales:read', 'sales:update', 'sales:create',
    'companies:read', 'products:read',
    'hierarchy:read',
    'user_permissions:read', 'user_permissions:create', 'user_permissions:update', 'user_permissions:delete',
    'user_roles:read', 'user_roles:create', 'user_roles:update', 'user_roles:delete'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Regional Director permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'regional_director'
AND p.name IN (
    'users:read',
    'sales:read', 'sales:update', 'sales:create',
    'companies:read', 'products:read',
    'hierarchy:read',
    'user_permissions:read', 'user_permissions:create', 'user_permissions:update',
    'user_roles:read', 'user_roles:create', 'user_roles:update'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Divisional Director permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'divisional_director'
AND p.name IN (
    'users:read',
    'sales:read', 'sales:update', 'sales:create',
    'companies:read', 'products:read',
    'hierarchy:read',
    'user_permissions:read', 'user_roles:read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Associate Director permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'associate_director'
AND p.name IN (
    'sales:read', 'sales:create', 'sales:update',
    'companies:read', 'products:read',
    'user_permissions:read', 'user_roles:read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Sales Associate roles permissions (all basic sales associates)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code IN ('associate', 'senior_associate', 'platinum_associate', 'lead')
AND p.name IN (
    'sales:read', 'sales:create',
    'companies:read', 'products:read'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ====================================================================
-- 8. CREATE HELPER FUNCTIONS (Updated to use computed name column)
-- ====================================================================

-- Function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Overloaded function to check permission by resource and action
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, resource_name TEXT, action_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN user_has_permission(user_uuid, resource_name || ':' || action_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all permissions for a user
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS TABLE(permission_name TEXT, resource TEXT, action TEXT, source_type TEXT, source_name TEXT, expires_at TIMESTAMP WITH TIME ZONE) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to easily add new permissions for a resource
CREATE OR REPLACE FUNCTION add_resource_permissions(resource_name TEXT, actions TEXT[])
RETURNS INT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user can manage a specific user (useful for UI)
CREATE OR REPLACE FUNCTION can_manage_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN issuperadmin() OR isuserleader(target_user_id) OR target_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get users that the current user can manage
CREATE OR REPLACE FUNCTION get_manageable_users()
RETURNS TABLE(user_id UUID, username TEXT, name TEXT, role_names TEXT) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;