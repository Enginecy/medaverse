export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      insurance_companies: {
        Row: {
          code: string;
          created_at: string | null;
          deleted_at: string | null;
          email: string | null;
          id: string;
          name: string;
          phone: string | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id: string;
          name: string;
          phone?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string;
          phone?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      insurance_products: {
        Row: {
          company_id: string;
          coverage_amount: number | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          name: string;
          premium_amount: number;
          premium_frequency:
            | Database["public"]["Enums"]["premium_frequency"]
            | null;
          product_code: string;
          status: Database["public"]["Enums"]["status"] | null;
          term_years: number | null;
          updated_at: string | null;
        };
        Insert: {
          company_id: string;
          coverage_amount?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id: string;
          name: string;
          premium_amount: number;
          premium_frequency?:
            | Database["public"]["Enums"]["premium_frequency"]
            | null;
          product_code: string;
          status?: Database["public"]["Enums"]["status"] | null;
          term_years?: number | null;
          updated_at?: string | null;
        };
        Update: {
          company_id?: string;
          coverage_amount?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          premium_amount?: number;
          premium_frequency?:
            | Database["public"]["Enums"]["premium_frequency"]
            | null;
          product_code?: string;
          status?: Database["public"]["Enums"]["status"] | null;
          term_years?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "insurance_products_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "insurance_companies";
            referencedColumns: ["id"];
          },
        ];
      };
      profile: {
        Row: {
          address: string | null;
          created_at: string | null;
          deleted_at: string | null;
          dob: string | null;
          id: string;
          name: string | null;
          role: Database["public"]["Enums"]["title"] | null;
          status: Database["public"]["Enums"]["status"] | null;
          updated_at: string | null;
          user_id: string | null;
          username: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          dob?: string | null;
          id: string;
          name?: string | null;
          role?: Database["public"]["Enums"]["title"] | null;
          status?: Database["public"]["Enums"]["status"] | null;
          updated_at?: string | null;
          user_id?: string | null;
          username?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          dob?: string | null;
          id?: string;
          name?: string | null;
          role?: Database["public"]["Enums"]["title"] | null;
          status?: Database["public"]["Enums"]["status"] | null;
          updated_at?: string | null;
          user_id?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      sale_items: {
        Row: {
          commission_amount: number | null;
          commission_rate: number | null;
          coverage_amount: number | null;
          created_at: string | null;
          deleted_at: string | null;
          id: string;
          insured_person_name: string;
          notes: string | null;
          policy_end_date: string | null;
          policy_number: string;
          policy_start_date: string;
          premium_amount: number;
          product_id: string;
          relationship: string | null;
          sale_id: string;
          updated_at: string | null;
        };
        Insert: {
          commission_amount?: number | null;
          commission_rate?: number | null;
          coverage_amount?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id: string;
          insured_person_name: string;
          notes?: string | null;
          policy_end_date?: string | null;
          policy_number: string;
          policy_start_date: string;
          premium_amount: number;
          product_id: string;
          relationship?: string | null;
          sale_id: string;
          updated_at?: string | null;
        };
        Update: {
          commission_amount?: number | null;
          commission_rate?: number | null;
          coverage_amount?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          insured_person_name?: string;
          notes?: string | null;
          policy_end_date?: string | null;
          policy_number?: string;
          policy_start_date?: string;
          premium_amount?: number;
          product_id?: string;
          relationship?: string | null;
          sale_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "insurance_products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey";
            columns: ["sale_id"];
            isOneToOne: false;
            referencedRelation: "sales";
            referencedColumns: ["id"];
          },
        ];
      };
      sales: {
        Row: {
          created_at: string | null;
          customer_name: string;
          deleted_at: string | null;
          id: string;
          notes: string | null;
          payment_frequency: string | null;
          sale_date: string;
          total_commission_amount: number | null;
          total_sale_value: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          customer_name: string;
          deleted_at?: string | null;
          id: string;
          notes?: string | null;
          payment_frequency?: string | null;
          sale_date?: string;
          total_commission_amount?: number | null;
          total_sale_value?: number | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          customer_name?: string;
          deleted_at?: string | null;
          id?: string;
          notes?: string | null;
          payment_frequency?: string | null;
          sale_date?: string;
          total_commission_amount?: number | null;
          total_sale_value?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_hierarchy: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          division: string | null;
          id: string;
          leader_id: string | null;
          region: string | null;
          status: Database["public"]["Enums"]["status"] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          division?: string | null;
          id: string;
          leader_id?: string | null;
          region?: string | null;
          status?: Database["public"]["Enums"]["status"] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          division?: string | null;
          id?: string;
          leader_id?: string | null;
          region?: string | null;
          status?: Database["public"]["Enums"]["status"] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user_permissions: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          id: string;
          permission_description: string | null;
          permission_name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          id: string;
          permission_description?: string | null;
          permission_name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          id?: string;
          permission_description?: string | null;
          permission_name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      getcurrentuserprofile: {
        Args: Record<PropertyKey, never>;
        Returns: {
          user_id: string;
          role: Database["public"]["Enums"]["title"];
          status: Database["public"]["Enums"]["status"];
        }[];
      };
      issuperadmin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      isuserleader: {
        Args: { target_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      payment_status: "pending" | "paid" | "overdue" | "cancelled" | "refunded";
      premium_frequency: "monthly" | "quarterly" | "annually";
      status: "active" | "disabled" | "delete";
      title:
        | "SuperAdmin"
        | "NationalDirector"
        | "RegionalDirector"
        | "DivisionalDirector"
        | "AssociateDirector"
        | "PlatinumAssociate"
        | "SeniorAssociate"
        | "Associate"
        | "Leads";
    };
    CompositeTypes: Record<string, never>;
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      payment_status: ["pending", "paid", "overdue", "cancelled", "refunded"],
      premium_frequency: ["monthly", "quarterly", "annually"],
      status: ["active", "disabled", "delete"],
      title: [
        "SuperAdmin",
        "NationalDirector",
        "RegionalDirector",
        "DivisionalDirector",
        "AssociateDirector",
        "PlatinumAssociate",
        "SeniorAssociate",
        "Associate",
        "Leads",
      ],
    },
  },
} as const;
