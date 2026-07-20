import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User, Workspace } from "@/types/database";
import type { PlanType, PlanLimits } from "@/types";

const PLAN_LIMITS_MAP: Record<PlanType, PlanLimits> = {
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
    maxTestimonials: 100,
    maxWidgets: 5,
    maxCollections: 5,
    maxImportSources: 3,
    maxTeamMembers: 3,
    customDomain: true,
    removeBranding: false,
    aiFeatures: true,
    advancedAnalytics: false,
    prioritySupport: false,
    apiAccess: true,
  },
  pro: {
    maxWorkspaces: 10,
    maxTestimonials: 1000,
    maxWidgets: 20,
    maxCollections: 20,
    maxImportSources: 10,
    maxTeamMembers: 10,
    customDomain: true,
    removeBranding: true,
    aiFeatures: true,
    advancedAnalytics: true,
    prioritySupport: true,
    apiAccess: true,
  },
  agency: {
    maxWorkspaces: 50,
    maxTestimonials: 10000,
    maxWidgets: 100,
    maxCollections: 100,
    maxImportSources: 50,
    maxTeamMembers: 50,
    customDomain: true,
    removeBranding: true,
    aiFeatures: true,
    advancedAnalytics: true,
    prioritySupport: true,
    apiAccess: true,
  },
};

export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  return profile;
});

export const getUserProfile = cache(async (): Promise<User | null> => {
  return getUser();
});

export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getCurrentWorkspace(): Promise<Workspace | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  return workspace;
}

export function getPlanLimits(plan: PlanType): PlanLimits {
  return PLAN_LIMITS_MAP[plan];
}

export { PLAN_LIMITS_MAP };
