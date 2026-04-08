import { PlanType } from "@/lib/types";

type LemonCheckoutResponse = {
  data?: {
    id: string;
    attributes?: {
      url?: string;
    };
  };
  errors?: Array<{ detail?: string; title?: string }>;
};

const apiKey = process.env.LEMONSQUEEZY_API_KEY;
const storeId = process.env.LEMONSQUEEZY_STORE_ID;

const variantByPlan: Record<PlanType, string | undefined> = {
  basic: process.env.LEMONSQUEEZY_VARIANT_BASIC_ID,
  featured: process.env.LEMONSQUEEZY_VARIANT_FEATURED_ID,
  vip: process.env.LEMONSQUEEZY_VARIANT_VIP_ID
};

export const hasLemonSqueezy = Boolean(apiKey && storeId && variantByPlan.basic && variantByPlan.featured && variantByPlan.vip);

export function getLemonVariantId(plan: PlanType): string | null {
  const value = variantByPlan[plan];
  return value ? String(value) : null;
}

export async function createLemonCheckout({
  plan,
  email,
  name,
  customData,
  redirectUrl
}: {
  plan: PlanType;
  email?: string;
  name?: string;
  customData: Record<string, string>;
  redirectUrl: string;
}): Promise<{ url: string; id: string }> {
  if (!apiKey || !storeId) {
    throw new Error("Lemon Squeezy is not configured.");
  }

  const variantId = getLemonVariantId(plan);
  if (!variantId) {
    throw new Error(`Missing Lemon Squeezy variant for plan "${plan}".`);
  }

  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        product_options: {
          redirect_url: redirectUrl,
          enabled_variants: [Number(variantId)]
        },
        checkout_options: {
          discount: true
        },
        checkout_data: {
          email: email || undefined,
          name: name || undefined,
          custom: customData
        }
      },
      relationships: {
        store: { data: { type: "stores", id: String(storeId) } },
        variant: { data: { type: "variants", id: String(variantId) } }
      }
    }
  };

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as LemonCheckoutResponse;
  if (!response.ok || !data?.data?.attributes?.url) {
    const errorText =
      data?.errors?.[0]?.detail ||
      data?.errors?.[0]?.title ||
      "Could not create Lemon Squeezy checkout.";
    throw new Error(errorText);
  }

  return { url: data.data.attributes.url, id: data.data.id };
}

