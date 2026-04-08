export type PlanType = "basic" | "featured" | "vip";

export interface SquareRecord {
  id: string;
  grid_position: number;
  name1: string;
  name2: string;
  start_date: string;
  message: string;
  photo_url: string | null;
  plan: PlanType;
  stripe_session_id: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  view_count: number;
  country_code?: string | null;
  email?: string | null;
}

export interface WallStats {
  total_taken: number;
  total_remaining: number;
  featured_taken: number;
  featured_remaining: number;
  vip_taken: number;
}

export interface ActivityItem {
  id: string;
  name1: string;
  name2: string;
  grid_position: number;
  country_code?: string | null;
  created_at: string;
}

export interface CoupleForm {
  position: number;
  name1: string;
  name2: string;
  start_date: string;
  message: string;
  email?: string;
  photo?: File | null;
  photo_url?: string | null;
  plan: PlanType;
}

export interface ShareCardData {
  id: string;
  photoUrl?: string | null;
  names: string;
  startDate: string;
  message: string;
  gridPosition: number;
}
