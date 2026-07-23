export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "starter" | "pro" | "agency";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  plan?: "free" | "starter" | "pro" | "agency";
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
}

export interface UserUpdate {
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  plan?: "free" | "starter" | "pro" | "agency";
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
}

export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceInsert {
  user_id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  primary_color?: string;
  settings?: Record<string, unknown>;
}

export interface WorkspaceUpdate {
  name?: string;
  slug?: string;
  logo_url?: string | null;
  primary_color?: string;
  settings?: Record<string, unknown>;
}

export interface Testimonial {
  id: string;
  workspace_id: string;
  author_name: string;
  author_email: string | null;
  author_image: string | null;
  author_company: string | null;
  author_role: string | null;
  content: string;
  video_url: string | null;
  rating: number | null;
  source: "manual" | "email" | "google" | "twitter" | "import" | null;
  tags: string[];
  ai_summary: string | null;
  ai_topics: string[];
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  metadata: Record<string, unknown>;
  collected_at: string;
  created_at: string;
}

export interface TestimonialInsert {
  workspace_id: string;
  author_name: string;
  author_email?: string | null;
  author_image?: string | null;
  author_company?: string | null;
  author_role?: string | null;
  content: string;
  video_url?: string | null;
  rating?: number | null;
  source?: "manual" | "email" | "google" | "twitter" | "import" | null;
  tags?: string[];
  ai_summary?: string | null;
  ai_topics?: string[];
  status?: "pending" | "approved" | "rejected";
  featured?: boolean;
  metadata?: Record<string, unknown>;
  collected_at?: string;
}

export interface TestimonialUpdate {
  author_name?: string;
  author_email?: string | null;
  author_image?: string | null;
  author_company?: string | null;
  author_role?: string | null;
  content?: string;
  video_url?: string | null;
  rating?: number | null;
  source?: "manual" | "email" | "google" | "twitter" | "import" | null;
  tags?: string[];
  ai_summary?: string | null;
  ai_topics?: string[];
  status?: "pending" | "approved" | "rejected";
  featured?: boolean;
  metadata?: Record<string, unknown>;
}

export interface Widget {
  id: string;
  workspace_id: string;
  name: string;
  type: "grid" | "carousel" | "wall" | "slider" | "minimal" | "masonry";
  config: Record<string, unknown>;
  testimonial_ids: string[];
  embed_code: string | null;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface WidgetInsert {
  workspace_id: string;
  name: string;
  type: "grid" | "carousel" | "wall" | "slider" | "minimal" | "masonry";
  config?: Record<string, unknown>;
  testimonial_ids?: string[];
  embed_code?: string | null;
  views_count?: number;
}

export interface WidgetUpdate {
  name?: string;
  type?: "grid" | "carousel" | "wall" | "slider" | "minimal" | "masonry";
  config?: Record<string, unknown>;
  testimonial_ids?: string[];
  embed_code?: string | null;
  views_count?: number;
}

export interface Collection {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  testimonial_ids: string[];
  share_url: string | null;
  views_count: number;
  created_at: string;
}

export interface CollectionInsert {
  workspace_id: string;
  name: string;
  description?: string | null;
  testimonial_ids?: string[];
  share_url?: string | null;
  views_count?: number;
}

export interface CollectionUpdate {
  name?: string;
  description?: string | null;
  testimonial_ids?: string[];
  share_url?: string | null;
  views_count?: number;
}

export interface CollectionRequest {
  id: string;
  workspace_id: string;
  recipient_email: string;
  recipient_name: string | null;
  status: "pending" | "sent" | "completed" | "expired";
  token: string | null;
  expires_at: string | null;
  created_at: string;
  title: string;
  description: string;
  button_text: string;
  thank_you_message: string;
  brand_color: string;
  field_config: Record<string, any>;
  redirect_url: string | null;
  logo_image: string | null;
  show_powered_by?: boolean;
}

export interface CollectionRequestInsert {
  workspace_id: string;
  recipient_email: string;
  recipient_name?: string | null;
  status?: "pending" | "sent" | "completed" | "expired";
  token?: string | null;
  expires_at?: string | null;
  title?: string;
  description?: string;
  button_text?: string;
  thank_you_message?: string;
  brand_color?: string;
  field_config?: Record<string, any>;
  redirect_url?: string | null;
  logo_image?: string | null;
  show_powered_by?: boolean;
}

export interface CollectionRequestUpdate {
  recipient_email?: string;
  recipient_name?: string | null;
  status?: "pending" | "sent" | "completed" | "expired";
  token?: string | null;
  expires_at?: string | null;
  title?: string;
  description?: string;
  button_text?: string;
  thank_you_message?: string;
  brand_color?: string;
  field_config?: Record<string, any>;
  redirect_url?: string | null;
  logo_image?: string | null;
  show_powered_by?: boolean;
}

export interface CollectWidget {
  id: string;
  workspace_id: string;
  name: string;
  display_type: "floating" | "inline" | "popup";
  position: "bottom-right" | "bottom-left" | "bottom-center";
  trigger: "click" | "scroll" | "exit-intent" | "timed";
  scroll_percent: number;
  delay_seconds: number;
  primary_color: string;
  heading: string;
  description: string;
  placeholder: string;
  thank_you_message: string;
  show_star_rating: boolean;
  show_name: boolean;
  name_required: boolean;
  show_email: boolean;
  email_required: boolean;
  show_company: boolean;
  company_required: boolean;
  show_phone: boolean;
  phone_required: boolean;
  show_video: boolean;
  max_characters: number;
  min_characters: number;
  auto_close_seconds: number;
  show_confetti: boolean;
  show_powered_by: boolean;
  auto_approve_5star: boolean;
  allowed_domains: string[];
  is_active: boolean;
  submission_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollectWidgetInsert {
  workspace_id: string;
  name: string;
  display_type?: "floating" | "inline" | "popup";
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  trigger?: "click" | "scroll" | "exit-intent" | "timed";
  scroll_percent?: number;
  delay_seconds?: number;
  primary_color?: string;
  heading?: string;
  description?: string;
  placeholder?: string;
  thank_you_message?: string;
  show_star_rating?: boolean;
  show_name?: boolean;
  name_required?: boolean;
  show_email?: boolean;
  email_required?: boolean;
  show_company?: boolean;
  company_required?: boolean;
  show_phone?: boolean;
  phone_required?: boolean;
  show_video?: boolean;
  max_characters?: number;
  min_characters?: number;
  auto_close_seconds?: number;
  show_confetti?: boolean;
  show_powered_by?: boolean;
  auto_approve_5star?: boolean;
  allowed_domains?: string[];
  is_active?: boolean;
  submission_count?: number;
}

export interface CollectWidgetUpdate {
  name?: string;
  display_type?: "floating" | "inline" | "popup";
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  trigger?: "click" | "scroll" | "exit-intent" | "timed";
  scroll_percent?: number;
  delay_seconds?: number;
  primary_color?: string;
  heading?: string;
  description?: string;
  placeholder?: string;
  thank_you_message?: string;
  show_star_rating?: boolean;
  show_name?: boolean;
  name_required?: boolean;
  show_email?: boolean;
  email_required?: boolean;
  show_company?: boolean;
  company_required?: boolean;
  show_phone?: boolean;
  phone_required?: boolean;
  show_video?: boolean;
  max_characters?: number;
  min_characters?: number;
  auto_close_seconds?: number;
  show_confetti?: boolean;
  show_powered_by?: boolean;
  auto_approve_5star?: boolean;
  allowed_domains?: string[];
  is_active?: boolean;
}

export interface SubmissionIp {
  id: string;
  workspace_id: string;
  ip_address: string;
  created_at: string;
}

export interface SubmissionIpInsert {
  workspace_id: string;
  ip_address: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      workspaces: {
        Row: Workspace;
        Insert: WorkspaceInsert;
        Update: WorkspaceUpdate;
      };
      testimonials: {
        Row: Testimonial;
        Insert: TestimonialInsert;
        Update: TestimonialUpdate;
      };
      widgets: {
        Row: Widget;
        Insert: WidgetInsert;
        Update: WidgetUpdate;
      };
      collections: {
        Row: Collection;
        Insert: CollectionInsert;
        Update: CollectionUpdate;
      };
      collection_requests: {
        Row: CollectionRequest;
        Insert: CollectionRequestInsert;
        Update: CollectionRequestUpdate;
      };
      collect_widgets: {
        Row: CollectWidget;
        Insert: CollectWidgetInsert;
        Update: CollectWidgetUpdate;
      };
      submission_ips: {
        Row: SubmissionIp;
        Insert: SubmissionIpInsert;
        Update: {};
      };
    };
  };
}
