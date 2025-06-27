-- Document categories enum
CREATE TYPE public.document_category AS ENUM ('news', 'contracts', 'recruiting');

-- File type enum  
CREATE TYPE public.file_type AS ENUM ('pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg');

-- Main documents table
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_type public.file_type NOT NULL,
    file_size BIGINT NOT NULL, -- in bytes
    file_path TEXT NOT NULL, -- Supabase storage path
    storage_bucket VARCHAR(100) DEFAULT 'documents',
    
    -- Categorization
    category public.document_category NOT NULL,
    tags TEXT[], -- Array of tags for better searchability
    
    -- Content and metadata
    title VARCHAR(500),
    description TEXT,
    
    -- User relationships
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(original_file_name, '') || ' ' || 
            coalesce(description, '') || ' ' ||
            array_to_string(tags, ' ')
        )
    ) STORED
);

-- Create indexes for performance
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX idx_documents_created_at ON public.documents(created_at);
CREATE INDEX idx_documents_file_type ON public.documents(file_type);
CREATE INDEX idx_documents_deleted_at ON public.documents(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_search_vector ON public.documents USING gin(search_vector);
CREATE INDEX idx_documents_tags ON public.documents USING gin(tags);

-- ====================================================================
-- CREATE DOCUMENT-SPECIFIC HELPER FUNCTIONS
-- ====================================================================

-- Function to check if user can manage a specific document
CREATE OR REPLACE FUNCTION public.can_manage_document(document_id UUID, required_permission TEXT DEFAULT 'documents:update')
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get documents with permission filtering
CREATE OR REPLACE FUNCTION public.get_user_accessible_documents(
    p_category public.document_category DEFAULT NULL,
    p_search TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    file_name VARCHAR,
    original_file_name VARCHAR,
    file_type file_type,
    file_size BIGINT,
    category document_category,
    title VARCHAR,
    uploaded_by UUID,
    uploader_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    can_update BOOLEAN,
    can_delete BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.file_name,
        d.original_file_name,
        d.file_type,
        d.file_size,
        d.category,
        d.title,
        d.uploaded_by,
        p.name as uploader_name,
        d.created_at,
        d.updated_at,
        can_manage_document(d.id, 'documents:update') as can_update,
        can_manage_document(d.id, 'documents:delete') as can_delete
    FROM documents d
    LEFT JOIN profile p ON d.uploaded_by = p.user_id
    WHERE d.deleted_at IS NULL
    AND (p_category IS NULL OR d.category = p_category)
    AND (p_search IS NULL OR d.search_vector @@ plainto_tsquery('english', p_search))
    AND (
        -- User has read permission
        user_has_permission(auth.uid(), 'documents:read')
        OR
        -- Or is the document owner
        d.uploaded_by = auth.uid()
        OR
        -- Or is SuperAdmin
        issuperadmin()
    )
    ORDER BY d.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- UPDATED RLS POLICIES WITH RBAC INTEGRATION
-- ====================================================================

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;


-- Documents SELECT policy - based on permissions
CREATE POLICY "Users can view documents based on permissions"
ON public.documents FOR SELECT
TO authenticated
USING (
    deleted_at IS NULL
    AND (
        -- User has documents:read permission
        user_has_permission(auth.uid(), 'documents:read')
        OR
        -- User is the document owner
        uploaded_by = auth.uid()
        OR
        -- SuperAdmin can see all
        issuperadmin()
    )
);

-- Documents INSERT policy - based on permissions
CREATE POLICY "Users can upload documents with permission"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (
    uploaded_by = auth.uid()
    AND (
        -- User has documents:create permission
        user_has_permission(auth.uid(), 'documents:create')
        OR
        -- SuperAdmin can create
        issuperadmin()
    )
);

-- Documents UPDATE policy - based on permissions and ownership
CREATE POLICY "Users can update documents with permission"
ON public.documents FOR UPDATE
TO authenticated
USING (
    deleted_at IS NULL
    AND (
        -- SuperAdmin can update all
        issuperadmin()
        OR
        -- Document owner can update their own documents
        (uploaded_by = auth.uid() AND user_has_permission(auth.uid(), 'documents:update'))
        OR
        -- Users with documents:manage permission can update any document
        user_has_permission(auth.uid(), 'documents:manage')
    )
)
WITH CHECK (
    -- Ensure updated_by is set to current user
    updated_by = auth.uid()
);

-- Documents DELETE policy - based on permissions and ownership
CREATE POLICY "Users can delete documents with permission"
ON documents FOR DELETE
TO authenticated
USING (
    deleted_at IS NULL
    AND (
        -- SuperAdmin can delete all
        issuperadmin()
        OR
        -- Document owner can delete their own documents if they have delete permission
        (uploaded_by = auth.uid() AND user_has_permission(auth.uid(), 'documents:delete'))
        OR
        -- Users with documents:manage permission can delete any document
        user_has_permission(auth.uid(), 'documents:manage')
    )
);

-- ====================================================================
-- UPDATED SUPABASE STORAGE POLICIES WITH RBAC
-- ====================================================================

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies with RBAC integration
CREATE POLICY "Users can upload documents with permission"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'documents'
    AND (
        user_has_permission(auth.uid(), 'documents:create')
        OR issuperadmin()
    )
);

CREATE POLICY "Users can view documents with permission"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documents'
    AND (
        user_has_permission(auth.uid(), 'documents:read')
        OR owner = auth.uid()
        OR issuperadmin()
    )
);

CREATE POLICY "Users can update storage objects with permission"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'documents'
    AND (
        (owner = auth.uid() AND user_has_permission(auth.uid(), 'documents:update'))
        OR user_has_permission(auth.uid(), 'documents:manage')
        OR issuperadmin()
    )
);

CREATE POLICY "Users can delete storage objects with permission"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'documents'
    AND (
        (owner = auth.uid() AND user_has_permission(auth.uid(), 'documents:delete'))
        OR user_has_permission(auth.uid(), 'documents:manage')
        OR issuperadmin()
    )
);