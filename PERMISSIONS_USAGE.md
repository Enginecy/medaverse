# Permissions System Usage Guide

This guide explains how to use the permissions system implemented with Drizzle ORM.

## Overview

The permissions system includes:
- Server-side function to fetch user permissions from both roles and direct assignments
- Client-side React component guard (`AllowPermissions`)  
- React hook for permission checks (`usePermissions`)

## Server-side Function

### `getCurrentUserPermissions()`

Located in `src/lib/supabase/server.ts`, this function:
- Fetches permissions from user roles
- Fetches direct user permissions  
- Combines and deduplicates them
- Returns an array of permission strings (e.g., `["documents:read", "users:create"]`)

```typescript
import { getCurrentUserPermissions } from "@/lib/supabase/server";

// Get current user's permissions
const permissions = await getCurrentUserPermissions();
console.log(permissions); // ["documents:read", "users:create", ...]
```

## Client-side Components

### `AllowPermissions` Component

A React component that conditionally renders children based on user permissions.

```tsx
import { AllowPermissions } from "@/lib/supabase/roles-component";

// Basic usage - shows content if user has documents:read permission
<AllowPermissions permissions={["documents:read"]}>
  <DocumentViewer />
</AllowPermissions>

// With fallback content
<AllowPermissions 
  permissions={["admin:full_access"]}
  fallback={<div>You need admin access</div>}
>
  <AdminPanel />
</AllowPermissions>

// Multiple permissions (user needs ANY ONE of these)
<AllowPermissions permissions={["users:create", "users:update"]}>
  <UserManagement />
</AllowPermissions>
```

**Props:**
- `permissions: string[]` - Array of required permissions (user needs ANY one)
- `children: React.ReactNode` - Content to show if permission check passes
- `fallback?: React.ReactNode` - Content to show if permission check fails (default: null)

### `usePermissions` Hook

A React hook for programmatic permission checks.

```tsx
import { usePermissions } from "@/lib/supabase/roles-component";

function MyComponent() {
  const { 
    permissions, 
    isLoading, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions 
  } = usePermissions();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Check single permission */}
      <button disabled={!hasPermission("users:create")}>
        Create User
      </button>

      {/* Check if user has ANY of these permissions */}
      {hasAnyPermission(["documents:create", "documents:update"]) && (
        <DocumentEditor />
      )}

      {/* Check if user has ALL of these permissions */}
      {hasAllPermissions(["users:read", "users:update"]) && (
        <FullUserManagement />
      )}

      {/* Access raw permissions array */}
      <div>Your permissions: {permissions.join(", ")}</div>
    </div>
  );
}
```

**Hook Returns:**
- `permissions: string[]` - Array of user's permissions
- `isLoading: boolean` - Whether permissions are being fetched
- `hasPermission(permission: string): boolean` - Check single permission
- `hasAnyPermission(permissions: string[]): boolean` - Check if user has any of the permissions
- `hasAllPermissions(permissions: string[]): boolean` - Check if user has all of the permissions

## Permission Format

Permissions follow the format: `resource:action`

Examples:
- `documents:read` - Can read documents
- `documents:create` - Can create documents  
- `users:update` - Can update users
- `admin:full_access` - Has full admin access

## Common Use Cases

### 1. Conditional Menu Items

```tsx
<nav>
  <AllowPermissions permissions={["documents:read"]}>
    <NavItem href="/documents">Documents</NavItem>
  </AllowPermissions>
  
  <AllowPermissions permissions={["users:read"]}>
    <NavItem href="/users">User Management</NavItem>
  </AllowPermissions>
</nav>
```

### 2. Action Buttons

```tsx
function DocumentCard({ document }) {
  const { hasPermission } = usePermissions();
  
  return (
    <Card>
      <CardContent>
        <h3>{document.title}</h3>
        <div className="actions">
          <AllowPermissions permissions={["documents:update"]}>
            <Button>Edit</Button>
          </AllowPermissions>
          
          <AllowPermissions permissions={["documents:delete"]}>
            <Button variant="destructive">Delete</Button>
          </AllowPermissions>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. Feature Flags

```tsx
function Dashboard() {
  const { hasAnyPermission } = usePermissions();
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Show analytics only if user can read any data */}
      {hasAnyPermission(["sales:read", "users:read"]) && (
        <AnalyticsWidget />
      )}
      
      <AllowPermissions permissions={["reports:create"]}>
        <ReportBuilder />
      </AllowPermissions>
    </div>
  );
}
```

### 4. Nested Permissions

```tsx
<AllowPermissions permissions={["documents:read"]}>
  <DocumentList>
    {/* User can view documents, but editing requires additional permission */}
    <AllowPermissions 
      permissions={["documents:update"]}
      fallback={<span>Read-only access</span>}
    >
      <EditDocumentButton />
    </AllowPermissions>
  </DocumentList>
</AllowPermissions>
```

## Performance Notes

- Permissions are fetched once when the component mounts and cached
- The hook re-fetches permissions if the user changes
- Server-side function uses efficient Drizzle queries with proper joins
- Consider implementing caching/memoization for frequently accessed permissions

## Security Considerations

- Client-side permission checks are for UX only - never rely on them for security
- Always implement server-side permission checks in your API routes
- The permission system respects RLS (Row Level Security) policies in your database
- Expired permissions and soft-deleted records are automatically filtered out
