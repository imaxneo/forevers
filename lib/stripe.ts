import Stripe from "stripe";

import { PlanType } from "@/lib/types";

export const PRICES: Record<PlanType, { amount: number; name: string }> = {
  basic: { amount: 900, name: "Love Wall Square - Basic (1 Year)" },
  featured: { amount: 1900, name: "Love Wall Square - Featured (Forever)" },
  vip: { amount: 4900, name: "Love Wall Square - VIP (Forever)" }
};

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil"
    })
  : null;
