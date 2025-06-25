export type Resource = {
  id: string;
  name: string;
  description: string;
  permissionCount: number;
  createdAt: string;
};

export type Permission = {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  createdAt: string;
};

export type Role = {
  id: string;
  name: string;
  code: string;
  description: string;
  level: number;
  userCount: number;
  permissionCount: number;
  status: "active" | "disabled";
  createdAt: string;
};

export type UserRole = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: {
    id: string;
    name: string;
    code: string;
    level: number;
  };
  assignedBy: {
    id: string;
    name: string;
  };
  assignedAt: string;
  expiresAt?: string;
  status: "active" | "expired" | "revoked";
};

export type UserPermission = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  permission: {
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string;
  };
  assignedBy: {
    id: string;
    name: string;
  };
  assignedAt: string;
  expiresAt?: string;
  status: "active" | "expired" | "revoked";
  source: "role" | "direct";
};

// Mock data
export const mockResources: Resource[] = [
  {
    id: "1",
    name: "users",
    description: "User management and profiles",
    permissionCount: 5,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "sales",
    description: "Sales data and transactions",
    permissionCount: 5,
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "reports",
    description: "Analytics and reporting",
    permissionCount: 3,
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "companies",
    description: "Insurance companies",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "products",
    description: "Insurance products",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "roles",
    description: "User roles and assignments",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    name: "permissions",
    description: "Permission management",
    permissionCount: 4,
    createdAt: "2024-01-01",
  },
];

export const mockPermissions: Permission[] = [
  {
    id: "1",
    name: "users:read",
    resource: "users",
    action: "read",
    description: "View user information",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "users:create",
    resource: "users",
    action: "create",
    description: "Create new users",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "users:update",
    resource: "users",
    action: "update",
    description: "Update user information",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "users:delete",
    resource: "users",
    action: "delete",
    description: "Delete users",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "sales:read",
    resource: "sales",
    action: "read",
    description: "View sales data",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "sales:create",
    resource: "sales",
    action: "create",
    description: "Create new sales",
    createdAt: "2024-01-01",
  },
  {
    id: "7",
    name: "sales:update",
    resource: "sales",
    action: "update",
    description: "Update sales records",
    createdAt: "2024-01-01",
  },
  {
    id: "8",
    name: "sales:delete",
    resource: "sales",
    action: "delete",
    description: "Delete sales records",
    createdAt: "2024-01-01",
  },
  {
    id: "9",
    name: "reports:read",
    resource: "reports",
    action: "read",
    description: "View reports",
    createdAt: "2024-01-01",
  },
  {
    id: "10",
    name: "reports:create",
    resource: "reports",
    action: "create",
    description: "Create reports",
    createdAt: "2024-01-01",
  },
];

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    code: "super_admin",
    description: "Full system access",
    level: 10,
    userCount: 2,
    permissionCount: 25,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Regional Director",
    code: "regional_director",
    description: "Regional management and oversight",
    level: 8,
    userCount: 5,
    permissionCount: 18,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Lead Agent",
    code: "lead_agent",
    description: "Team lead with additional permissions",
    level: 6,
    userCount: 12,
    permissionCount: 12,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Associate",
    code: "associate",
    description: "Standard agent permissions",
    level: 4,
    userCount: 45,
    permissionCount: 8,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "5",
    name: "Sales Manager",
    code: "sales_manager",
    description: "Sales team management",
    level: 7,
    userCount: 8,
    permissionCount: 15,
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "6",
    name: "Trainee",
    code: "trainee",
    description: "Limited access for new hires",
    level: 2,
    userCount: 15,
    permissionCount: 4,
    status: "active",
    createdAt: "2024-01-01",
  },
];

export const mockUserRoles: UserRole[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "John Smith",
      email: "john.smith@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r1",
      name: "Super Admin",
      code: "super_admin",
      level: 10,
    },
    assignedBy: {
      id: "admin",
      name: "System Admin",
    },
    assignedAt: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah.johnson@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r2",
      name: "Regional Director",
      code: "regional_director",
      level: 8,
    },
    assignedBy: {
      id: "u1",
      name: "John Smith",
    },
    assignedAt: "2024-01-15",
    status: "active",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Mike Wilson",
      email: "mike.wilson@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r3",
      name: "Lead Agent",
      code: "lead_agent",
      level: 6,
    },
    assignedBy: {
      id: "u2",
      name: "Sarah Johnson",
    },
    assignedAt: "2024-02-01",
    status: "active",
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Emily Brown",
      email: "emily.brown@medahealth.com",
      avatar: "/profile.jpg",
    },
    role: {
      id: "r4",
      name: "Associate",
      code: "associate",
      level: 4,
    },
    assignedBy: {
      id: "u3",
      name: "Mike Wilson",
    },
    assignedAt: "2024-02-15",
    expiresAt: "2024-08-15",
    status: "active",
  },
];

export const mockUserPermissions: UserPermission[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "John Smith",
      email: "john.smith@medahealth.com",
    },
    permission: {
      id: "p1",
      name: "users:delete",
      resource: "users",
      action: "delete",
      description: "Delete users",
    },
    assignedBy: {
      id: "admin",
      name: "System Admin",
    },
    assignedAt: "2024-01-01",
    status: "active",
    source: "direct",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah.johnson@medahealth.com",
    },
    permission: {
      id: "p2",
      name: "reports:create",
      resource: "reports",
      action: "create",
      description: "Create custom reports",
    },
    assignedBy: {
      id: "u1",
      name: "John Smith",
    },
    assignedAt: "2024-01-15",
    expiresAt: "2024-07-15",
    status: "active",
    source: "direct",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Mike Wilson",
      email: "mike.wilson@medahealth.com",
    },
    permission: {
      id: "p3",
      name: "sales:update",
      resource: "sales",
      action: "update",
      description: "Update sales records",
    },
    assignedBy: {
      id: "u2",
      name: "Sarah Johnson",
    },
    assignedAt: "2024-02-01",
    status: "active",
    source: "direct",
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Emily Brown",
      email: "emily.brown@medahealth.com",
    },
    permission: {
      id: "p4",
      name: "users:read",
      resource: "users",
      action: "read",
      description: "View user information",
    },
    assignedBy: {
      id: "u3",
      name: "Mike Wilson",
    },
    assignedAt: "2024-02-15",
    status: "active",
    source: "role",
  },
];
