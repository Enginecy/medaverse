import {
  pgTable,
  foreignKey,
  unique,
  pgPolicy,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
  index,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";
import { relations } from "drizzle-orm/relations";

export const users = authUsers;

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

export const insuranceProducts = pgTable(
  "insurance_products",
  {
    id: uuid().primaryKey().notNull(),
    companyId: uuid("company_id").references(() => insuranceCompanies.id, {
      onDelete: "cascade",
    }),
    name: varchar({ length: 255 }).notNull(),
    productCode: varchar("product_code", { length: 50 }).notNull(),
    description: text(),
    coverageAmount: numeric("coverage_amount", { precision: 15, scale: 2 }),
    premiumAmount: numeric("premium_amount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    premiumFrequency: premiumFrequency("premium_frequency").default("monthly"),
    termYears: integer("term_years"),
    status: status().default("active"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    foreignKey({
      columns: [table.companyId],
      foreignColumns: [insuranceCompanies.id],
      name: "insurance_products_company_id_fkey",
    }),
    unique("insurance_products_product_code_key").on(table.productCode),
    pgPolicy("All active users can view active insurance products", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`((EXISTS ( SELECT 1
   FROM profile
  WHERE ((profile.user_id = auth.uid()) AND (profile.status = 'active'::status) AND (profile.deleted_at IS NULL)))) AND ((status = 'active'::status) OR issuperadmin()))`,
    }),
    pgPolicy("Only SuperAdmin users can delete insurance products", {
      as: "permissive",
      for: "delete",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can insert new insurance products", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can update insurance products", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
  ],
);

export const sales = pgTable(
  "sales",
  {
    id: uuid().primaryKey().notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    saleDate: date("sale_date", { mode: "date" }).defaultNow().notNull(),
    totalCommissionAmount: numeric("total_commission_amount", {
      precision: 10,
      scale: 2,
    }),
    paymentFrequency: varchar("payment_frequency", { length: 20 }).default(
      "monthly",
    ),
    totalSaleValue: numeric("total_sale_value", { precision: 15, scale: 2 }),
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

export const profile = pgTable(
  "profile",
  {
    id: uuid().primaryKey().notNull(),
    userId: uuid("user_id").references(() => users.id),
    username: varchar(),
    status: status(),
    name: varchar(),
    address: varchar(),
    dob: timestamp({ mode: "date" }),
    role: title(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    avatarUrl: text("avatar_url"),
  },
  (table) => [
    index("idx_profile_role_status")
      .using(
        "btree",
        table.role.asc().nullsLast().op("enum_ops"),
        table.status.asc().nullsLast().op("enum_ops"),
      )
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
      "Users can only update their own profile, leaders can update sub",
      { as: "permissive", for: "update", to: ["public"] },
    ),
    pgPolicy(
      "Users can view their own profile and profiles of their subordin",
      { as: "permissive", for: "select", to: ["public"] },
    ),
  ],
);

export const insuranceCompanies = pgTable(
  "insurance_companies",
  {
    id: uuid().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 10 }).notNull(),
    email: varchar({ length: 255 }),
    phone: varchar({ length: 20 }),
    website: varchar({ length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    unique("insurance_companies_code_key").on(table.code),
    pgPolicy("All active users can view insurance companies", {
      as: "permissive",
      for: "select",
      to: ["public"],
      using: sql`(EXISTS ( SELECT 1
   FROM profile
  WHERE ((profile.user_id = auth.uid()) AND (profile.status = 'active'::status) AND (profile.deleted_at IS NULL))))`,
    }),
    pgPolicy("Only SuperAdmin users can delete insurance companies", {
      as: "permissive",
      for: "delete",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can insert new insurance companies", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can update insurance companies", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
  ],
);

export const saleItems = pgTable(
  "sale_items",
  {
    id: uuid().primaryKey().notNull(),
    saleId: uuid("sale_id")
      .references(() => sales.id)
      .notNull(),
    productId: uuid("product_id")
      .references(() => insuranceProducts.id)
      .notNull(),
    insuredPersonName: varchar("insured_person_name", {
      length: 255,
    }).notNull(),
    relationship: varchar({ length: 50 }),
    premiumAmount: numeric("premium_amount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }),
    commissionAmount: numeric("commission_amount", { precision: 10, scale: 2 }),
    policyNumber: varchar("policy_number", { length: 100 }).notNull(),
    policyStartDate: date("policy_start_date").notNull(),
    policyEndDate: date("policy_end_date"),
    coverageAmount: numeric("coverage_amount", { precision: 15, scale: 2 }),
    notes: text(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    index("idx_sale_items_sale_id").using(
      "btree",
      table.saleId.asc().nullsLast().op("uuid_ops"),
    ),
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
    pgPolicy("Users can insert sale items for their own sales", {
      as: "permissive",
      for: "insert",
      to: ["public"],
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
  ],
);

export const userPermissions = pgTable(
  "user_permissions",
  {
    id: uuid().primaryKey().notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    permissionName: varchar("permission_name", { length: 100 }).notNull(),
    permissionDescription: text("permission_description"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_permissions_user_id_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    pgPolicy("Only SuperAdmin users can delete permissions", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`issuperadmin()`,
    }),
    pgPolicy("Only SuperAdmin users can insert new permissions", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can update permissions", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy(
      "Users can view their own permissions, leaders can view subordin",
      { as: "permissive", for: "select", to: ["public"] },
    ),
  ],
);

export const userHierarchy = pgTable(
  "user_hierarchy",
  {
    id: uuid().primaryKey().notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    leaderId: uuid("leader_id").references(() => users.id),
    region: varchar({ length: 100 }),
    division: varchar({ length: 100 }),
    status: status().default("active"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    index("idx_user_hierarchy_leader_id")
      .using("btree", table.leaderId.asc().nullsLast().op("uuid_ops"))
      .where(sql`((status = 'active'::status) AND (deleted_at IS NULL))`),
    index("idx_user_hierarchy_user_id")
      .using("btree", table.userId.asc().nullsLast().op("uuid_ops"))
      .where(sql`((status = 'active'::status) AND (deleted_at IS NULL))`),
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
    pgPolicy("Only SuperAdmin users can delete hierarchy relationships", {
      as: "permissive",
      for: "delete",
      to: ["public"],
      using: sql`issuperadmin()`,
    }),
    pgPolicy("Only SuperAdmin users can insert new hierarchy relationships", {
      as: "permissive",
      for: "insert",
      to: ["public"],
    }),
    pgPolicy("Only SuperAdmin users can update hierarchy relationships", {
      as: "permissive",
      for: "update",
      to: ["public"],
    }),
    pgPolicy(
      "Users can view hierarchy information for themselves and their n",
      { as: "permissive", for: "select", to: ["public"] },
    ),
  ],
);

export const insuranceProductsRelations = relations(
  insuranceProducts,
  ({ one, many }) => ({
    insuranceCompany: one(insuranceCompanies, {
      fields: [insuranceProducts.companyId],
      references: [insuranceCompanies.id],
    }),
    saleItems: many(saleItems),
  }),
);

export const insuranceCompaniesRelations = relations(
  insuranceCompanies,
  ({ many }) => ({
    insuranceProducts: many(insuranceProducts),
  }),
);

export const salesRelations = relations(sales, ({ one, many }) => ({
  users: one(users, {
    fields: [sales.userId],
    references: [users.id],
  }),
  saleItems: many(saleItems),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  sales: many(sales),
  profiles: one(profile),
  userPermissions: many(userPermissions),
  userHierarchies_leaderId: many(userHierarchy, {
    relationName: "userHierarchy_leaderId_users_id",
  }),
  userHierarchies_userId: many(userHierarchy, {
    relationName: "userHierarchy_userId_users_id",
  }),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  users: one(users, {
    fields: [profile.userId],
    references: [users.id],
  }),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  insuranceProduct: one(insuranceProducts, {
    fields: [saleItems.productId],
    references: [insuranceProducts.id],
  }),
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
}));

export const userPermissionsRelations = relations(
  userPermissions,
  ({ one }) => ({
    users: one(users, {
      fields: [userPermissions.userId],
      references: [users.id],
    }),
  }),
);

export const userHierarchyRelations = relations(userHierarchy, ({ one }) => ({
  users_leaderId: one(users, {
    fields: [userHierarchy.leaderId],
    references: [users.id],
    relationName: "userHierarchy_leaderId_users_id",
  }),
  users_userId: one(users, {
    fields: [userHierarchy.userId],
    references: [users.id],
    relationName: "userHierarchy_userId_users_id",
  }),
}));
