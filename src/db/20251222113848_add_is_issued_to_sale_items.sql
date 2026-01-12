-- Add is_issued column to sale_items table
ALTER TABLE "sale_items" ADD COLUMN "is_issued" boolean DEFAULT false NOT NULL;

