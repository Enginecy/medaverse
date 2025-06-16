-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'overdue', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."premium_frequency" AS ENUM('monthly', 'quarterly', 'annually');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'disabled', 'delete');--> statement-breakpoint
CREATE TYPE "public"."title" AS ENUM('SuperAdmin', 'NationalDirector', 'RegionalDirector', 'DivisionalDirector', 'AssociateDirector', 'PlatinumAssociate', 'SeniorAssociate', 'Associate', 'Leads');--> statement-breakpoint
CREATE TABLE "insurance_products" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"product_code" varchar(50) NOT NULL,
	"description" text,
	"coverage_amount" numeric(15, 2),
	"premium_amount" numeric(10, 2) NOT NULL,
	"premium_frequency" "premium_frequency" DEFAULT 'monthly',
	"term_years" integer,
	"status" "status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "insurance_products_product_code_key" UNIQUE("product_code")
);
--> statement-breakpoint
ALTER TABLE "insurance_products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"sale_date" date DEFAULT now() NOT NULL,
	"total_commission_amount" numeric(10, 2),
	"payment_frequency" varchar(20) DEFAULT 'monthly',
	"total_sale_value" numeric(15, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "sales" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"username" varchar,
	"status" "status",
	"name" varchar,
	"address" varchar,
	"dob" timestamp,
	"role" "title",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"avatar_url" text,
	CONSTRAINT "profile_username_key" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "insurance_companies" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(10) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"website" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "insurance_companies_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "insurance_companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sale_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sale_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"insured_person_name" varchar(255) NOT NULL,
	"relationship" varchar(50),
	"premium_amount" numeric(10, 2) NOT NULL,
	"commission_rate" numeric(5, 2),
	"commission_amount" numeric(10, 2),
	"policy_number" varchar(100) NOT NULL,
	"policy_start_date" date NOT NULL,
	"policy_end_date" date,
	"coverage_amount" numeric(15, 2),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "sale_items_policy_number_key" UNIQUE("policy_number")
);
--> statement-breakpoint
ALTER TABLE "sale_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_permissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"permission_name" varchar(100) NOT NULL,
	"permission_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_hierarchy" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"leader_id" uuid,
	"region" varchar(100),
	"division" varchar(100),
	"status" "status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user_hierarchy" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "insurance_products" ADD CONSTRAINT "insurance_products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."insurance_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."insurance_products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_hierarchy" ADD CONSTRAINT "user_hierarchy_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_hierarchy" ADD CONSTRAINT "user_hierarchy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_sales_user_id" ON "sales" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_profile_role_status" ON "profile" USING btree ("role" enum_ops,"status" enum_ops) WHERE (deleted_at IS NULL);--> statement-breakpoint
CREATE INDEX "idx_profile_user_id" ON "profile" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_sale_items_sale_id" ON "sale_items" USING btree ("sale_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_hierarchy_leader_id" ON "user_hierarchy" USING btree ("leader_id" uuid_ops) WHERE ((status = 'active'::status) AND (deleted_at IS NULL));--> statement-breakpoint
CREATE INDEX "idx_user_hierarchy_user_id" ON "user_hierarchy" USING btree ("user_id" uuid_ops) WHERE ((status = 'active'::status) AND (deleted_at IS NULL));--> statement-breakpoint
CREATE POLICY "All active users can view active insurance products" ON "insurance_products" AS PERMISSIVE FOR SELECT TO public USING (((EXISTS ( SELECT 1
   FROM profile
  WHERE ((profile.user_id = auth.uid()) AND (profile.status = 'active'::status) AND (profile.deleted_at IS NULL)))) AND ((status = 'active'::status) OR issuperadmin())));--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can delete insurance products" ON "insurance_products" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can insert new insurance products" ON "insurance_products" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can update insurance products" ON "insurance_products" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can delete sales" ON "sales" AS PERMISSIVE FOR DELETE TO public USING (issuperadmin());--> statement-breakpoint
CREATE POLICY "Users can only create sales for themselves" ON "sales" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update their own sales, leaders can update subordinat" ON "sales" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own sales and sales of their subordinates" ON "sales" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can insert new profiles" ON "profile" AS PERMISSIVE FOR INSERT TO public WITH CHECK (issuperadmin());--> statement-breakpoint
CREATE POLICY "Users can only update their own profile, leaders can update sub" ON "profile" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own profile and profiles of their subordin" ON "profile" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "All active users can view insurance companies" ON "insurance_companies" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM profile
  WHERE ((profile.user_id = auth.uid()) AND (profile.status = 'active'::status) AND (profile.deleted_at IS NULL)))));--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can delete insurance companies" ON "insurance_companies" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can insert new insurance companies" ON "insurance_companies" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can update insurance companies" ON "insurance_companies" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can delete sale items" ON "sale_items" AS PERMISSIVE FOR DELETE TO public USING (issuperadmin());--> statement-breakpoint
CREATE POLICY "Users can insert sale items for their own sales" ON "sale_items" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can update sale items for their own sales, leaders for su" ON "sale_items" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view sale items for sales they have access to" ON "sale_items" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can delete permissions" ON "user_permissions" AS PERMISSIVE FOR DELETE TO public USING (issuperadmin());--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can insert new permissions" ON "user_permissions" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can update permissions" ON "user_permissions" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own permissions, leaders can view subordin" ON "user_permissions" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can delete hierarchy relationships" ON "user_hierarchy" AS PERMISSIVE FOR DELETE TO public USING (issuperadmin());--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can insert new hierarchy relationships" ON "user_hierarchy" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Only SuperAdmin users can update hierarchy relationships" ON "user_hierarchy" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can view hierarchy information for themselves and their n" ON "user_hierarchy" AS PERMISSIVE FOR SELECT TO public;
*/