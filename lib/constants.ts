import { ActivityItem, SquareRecord, WallStats } from "@/lib/types";

const names = [
  ["Ahmed", "Sara"],
  ["Mohammed", "Lena"],
  ["Omar", "Nour"],
  ["James", "Emma"],
  ["Carlos", "Sofia"],
  ["Youssef", "Aya"],
  ["Khaled", "Mariam"],
  ["Adam", "Jana"],
  ["Hassan", "Dina"],
  ["Rayan", "Salma"],
  ["Noah", "Layla"],
  ["Ethan", "Isla"]
];

const messages = [
  "من أول نظرة عرفت أنك الأجمل ❤️",
  "كل يوم معك هدية من الله",
  "حبيبتي إلى الأبد",
  "Every day with you feels like the beginning.",
  "You are still my favorite hello and my hardest goodbye.",
  "Together, we made ordinary days feel golden."
];

const plans: SquareRecord["plan"][] = ["basic", "featured", "vip"];
const positions = [
  1547, 2341, 3892, 412, 994, 1265, 1780, 2034, 2467, 2790, 3188, 3550, 4014,
  4389, 4621, 4876, 5123, 5499, 5771, 6032, 6450, 6721, 7013, 7344, 7689, 7901,
  8124, 8458, 8702, 8995, 9231, 9510, 9788, 1002, 1333, 1888, 2210, 2674, 3007,
  3446, 3900, 4301, 4777, 5220, 5666, 6111, 6555, 7333, 8222, 9444
];

const photos = [
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516589091380-5d6012cb9c0a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80"
];

export const heroCopy = {
  headline: "Your love, immortalized forever.",
  subline:
    "Reserve a square on The Love Wall, a digital monument where 10,000 couples leave a permanent mark of devotion.",
  cta: "Reserve Your Square ❤️"
};

export const pricing = {
  basic: { label: "Classic", tagline: "Your love, your square", amount: 9, cadence: "/year" },
  featured: {
    label: "Forever",
    tagline: "The most popular choice ⭐",
    amount: 19,
    cadence: "forever"
  },
  vip: {
    label: "Legacy",
    tagline: "The ultimate declaration of love",
    amount: 49,
    cadence: "forever"
  }
} as const;

export const seedSquares: SquareRecord[] = Array.from({ length: 50 }, (_, index) => {
  const [name1, name2] = names[index % names.length];
  const createdAt = new Date(Date.now() - index * 1000 * 60 * 87).toISOString();
  return {
    id: `seed-${index + 1}`,
    grid_position: positions[index],
    name1,
    name2,
    start_date: `20${19 + (index % 6)}-${String((index % 12) + 1).padStart(2, "0")}-${String(
      ((index * 3) % 27) + 1
    ).padStart(2, "0")}`,
    message: messages[index % messages.length],
    photo_url: photos[index % photos.length],
    plan: plans[index % plans.length],
    stripe_session_id: null,
    is_active: true,
    created_at: createdAt,
    expires_at: index % 3 === 0 ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString() : null,
    view_count: 20 + index * 4,
    country_code: ["SA", "DZ", "AE", "FR", "GB", "ES"][index % 6],
    email: undefined
  };
});

export const localSpotlightSquare: SquareRecord = {
  id: "f0f14d7b-27b2-4e1f-ac88-8a57d457c93d",
  grid_position: 5050,
  name1: "Imad",
  name2: "Toha",
  start_date: "2021-05-04",
  message: "يا توحة، أسأل الله دائمًا أن يجمعنا بالحلال وأن تكوني نصيبي في الدنيا والآخرة.",
  photo_url:
    "https://ui-avatars.com/api/?name=I%2BT&background=8b1538&color=ffffff&size=512&bold=true&format=png",
  plan: "featured",
  stripe_session_id: null,
  is_active: true,
  created_at: "2026-04-09T00:00:00.000Z",
  expires_at: null,
  view_count: 0,
  country_code: "DZ",
  email: null
};

export const demoStats: WallStats = {
  total_taken: seedSquares.length + 207,
  total_remaining: 10000 - (seedSquares.length + 207),
  featured_taken: seedSquares.filter((square) => square.plan === "featured").length + 33,
  featured_remaining:
    200 - (seedSquares.filter((square) => square.plan === "featured").length + 33),
  vip_taken: seedSquares.filter((square) => square.plan === "vip").length + 12
};

export const demoActivity: ActivityItem[] = seedSquares.slice(0, 5).map((square) => ({
  id: square.id,
  name1: square.name1,
  name2: square.name2,
  grid_position: square.grid_position,
  country_code: square.country_code,
  created_at: square.created_at
}));
