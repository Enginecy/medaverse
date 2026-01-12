-- Add is_first90 column to profile table
ALTER TABLE public.profile 
ADD COLUMN IF NOT EXISTS is_first90 BOOLEAN DEFAULT false NOT NULL;

-- Update or create update_agent_profile function to include is_first90 parameter
CREATE OR REPLACE FUNCTION public.update_agent_profile(
    p_profile_id UUID,
    p_role_id UUID,
    p_full_name TEXT,
    p_username TEXT,
    p_office TEXT,
    p_dob DATE,
    p_phone_number TEXT,
    p_npn_number TEXT,
    p_avatar_url TEXT,
    p_updated_by UUID,
    p_states JSONB[],
    p_upline UUID,
    p_is_first90 BOOLEAN DEFAULT false
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_leader_user_id UUID;
BEGIN
    -- Update profile
    UPDATE public.profile
    SET
        name = p_full_name,
        username = p_username,
        office = p_office,
        dob = p_dob,
        phone_number = p_phone_number,
        npn_number = p_npn_number,
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        states = p_states,
        is_first90 = p_is_first90,
        updated_at = NOW()
    WHERE id = p_profile_id;

    -- Update user role if role_id is provided
    IF p_role_id IS NOT NULL THEN
        UPDATE public.user_roles
        SET 
            role_id = p_role_id,
            updated_at = NOW()
        WHERE user_id = (SELECT user_id FROM public.profile WHERE id = p_profile_id)
        AND status = 'active'
        AND deleted_at IS NULL;
    END IF;

    -- Update user hierarchy if upline is provided
    IF p_upline IS NOT NULL THEN
        -- Get the leader's user_id from the profile
        SELECT user_id INTO v_leader_user_id
        FROM public.profile
        WHERE id = p_upline;

        IF v_leader_user_id IS NOT NULL THEN
            UPDATE public.user_hierarchy
            SET 
                leader_id = v_leader_user_id,
                updated_at = NOW()
            WHERE user_id = (SELECT user_id FROM public.profile WHERE id = p_profile_id)
            AND deleted_at IS NULL;
        END IF;
    END IF;
END;
$$;

COMMENT ON FUNCTION public.update_agent_profile IS 'Updates agent profile information including role, hierarchy, and profile fields';

