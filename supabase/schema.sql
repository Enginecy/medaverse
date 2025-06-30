-- Custom types
CREATE TYPE public.status AS ENUM ('active', 'disabled', 'delete');
COMMENT ON TYPE public.status IS 'User account status types';

CREATE TYPE public.title AS ENUM ('SuperAdmin','NationalDirector', 'RegionalDirector', 'DivisionalDirector', 'AssociateDirector', 'PlatinumAssociate', 'SeniorAssociate', 'Associate', 'Leads');
COMMENT ON TYPE public.title IS 'User role/position in the organization hierarchy';

CREATE TYPE public.premium_frequency AS ENUM ('monthly', 'quarterly', 'annually');
COMMENT ON TYPE public.premium_frequency IS 'How often premiums are paid: monthly, quarterly, annually';

CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'refunded');
COMMENT ON TYPE public.payment_status IS 'Premium payment status types';

-- Profile table
CREATE TABLE public.profile (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    username VARCHAR UNIQUE,
    status status,
    name VARCHAR,
    address VARCHAR,
    avatar_url VARCHAR,
    dob TIMESTAMP,
    role title,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
COMMENT ON TABLE public.profile IS 'Extended profile information for users';
COMMENT ON COLUMN public.profile.id IS 'Unique identifier for each profile';
COMMENT ON COLUMN public.profile.user_id IS 'Reference to the user this profile belongs to';
COMMENT ON COLUMN public.profile.username IS 'Unique username';
COMMENT ON COLUMN public.profile.status IS 'User account status - active, disabled, or deleted';
COMMENT ON COLUMN public.profile.name IS 'Full name of the user';
COMMENT ON COLUMN public.profile.address IS 'Physical address of the user';
COMMENT ON COLUMN public.profile.dob IS 'Date of birth';
COMMENT ON COLUMN public.profile.avatar_url IS 'URL of the user''s avatar image';
COMMENT ON COLUMN public.profile.role IS 'User role/position in the organization hierarchy';
COMMENT ON COLUMN public.profile.created_at IS 'When the profile record was created';
COMMENT ON COLUMN public.profile.updated_at IS 'When the profile record was last updated';
COMMENT ON COLUMN public.profile.deleted_at IS 'Soft delete timestamp, null if not deleted';

-- Insurance companies table
CREATE TABLE public.insurance_companies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
COMMENT ON TABLE public.insurance_companies IS 'Insurance companies that offer products through our system';
COMMENT ON COLUMN public.insurance_companies.id IS 'Unique identifier for each insurance company';
COMMENT ON COLUMN public.insurance_companies.name IS 'Full company name';
COMMENT ON COLUMN public.insurance_companies.code IS 'Short company identifier code';
COMMENT ON COLUMN public.insurance_companies.email IS 'Company contact email address';
COMMENT ON COLUMN public.insurance_companies.phone IS 'Company contact phone number';
COMMENT ON COLUMN public.insurance_companies.website IS 'Company website URL';
COMMENT ON COLUMN public.insurance_companies.created_at IS 'When the company record was created';
COMMENT ON COLUMN public.insurance_companies.updated_at IS 'When the company record was last updated';
COMMENT ON COLUMN public.insurance_companies.deleted_at IS 'Soft delete timestamp, null if not deleted';

-- Insurance products table
CREATE TABLE public.insurance_products (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES public.insurance_companies(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    coverage_amount DECIMAL(15,2),
    premium_amount DECIMAL(10,2) NOT NULL,
    premium_frequency premium_frequency DEFAULT 'monthly',
    term_years UUID,
    status status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
COMMENT ON TABLE public.insurance_products IS 'Insurance products offered by partner companies';
COMMENT ON COLUMN public.insurance_products.id IS 'Unique identifier for each insurance product';
COMMENT ON COLUMN public.insurance_products.company_id IS 'Reference to the insurance company offering this product';
COMMENT ON COLUMN public.insurance_products.name IS 'Product name/title';
COMMENT ON COLUMN public.insurance_products.product_code IS 'Unique product identifier code';
COMMENT ON COLUMN public.insurance_products.description IS 'Detailed product description and features';
COMMENT ON COLUMN public.insurance_products.coverage_amount IS 'Maximum coverage amount in currency';
COMMENT ON COLUMN public.insurance_products.premium_amount IS 'Base premium amount';
COMMENT ON COLUMN public.insurance_products.premium_frequency IS 'How often premiums are paid: monthly, quarterly, annually';
COMMENT ON COLUMN public.insurance_products.term_years IS 'Policy term duration in years';
COMMENT ON COLUMN public.insurance_products.status IS 'Product availability status: active, inactive, deleted';
COMMENT ON COLUMN public.insurance_products.created_at IS 'When the product was added to system';
COMMENT ON COLUMN public.insurance_products.updated_at IS 'When the product was last modified';
COMMENT ON COLUMN public.insurance_products.deleted_at IS 'Soft delete timestamp, null if not deleted';

-- Sales table
CREATE TABLE public.sales (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    sale_date DATE NOT NULL DEFAULT NOW(),
    total_commission_amount DECIMAL(10,2),
    payment_frequency VARCHAR(20) DEFAULT 'monthly',
    total_sale_value DECIMAL(15,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
COMMENT ON TABLE public.sales IS 'Sales transactions - can contain multiple insurance products for different family members';
COMMENT ON COLUMN public.sales.id IS 'Unique identifier for each sale transaction';
COMMENT ON COLUMN public.sales.user_id IS 'Reference to the sales agent/user who made the sale';
COMMENT ON COLUMN public.sales.customer_name IS 'Name of the primary customer who purchased the policies';
COMMENT ON COLUMN public.sales.sale_date IS 'Date when the sale was completed';
COMMENT ON COLUMN public.sales.total_commission_amount IS 'Total commission amount earned by the agent for this sale';
COMMENT ON COLUMN public.sales.payment_frequency IS 'How often customer pays premiums: monthly, quarterly, annually';
COMMENT ON COLUMN public.sales.total_sale_value IS 'Total value of all products in this sale';
COMMENT ON COLUMN public.sales.notes IS 'Additional notes or comments about the sale';
COMMENT ON COLUMN public.sales.created_at IS 'When the sale record was created';
COMMENT ON COLUMN public.sales.updated_at IS 'When the sale record was last updated';
COMMENT ON COLUMN public.sales.deleted_at IS 'Soft delete timestamp, null if not deleted';

-- Sale items table
CREATE TABLE public.sale_items (
    id UUID PRIMARY KEY,
    sale_id UUID REFERENCES public.sales(id) NOT NULL,
    product_id UUID REFERENCES public.insurance_products(id) NOT NULL,
    insured_person_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50),
    premium_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2),
    commission_amount DECIMAL(10,2),
    policy_number VARCHAR(100) UNIQUE NOT NULL,
    policy_start_date DATE NOT NULL,
    policy_end_date DATE,
    coverage_amount DECIMAL(15,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
COMMENT ON TABLE public.sale_items IS 'Individual products/policies within a sale - allows multiple policies per sale transaction';
COMMENT ON COLUMN public.sale_items.id IS 'Unique identifier for each sale item';
COMMENT ON COLUMN public.sale_items.sale_id IS 'Reference to the main sale transaction';
COMMENT ON COLUMN public.sale_items.product_id IS 'Reference to the insurance product being sold';
COMMENT ON COLUMN public.sale_items.insured_person_name IS 'Name of the person being insured (e.g., husband, wife, son)';
COMMENT ON COLUMN public.sale_items.relationship IS 'Relationship to primary customer (self, spouse, child, parent, etc.)';
COMMENT ON COLUMN public.sale_items.premium_amount IS 'Premium amount for this specific product/person';
COMMENT ON COLUMN public.sale_items.commission_rate IS 'Commission percentage for this sale item';
COMMENT ON COLUMN public.sale_items.commission_amount IS 'Commission amount earned for this specific item';
COMMENT ON COLUMN public.sale_items.policy_number IS 'Unique policy identifier for this specific coverage';
COMMENT ON COLUMN public.sale_items.policy_start_date IS 'When this specific insurance coverage begins';
COMMENT ON COLUMN public.sale_items.policy_end_date IS 'When this specific insurance coverage expires';
COMMENT ON COLUMN public.sale_items.coverage_amount IS 'Coverage amount for this specific policy';
COMMENT ON COLUMN public.sale_items.notes IS 'Additional notes about this specific policy/person';
COMMENT ON COLUMN public.sale_items.created_at IS 'When the sale item was created';
COMMENT ON COLUMN public.sale_items.updated_at IS 'When the sale item was last updated';
COMMENT ON COLUMN public.sale_items.deleted_at IS 'Soft delete timestamp, null if not deleted';

-- User hierarchy table
CREATE TABLE public.user_hierarchy (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    leader_id UUID REFERENCES public.users(id),
    region VARCHAR(100),
    division VARCHAR(100),
    status status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
COMMENT ON TABLE public.user_hierarchy IS 'Organizational hierarchy defining reporting relationships and levels';
COMMENT ON COLUMN public.user_hierarchy.id IS 'Unique identifier for hierarchy relationship';
COMMENT ON COLUMN public.user_hierarchy.user_id IS 'Reference to the user';
COMMENT ON COLUMN public.user_hierarchy.leader_id IS 'Reference to this user''s direct leader/manager';
COMMENT ON COLUMN public.user_hierarchy.region IS 'Geographic region this user manages/belongs to';
COMMENT ON COLUMN public.user_hierarchy.division IS 'Division or area this user manages/belongs to';
COMMENT ON COLUMN public.user_hierarchy.status IS 'Whether this hierarchy assignment is active';
COMMENT ON COLUMN public.user_hierarchy.created_at IS 'When this hierarchy record was created';
COMMENT ON COLUMN public.user_hierarchy.updated_at IS 'When this hierarchy record was last updated';
COMMENT ON COLUMN public.user_hierarchy.deleted_at IS 'Soft delete timestamp, null if not deleted';

-- User permissions table
CREATE TABLE public.user_permissions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    permission_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
COMMENT ON TABLE public.user_permissions IS 'Permissions assigned to users - can be used for access control';
COMMENT ON COLUMN public.user_permissions.id IS 'Unique identifier for each permission';
COMMENT ON COLUMN public.user_permissions.user_id IS 'Reference to the user';
COMMENT ON COLUMN public.user_permissions.permission_name IS 'Name of the permission';
COMMENT ON COLUMN public.user_permissions.permission_description IS 'Description of the permission';
COMMENT ON COLUMN public.user_permissions.created_at IS 'When the permission record was created';
COMMENT ON COLUMN public.user_permissions.updated_at IS 'When the permission record was last updated';
COMMENT ON COLUMN public.user_permissions.deleted_at IS 'Soft delete timestamp, null if not deleted';


CREATE TYPE public.goal_recurring_duration AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
COMMENT ON TYPE public.goal_recurring_duration IS 'How often the goal repeats (daily, weekly, monthly, yearly)';

ALTER TABLE public.goals ADD COLUMN recurring_duration goal_recurring_duration;

CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    recurring_duration goal_recurring_duration, -- 'daily', 'weekly', 'monthly', 'yearly', etc.
    target NUMERIC,
    achieved NUMERIC,
    end_date DATE, -- Only used when recurring_duration is NULL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraint: either recurring_duration is set OR end_date is set, but not both
    CONSTRAINT goals_duration_or_end_date_check 
        CHECK (
            (recurring_duration IS NOT NULL AND end_date IS NULL) OR 
            (recurring_duration IS NULL AND end_date IS NOT NULL)
        )
);

-- Create index on profile_id for efficient queries
CREATE INDEX IF NOT EXISTS idx_goals_profile_id ON goals(profile_id);

-- Create index on deleted_at for soft delete queries
CREATE INDEX IF NOT EXISTS idx_goals_deleted_at ON goals(deleted_at) WHERE deleted_at IS NULL;


-- Add comment to table
COMMENT ON TABLE goals IS 'User goals with either recurring duration or end date';
COMMENT ON COLUMN goals.id IS 'Unique identifier for each goal';
COMMENT ON COLUMN goals.profile_id IS 'Reference to the profile this goal belongs to';
COMMENT ON COLUMN goals.label IS 'Goal description/label';
COMMENT ON COLUMN goals.recurring_duration IS 'How often the goal repeats (daily, weekly, monthly, yearly)';
COMMENT ON COLUMN goals.target IS 'Target value for the goal (numeric)';
COMMENT ON COLUMN goals.achieved IS 'Achieved value for the goal (numeric)';
COMMENT ON COLUMN goals.end_date IS 'End date for non-recurring goals';
COMMENT ON COLUMN goals.created_at IS 'When the goal was created';
COMMENT ON COLUMN goals.updated_at IS 'When the goal was last updated';
COMMENT ON COLUMN goals.deleted_at IS 'Soft delete timestamp, null if not deleted';"
