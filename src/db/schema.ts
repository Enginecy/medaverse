import {
  pgTable,
  unique,
  pgPolicy,
  uuid,
  varchar,
  timestamp,
  index,
  foreignKey,
  date,
  text,
  numeric,
  check,
  boolean,
  pgEnum,
  bigint,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { sql } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";
import type { Office, State } from "@/lib/data";

export const users = authUsers;

export const documentCategory = pgEnum("document_category", [
  "news",
  "contracts",
  "recruiting",
]);

export const fileType = pgEnum("file_type", [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "txt",
  "png",
  "jpg",
  "jpeg",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "paid",
  "overdue",
  "cancelled",
  "refunded",
]);
export const premiumFrequency = pgEnum("premium_frequency", [
  "monthly",
  "quarterly",
  "annually",
]);
export const goalRecurringDuration = pgEnum("goal_recurring_duration", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);
export const status = pgEnum("status", ["active", "disabled", "delete"]);
export const title = pgEnum("title", [
  "SuperAdmin",
  "NationalDirector",
  "RegionalDirector",
  "DivisionalDirector",
  "AssociateDirector",
  "PlatinumAssociate",
  "SeniorAssociate",
  "Associate",
  "Leads",
]);

export const insuranceCompanies = pgTable(
  "insurance_companies",
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 10 }),
    email: varchar({ length: 255 }),
    phone: varchar({ length: 20 }),
    website: varchar({ length: 255 }).notNull(),
    imageUrl: varchar({ length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    unique("insurance_companies_code_key").on(table.code),
    pgPolicy("Only SuperAdmin users can insert new insurance companies", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`issuperadmin()`,
    }),
    pgPolicy("Only SuperAdmin users can update insurance companies", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can delete insurance companies", {
      as: "permissive",
      for: "delete",
      to: ["public"],
    }),
    pgPolicy("All active users can view insurance companies", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);

export const profile = pgTable(
  "profile",
  {
    id: uuid().defaultRandom().primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id").notNull(),
    username: varchar().notNull(),
    status: status().notNull(),
    name: varchar().notNull(),
    office: text().$type<Office>(),
    dob: date("dob", { mode: "date" }).notNull(),
    phoneNumber: varchar("phone_number"), //TODO: Add notNull before deploying
    npnNumber: varchar("npn_number"), //TODO: Add notNull before deploying
    states: jsonb("states").array().$type<State[]>(), //TODO: Add notNull before deploying
    isFirst90: boolean("is_first90").default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    avatarUrl: text("avatar_url")
      .notNull()
      .default(
        sql`'https://axdfmmwtobzrqbdcikrt.supabase.co/storage/v1/object/public/profile-images//default.jpg'`,
      ),
  },
  (table) => [
    index("idx_profile_role_status")
      .using("btree", table.status.asc().nullsLast().op("enum_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_profile_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "profile_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("profile_username_key").on(table.username),
    pgPolicy("Only SuperAdmin users can insert new profiles", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`issuperadmin()`,
    }),
    pgPolicy(
      "Users can view their own profile and profiles of their subordin",
      { as: "permissive", for: "select", to: ["public"] },
    ),
    pgPolicy(
      "Users can only update their own profile, leaders can update sub",
      { as: "permissive", for: "update", to: ["public"] },
    ),
  ],
);

export const insuranceProducts = pgTable(
  "insurance_products",
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    productCode: varchar("product_code", { length: 50 }).notNull(),
    status: status().default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    unique("insurance_products_product_code_key").on(table.productCode),
    pgPolicy("Only SuperAdmin users can insert new insurance products", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`issuperadmin()`,
    }),
    pgPolicy("Only SuperAdmin users can update insurance products", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can delete insurance products", {
      as: "permissive",
      for: "delete",
      to: ["public"],
    }),
    pgPolicy("All active users can view active insurance products", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);

export const sales = pgTable(
  "sales",
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id").notNull(),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    saleDate: date("sale_date", { mode: "date" }).defaultNow().notNull(),
    totalSaleValue: numeric("total_sale_value", {
      precision: 15,
      scale: 2,
    }),
    notes: text(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    index("idx_sales_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "sales_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("Only SuperAdmin users can delete sales", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`issuperadmin()`,
    }),
    pgPolicy("Users can only create sales for themselves", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy(
      "Users can update their own sales, leaders can update subordinat",
      { as: "permissive", for: "update", to: ["public"] },
    ),
    pgPolicy("Users can view their own sales and sales of their subordinates", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);

export const saleItems = pgTable(
  "sale_items",
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    saleId: uuid("sale_id").notNull(),
    productId: uuid("product_id").notNull(),
    premiumAmount: numeric("premium_amount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    policyNumber: varchar("policy_number", { length: 100 }).notNull(),
    isIssued: boolean("is_issued").default(false).notNull(),
    notes: text(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    companyId: uuid("company_id"),
  },
  (table) => [
    index("idx_sale_items_sale_id").using(
      "btree",
      table.saleId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [insuranceCompanies.id],
      name: "sale_items_company_id_fkey",
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [insuranceProducts.id],
      name: "sale_items_product_id_fkey",
    }),
    foreignKey({
      columns: [table.saleId],
      foreignColumns: [sales.id],
      name: "sale_items_sale_id_fkey",
    }),
    unique("sale_items_policy_number_key").on(table.policyNumber),
    pgPolicy("Only SuperAdmin users can delete sale items", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`issuperadmin()`,
    }),
    pgPolicy(
      "Users can update sale items for their own sales, leaders for su",
      { as: "permissive", for: "update", to: ["public"] },
    ),
    pgPolicy("Users can view sale items for sales they have access to", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    pgPolicy("Users can insert sale items for their own sales", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
  ],
);

export const userHierarchy = pgTable(
  "user_hierarchy",
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id").notNull(),
    leaderId: uuid("leader_id"),
    region: varchar({ length: 100 }),
    division: varchar({ length: 100 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    foreignKey({
      columns: [table.leaderId],
      foreignColumns: [users.id],
      name: "user_hierarchy_leader_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_hierarchy_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("Only SuperAdmin users can insert new hierarchy relationships", {
      as: "permissive",
      for: "insert",
      to: ["public"],
      withCheck: sql`issuperadmin()`,
    }),
    pgPolicy("Only SuperAdmin users can update hierarchy relationships", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can delete hierarchy relationships", {
      as: "permissive",
      for: "delete",
      to: ["public"],
    }),
    pgPolicy(
      "Users can view hierarchy information for themselves and their n",
      { as: "permissive", for: "select", to: ["public"] },
    ),
  ],
);

export const permissions = pgTable(
  "permissions",
  {
    id: uuid().defaultRandom().primaryKey().defaultRandom().notNull(),
    resource: text().notNull(),
    action: text().notNull(),
    name: text()
      .generatedAlwaysAs(sql`((resource || ':'::text) || action)`)
      .notNull(),
    description: text(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_permissions_action").using(
      "btree",
      table.action.asc().nullsLast().op("text_ops"),
    ),
    index("idx_permissions_deleted_at")
      .using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_permissions_name").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops"),
    ),
    index("idx_permissions_resource").using(
      "btree",
      table.resource.asc().nullsLast().op("text_ops"),
    ),
    unique("permissions_resource_action_key").on(table.resource, table.action),
    unique("permissions_name_key").on(table.name),
    pgPolicy("Only SuperAdmin users can manage permissions", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`issuperadmin()`,
    }),
    pgPolicy("All active users can view permissions", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
    check("permissions_action_no_colon", sql`action !~ ':'::text`),
    check("permissions_resource_no_colon", sql`resource !~ ':'::text`),
  ],
);

export const roles = pgTable(
  "roles",
  {
    id: uuid().defaultRandom().primaryKey().defaultRandom().notNull(),
    name: text().notNull(),
    code: text().notNull(),
    description: text(),
    level: integer().notNull().default(0),
    isSystemRole: boolean("is_system_role").default(false),
    status: status().default("active"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_roles_code").using(
      "btree",
      table.code.asc().nullsLast().op("text_ops"),
    ),
    index("idx_roles_deleted_at")
      .using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_roles_level").using(
      "btree",
      table.level.asc().nullsLast().op("text_ops"),
    ),
    index("idx_roles_status").using(
      "btree",
      table.status.asc().nullsLast().op("enum_ops"),
    ),
    unique("roles_name_key").on(table.name),
    unique("roles_code_key").on(table.code),
    pgPolicy("Only SuperAdmin users can manage roles", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`issuperadmin()`,
    }),
    pgPolicy("All active users can view active roles", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: uuid().defaultRandom().primaryKey().defaultRandom().notNull(),
    roleId: uuid("role_id").notNull(),
    permissionId: uuid("permission_id").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_role_permissions_deleted_at")
      .using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_role_permissions_permission_id").using(
      "btree",
      table.permissionId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_role_permissions_role_id").using(
      "btree",
      table.roleId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissions.id],
      name: "role_permissions_permission_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: "role_permissions_role_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("role_permissions_role_permission_key").on(
      table.roleId,
      table.permissionId,
    ),
    pgPolicy("Only SuperAdmin users can manage role permissions", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`issuperadmin()`,
    }),
    pgPolicy("All active users can view role permissions", {
      as: "permissive",
      for: "select",
      to: ["public"],
    }),
  ],
);

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid().defaultRandom().primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id").notNull(),
    roleId: uuid("role_id").notNull(),
    assignedBy: uuid("assigned_by"),
    assignedAt: timestamp("assigned_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
    status: status().default("active"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_user_roles_deleted_at")
      .using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_user_roles_expires_at")
      .using("btree", table.expiresAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(expires_at IS NOT NULL)`),
    index("idx_user_roles_role_id").using(
      "btree",
      table.roleId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_user_roles_status").using(
      "btree",
      table.status.asc().nullsLast().op("enum_ops"),
    ),
    index("idx_user_roles_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.assignedBy],
      foreignColumns: [users.id],
      name: "user_roles_assigned_by_fkey",
    }),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: "user_roles_role_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_roles_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("user_roles_user_role_key").on(table.userId, table.roleId),
    pgPolicy("SuperAdmin and user leaders can manage user roles", {
      as: "permissive",
      for: "all",
      to: ["public"],
      using: sql`(issuperadmin() OR isuserleader(user_id))`,
    }),
    pgPolicy(
      "Users can view their own roles and leaders can view subordinate",
      { as: "permissive", for: "select", to: ["public"] },
    ),
  ],
);

export const userPermissionsEnhanced = pgTable(
  "user_permissions_enhanced",
  {
    id: uuid().defaultRandom().primaryKey().defaultRandom().notNull(),
    userId: uuid("user_id").notNull(),
    permissionId: uuid("permission_id").notNull(),
    grantedBy: uuid("granted_by"),
    grantedAt: timestamp("granted_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
    reason: text(),
    status: status().default("active"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_user_permissions_enhanced_deleted_at")
      .using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_user_permissions_enhanced_expires_at")
      .using("btree", table.expiresAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(expires_at IS NOT NULL)`),
    index("idx_user_permissions_enhanced_permission_id").using(
      "btree",
      table.permissionId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_user_permissions_enhanced_status").using(
      "btree",
      table.status.asc().nullsLast().op("enum_ops"),
    ),
    index("idx_user_permissions_enhanced_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.grantedBy],
      foreignColumns: [users.id],
      name: "user_permissions_enhanced_granted_by_fkey",
    }),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissions.id],
      name: "user_permissions_enhanced_permission_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_permissions_enhanced_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("user_permissions_enhanced_user_permission_key").on(
      table.userId,
      table.permissionId,
    ),
    pgPolicy(
      "Users can view their own permissions and leaders can view subor",
      {
        as: "permissive",
        for: "select",
        to: ["public"],
        using: sql`((user_id = auth.uid()) OR issuperadmin() OR isuserleader(user_id))`,
      },
    ),
    pgPolicy("SuperAdmin and user leaders can manage user permissions", {
      as: "permissive",
      for: "all",
      to: ["public"],
    }),
  ],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    originalFileName: varchar("original_file_name", { length: 255 }).notNull(),
    fileType: fileType("file_type").notNull(),
    fileSize: bigint("file_size", { mode: "bigint" }).notNull(),
    filePath: text("file_path").notNull(),
    storageBucket: varchar("storage_bucket", { length: 100 }).default(
      "documents",
    ),
    category: documentCategory().notNull(),
    tags: text().array(),
    title: varchar({ length: 500 }),
    description: text(),
    uploadedBy: uuid("uploaded_by").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
    searchVector: text("search_vector"),
  },
  (table) => [
    index("idx_documents_category").using(
      "btree",
      table.category.asc().nullsLast().op("enum_ops"),
    ),
    index("idx_documents_created_at").using(
      "btree",
      table.createdAt.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("idx_documents_deleted_at")
      .using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_documents_file_type").using(
      "btree",
      table.fileType.asc().nullsLast().op("enum_ops"),
    ),
    index("idx_documents_search_vector").using(
      "gin",
      table.searchVector.asc().nullsLast().op("tsvector_ops"),
    ),
    index("idx_documents_tags").using(
      "gin",
      table.tags.asc().nullsLast().op("array_ops"),
    ),
    index("idx_documents_uploaded_by").using(
      "btree",
      table.uploadedBy.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.uploadedBy],
      foreignColumns: [users.id],
      name: "documents_uploaded_by_fkey",
    }).onDelete("cascade"),
    pgPolicy("Users can view documents based on permissions", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
      using: sql`((deleted_at IS NULL) AND (user_has_permission(auth.uid(), 'documents:read'::text) OR (uploaded_by = auth.uid()) OR issuperadmin()))`,
    }),
    pgPolicy("Users can upload documents with permission", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
    }),
    pgPolicy("Users can update documents with permission", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
    }),
    pgPolicy("Users can delete documents with permission", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
    }),
  ],
);

export const profileRelations = relations(profile, ({ one, many }) => ({
  users: one(users, {
    fields: [profile.userId],
    references: [users.id],
  }),
  goals: many(goals),
}));

export const usersInAuthRelations = relations(users, ({ many }) => ({
  profiles: many(profile),
  sales: many(sales),
  userHierarchies_leaderId: many(userHierarchy, {
    relationName: "userHierarchy_leaderId_usersInAuth_id",
  }),
  userHierarchies_userId: many(userHierarchy, {
    relationName: "userHierarchy_userId_usersInAuth_id",
  }),
  userRoles_assignedBy: many(userRoles, {
    relationName: "userRoles_assignedBy_usersInAuth_id",
  }),
  userRoles_userId: many(userRoles, {
    relationName: "userRoles_userId_usersInAuth_id",
  }),
  userPermissionsEnhanceds_grantedBy: many(userPermissionsEnhanced, {
    relationName: "userPermissionsEnhanced_grantedBy_usersInAuth_id",
  }),
  userPermissionsEnhanceds_userId: many(userPermissionsEnhanced, {
    relationName: "userPermissionsEnhanced_userId_usersInAuth_id",
  }),
}));

export const salesRelations = relations(sales, ({ one, many }) => ({
  users: one(users, {
    fields: [sales.userId],
    references: [users.id],
  }),
  saleItems: many(saleItems),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  insuranceCompany: one(insuranceCompanies, {
    fields: [saleItems.companyId],
    references: [insuranceCompanies.id],
  }),
  insuranceProduct: one(insuranceProducts, {
    fields: [saleItems.productId],
    references: [insuranceProducts.id],
  }),
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
}));

export const insuranceCompaniesRelations = relations(
  insuranceCompanies,
  ({ many }) => ({
    saleItems: many(saleItems),
  }),
);

export const insuranceProductsRelations = relations(
  insuranceProducts,
  ({ many }) => ({
    saleItems: many(saleItems),
  }),
);

export const userHierarchyRelations = relations(userHierarchy, ({ one }) => ({
  usersInAuth_leaderId: one(users, {
    fields: [userHierarchy.leaderId],
    references: [users.id],
    relationName: "userHierarchy_leaderId_usersInAuth_id",
  }),
  usersInAuth_userId: one(users, {
    fields: [userHierarchy.userId],
    references: [users.id],
    relationName: "userHierarchy_userId_usersInAuth_id",
  }),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
  }),
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userPermissionsEnhanceds: many(userPermissionsEnhanced),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  usersInAuth_assignedBy: one(users, {
    fields: [userRoles.assignedBy],
    references: [users.id],
    relationName: "userRoles_assignedBy_usersInAuth_id",
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  usersInAuth_userId: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
    relationName: "userRoles_userId_usersInAuth_id",
  }),
}));

export const userPermissionsEnhancedRelations = relations(
  userPermissionsEnhanced,
  ({ one }) => ({
    usersInAuth_grantedBy: one(users, {
      fields: [userPermissionsEnhanced.grantedBy],
      references: [users.id],
      relationName: "userPermissionsEnhanced_grantedBy_usersInAuth_id",
    }),
    permission: one(permissions, {
      fields: [userPermissionsEnhanced.permissionId],
      references: [permissions.id],
    }),
    usersInAuth_userId: one(users, {
      fields: [userPermissionsEnhanced.userId],
      references: [users.id],
      relationName: "userPermissionsEnhanced_userId_usersInAuth_id",
    }),
  }),
);

export const goals = pgTable(
  "goals",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    profileId: uuid("profile_id").notNull(),
    label: varchar().notNull(),
    target: numeric({ precision: 15, scale: 2 }),
    endDate: date("end_date", { mode: "date" }),
    goalType: varchar("goal_type").default("sales"),
    recurringDuration: goalRecurringDuration("recurring_duration"),
    achieved: numeric({ precision: 15, scale: 2 }).default("0").notNull(),
    lastResetDate: timestamp("last_reset_date", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    index("idx_goals_profile_id").using(
      "btree",
      table.profileId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_goals_deleted_at")
      .using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(deleted_at IS NULL)`),
    index("idx_goals_end_date").using(
      "btree",
      table.endDate.asc().nullsLast().op("date_ops"),
    ),
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profile.id],
      name: "goals_profile_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("Users can view their own goals", {
      as: "permissive",
      for: "select",
      to: ["authenticated"],
      using: sql`(profile_id IN (SELECT id FROM profile WHERE user_id = auth.uid()))`,
    }),
    pgPolicy("Users can create their own goals", {
      as: "permissive",
      for: "insert",
      to: ["authenticated"],
      withCheck: sql`(profile_id IN (SELECT id FROM profile WHERE user_id = auth.uid()))`,
    }),
    pgPolicy("Users can update their own goals", {
      as: "permissive",
      for: "update",
      to: ["authenticated"],
      using: sql`(profile_id IN (SELECT id FROM profile WHERE user_id = auth.uid()))`,
    }),
    pgPolicy("Users can delete their own goals", {
      as: "permissive",
      for: "delete",
      to: ["authenticated"],
      using: sql`(profile_id IN (SELECT id FROM profile WHERE user_id = auth.uid()))`,
    }),
  ],
);

export const documentsRelations = relations(documents, ({ one }) => ({
  users: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  profile: one(profile, {
    fields: [goals.profileId],
    references: [profile.id],
  }),
}));
