// ============================================================
// Enums (string unions for runtime & type safety)
// ============================================================

export type WidgetType =
  | "grid"
  | "carousel"
  | "wall"
  | "slider"
  | "minimal"
  | "masonry";

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type PlanType = "free" | "starter" | "pro" | "agency";

export type RequestStatus = "pending" | "sent" | "completed" | "expired";

export type TestimonialSource =
  | "manual"
  | "email"
  | "google"
  | "twitter"
  | "import";

// ============================================================
// Widget Configuration
// ============================================================

export interface WidgetConfig {
  layout?: {
    columns?: number;
    rows?: number;
    gap?: number;
    maxWidth?: number;
    aspectRatio?: string;
  };
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBackground?: string;
    cardBorderRadius?: number;
    cardPadding?: number;
    cardShadow?: string;
    fontFamily?: string;
    fontSize?: "sm" | "base" | "lg" | "xl";
    showRating?: boolean;
    showDate?: boolean;
    showAuthorImage?: boolean;
    showAuthorCompany?: boolean;
  };
  animation?: {
    autoplay?: boolean;
    interval?: number;
    transition?: "fade" | "slide" | "zoom" | "none";
    speed?: "slow" | "normal" | "fast";
  };
  filter?: {
    minRating?: number;
    tags?: string[];
    featuredOnly?: boolean;
    maxItems?: number;
    sortBy?: "newest" | "oldest" | "highest" | "lowest" | "random";
  };
  cta?: {
    show?: boolean;
    text?: string;
    url?: string;
  };
}

// ============================================================
// Plan Limits
// ============================================================

export interface PlanLimits {
  maxWorkspaces: number;
  maxTestimonials: number;
  maxWidgets: number;
  maxCollections: number;
  maxImportSources: number;
  maxTeamMembers: number;
  customDomain: boolean;
  removeBranding: boolean;
  aiFeatures: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxWorkspaces: 1,
    maxTestimonials: 10,
    maxWidgets: 1,
    maxCollections: 1,
    maxImportSources: 1,
    maxTeamMembers: 1,
    customDomain: false,
    removeBranding: false,
    aiFeatures: false,
    advancedAnalytics: false,
    prioritySupport: false,
    apiAccess: false,
  },
  starter: {
    maxWorkspaces: 3,
    maxTestimonials: 2500,
    maxWidgets: 20,
    maxCollections: 20,
    maxImportSources: 10,
    maxTeamMembers: 3,
    customDomain: false,
    removeBranding: false,
    aiFeatures: true,
    advancedAnalytics: false,
    prioritySupport: false,
    apiAccess: false,
  },
  pro: {
    maxWorkspaces: 15,
    maxTestimonials: 25000,
    maxWidgets: 100,
    maxCollections: 100,
    maxImportSources: 50,
    maxTeamMembers: 15,
    customDomain: false,
    removeBranding: true,
    aiFeatures: true,
    advancedAnalytics: true,
    prioritySupport: true,
    apiAccess: false,
  },
  agency: {
    maxWorkspaces: 15,
    maxTestimonials: 25000,
    maxWidgets: 100,
    maxCollections: 100,
    maxImportSources: 50,
    maxTeamMembers: 15,
    customDomain: false,
    removeBranding: true,
    aiFeatures: true,
    advancedAnalytics: true,
    prioritySupport: true,
    apiAccess: false,
  },
};

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface WidgetEmbedData {
  widget: {
    id: string;
    type: WidgetType;
    config: WidgetConfig;
    testimonial_ids: string[];
  };
  testimonials: Record<string, import("./database").Testimonial>;
  workspace: {
    name: string;
    primary_color: string;
    logo_url: string | null;
  };
}

export interface AiTagResult {
  suggestedTags: string[];
  summary: string;
  topics: string[];
  sentiment: "positive" | "neutral" | "negative";
}

export interface ImportResult {
  imported: number;
  failed: number;
  errors: { row: number; reason: string }[];
}

// ============================================================
// Re-exports
// ============================================================

export type {
  User,
  UserInsert,
  UserUpdate,
  Workspace,
  WorkspaceInsert,
  WorkspaceUpdate,
  Testimonial,
  TestimonialInsert,
  TestimonialUpdate,
  Widget,
  WidgetInsert,
  WidgetUpdate,
  Collection,
  CollectionInsert,
  CollectionUpdate,
  CollectionRequest,
  CollectionRequestInsert,
  CollectionRequestUpdate,
  CollectWidget,
  CollectWidgetInsert,
  CollectWidgetUpdate,
  SubmissionIp,
  SubmissionIpInsert,
  Database,
} from "./database";
