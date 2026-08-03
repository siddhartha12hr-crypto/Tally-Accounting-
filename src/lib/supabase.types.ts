/**
 * Supabase database types
 * Auto-generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase.types.ts
 *
 * The schema below matches the SQL in database/schema.sql
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          duration: string | null;
          url: string;
          thumbnail: string | null;
          views: number;
          price: string;
          upload_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["videos"]["Row"], "id" | "created_at" | "updated_at" | "views"> & { id?: string; views?: number };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          instructor: string;
          description: string | null;
          duration: string | null;
          lessons: number;
          rating: number;
          students: string;
          thumbnail: string | null;
          category: string;
          price: string;
          video_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["courses"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      movies: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          genre: string;
          rating: number;
          year: string | null;
          duration: string | null;
          language: string | null;
          director: string | null;
          cast: string[] | null;
          poster: string | null;
          video_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["movies"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["movies"]["Insert"]>;
      };
      sports: {
        Row: {
          id: string;
          sport: string;
          team_a: string;
          team_b: string;
          score_a: string | null;
          score_b: string | null;
          status: string;
          is_live: boolean;
          extra_info: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sports"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["sports"]["Insert"]>;
      };
      notes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          thumbnail_url: string | null;
          pdf_url: string;
          tags: string[];
          difficulty: "Beginner" | "Intermediate" | "Advanced";
          reading_time: string | null;
          page_count: number;
          author: string | null;
          status: "published" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notes"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
      };
      app_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: { key: string; value: Json; updated_at?: string };
        Update: Partial<{ value: Json; updated_at: string }>;
      };
      users: {
        Row: {
          id: string;
          full_name: string;
          username: string;
          email: string | null;
          phone: string | null;
          avatar: string | null;
          purchased_courses: string[];
          purchased_videos: string[];
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
