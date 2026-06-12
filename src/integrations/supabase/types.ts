export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artists: {
        Row: {
          bio_en: string | null
          bio_fa: string | null
          bio_fr: string | null
          contact_email: string | null
          country: string | null
          created_at: string
          display_name: string
          id: string
          is_featured: boolean
          is_published: boolean
          languages: string[]
          profile_image_path: string | null
          slug: string
          socials: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio_en?: string | null
          bio_fa?: string | null
          bio_fr?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          languages?: string[]
          profile_image_path?: string | null
          slug: string
          socials?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio_en?: string | null
          bio_fa?: string | null
          bio_fr?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          languages?: string[]
          profile_image_path?: string | null
          slug?: string
          socials?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      artwork_categories: {
        Row: {
          artwork_id: string
          category_id: string
        }
        Insert: {
          artwork_id: string
          category_id: string
        }
        Update: {
          artwork_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_categories_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_themes: {
        Row: {
          artwork_id: string
          theme_id: string
        }
        Insert: {
          artwork_id: string
          theme_id: string
        }
        Update: {
          artwork_id?: string
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_themes_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      artworks: {
        Row: {
          artist_id: string
          created_at: string
          created_by: string | null
          description_en: string | null
          description_fa: string | null
          description_fr: string | null
          hall: Database["public"]["Enums"]["hall_kind"]
          id: string
          image_paths: Json
          is_featured: boolean
          is_published: boolean
          medium: string | null
          search_tsv: unknown
          slug: string
          tags: string[]
          title_en: string
          title_fa: string | null
          title_fr: string | null
          updated_at: string
          video_provider: string | null
          video_url: string | null
          year: number | null
        }
        Insert: {
          artist_id: string
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          hall: Database["public"]["Enums"]["hall_kind"]
          id?: string
          image_paths?: Json
          is_featured?: boolean
          is_published?: boolean
          medium?: string | null
          search_tsv?: unknown
          slug: string
          tags?: string[]
          title_en: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
          video_provider?: string | null
          video_url?: string | null
          year?: number | null
        }
        Update: {
          artist_id?: string
          created_at?: string
          created_by?: string | null
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          hall?: Database["public"]["Enums"]["hall_kind"]
          id?: string
          image_paths?: Json
          is_featured?: boolean
          is_published?: boolean
          medium?: string | null
          search_tsv?: unknown
          slug?: string
          tags?: string[]
          title_en?: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
          video_provider?: string | null
          video_url?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "artworks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          hall: Database["public"]["Enums"]["hall_kind"]
          id: string
          name_en: string
          name_fa: string | null
          name_fr: string | null
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          hall: Database["public"]["Enums"]["hall_kind"]
          id?: string
          name_en: string
          name_fa?: string | null
          name_fr?: string | null
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          hall?: Database["public"]["Enums"]["hall_kind"]
          id?: string
          name_en?: string
          name_fa?: string | null
          name_fr?: string | null
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_artworks: {
        Row: {
          artwork_id: string
          collection_id: string
          position: number
        }
        Insert: {
          artwork_id: string
          collection_id: string
          position?: number
        }
        Update: {
          artwork_id?: string
          collection_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_artworks_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_artworks_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_image_path: string | null
          created_at: string
          curator_id: string | null
          description_en: string | null
          description_fa: string | null
          description_fr: string | null
          id: string
          is_published: boolean
          slug: string
          title_en: string
          title_fa: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          cover_image_path?: string | null
          created_at?: string
          curator_id?: string | null
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          id?: string
          is_published?: boolean
          slug: string
          title_en: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          cover_image_path?: string | null
          created_at?: string
          curator_id?: string | null
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          title_en?: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description_en: string | null
          description_fa: string | null
          description_fr: string | null
          ends_at: string | null
          hero_image_path: string | null
          id: string
          is_published: boolean
          location: string | null
          slug: string
          starts_at: string
          title_en: string
          title_fa: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          ends_at?: string | null
          hero_image_path?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          slug: string
          starts_at: string
          title_en: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          ends_at?: string | null
          hero_image_path?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          slug?: string
          starts_at?: string
          title_en?: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      exhibition_artworks: {
        Row: {
          artwork_id: string
          exhibition_id: string
          position: number
        }
        Insert: {
          artwork_id: string
          exhibition_id: string
          position?: number
        }
        Update: {
          artwork_id?: string
          exhibition_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "exhibition_artworks_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "artworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exhibition_artworks_exhibition_id_fkey"
            columns: ["exhibition_id"]
            isOneToOne: false
            referencedRelation: "exhibitions"
            referencedColumns: ["id"]
          },
        ]
      }
      exhibitions: {
        Row: {
          created_at: string
          curator_id: string | null
          description_en: string | null
          description_fa: string | null
          description_fr: string | null
          ends_at: string | null
          hall: Database["public"]["Enums"]["hall_kind"]
          hero_image_path: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          slug: string
          starts_at: string | null
          title_en: string
          title_fa: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          curator_id?: string | null
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          ends_at?: string | null
          hall: Database["public"]["Enums"]["hall_kind"]
          hero_image_path?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          slug: string
          starts_at?: string | null
          title_en: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          curator_id?: string | null
          description_en?: string | null
          description_fa?: string | null
          description_fr?: string | null
          ends_at?: string | null
          hall?: Database["public"]["Enums"]["hall_kind"]
          hero_image_path?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          slug?: string
          starts_at?: string | null
          title_en?: string
          title_fa?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          confirmation_token: string
          confirmed: boolean
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
        }
        Insert: {
          confirmation_token: string
          confirmed?: boolean
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          confirmation_token?: string
          confirmed?: boolean
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          created_at: string
          id: string
          name_en: string
          name_fa: string | null
          name_fr: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_en: string
          name_fa?: string | null
          name_fr?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name_en?: string
          name_fa?: string | null
          name_fr?: string | null
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "visitor" | "artist" | "curator" | "admin"
      hall_kind:
        | "painting"
        | "sculpture"
        | "photography"
        | "architecture"
        | "poetry"
        | "craft"
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
    Enums: {
      app_role: ["visitor", "artist", "curator", "admin"],
      hall_kind: [
        "painting",
        "sculpture",
        "photography",
        "architecture",
        "poetry",
        "craft",
      ],
    },
  },
} as const
