export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      communes: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          name_ar: string
          name_ascii: string
          wilaya_code: string
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean
          name_ar: string
          name_ascii: string
          wilaya_code: string
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean
          name_ar?: string
          name_ascii?: string
          wilaya_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "communes_wilaya_code_fkey"
            columns: ["wilaya_code"]
            isOneToOne: false
            referencedRelation: "wilayas"
            referencedColumns: ["code"]
          },
        ]
      }
      hero_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          is_active: boolean
          sort_order: number
          storage_path: string
          variant: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          storage_path: string
          variant?: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          storage_path?: string
          variant?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          commune: string | null
          created_at: string
          delivery_type: string | null
          full_name: string
          id: string
          landing_variant: string
          phone: string
          product_price: number | null
          shipping_price: number | null
          total: number | null
          wilaya: string
          wilaya_code: string | null
        }
        Insert: {
          address: string
          commune?: string | null
          created_at?: string
          delivery_type?: string | null
          full_name: string
          id?: string
          landing_variant?: string
          phone: string
          product_price?: number | null
          shipping_price?: number | null
          total?: number | null
          wilaya: string
          wilaya_code?: string | null
        }
        Update: {
          address?: string
          commune?: string | null
          created_at?: string
          delivery_type?: string | null
          full_name?: string
          id?: string
          landing_variant?: string
          phone?: string
          product_price?: number | null
          shipping_price?: number | null
          total?: number | null
          wilaya?: string
          wilaya_code?: string | null
        }
        Relationships: []
      }
      shipping_fees: {
        Row: {
          home_price: number
          is_active: boolean
          stopdesk_price: number
          updated_at: string
          wilaya_code: string
        }
        Insert: {
          home_price?: number
          is_active?: boolean
          stopdesk_price?: number
          updated_at?: string
          wilaya_code: string
        }
        Update: {
          home_price?: number
          is_active?: boolean
          stopdesk_price?: number
          updated_at?: string
          wilaya_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_fees_wilaya_code_fkey"
            columns: ["wilaya_code"]
            isOneToOne: true
            referencedRelation: "wilayas"
            referencedColumns: ["code"]
          },
        ]
      }
      wilayas: {
        Row: {
          code: string
          is_active: boolean
          name_ar: string
          name_ascii: string
        }
        Insert: {
          code: string
          is_active?: boolean
          name_ar: string
          name_ascii: string
        }
        Update: {
          code?: string
          is_active?: boolean
          name_ar?: string
          name_ascii?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
