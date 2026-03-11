import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "3 summaries per day",
      "500 words input limit",
      "Basic summarization",
      "Standard speed",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited summaries",
      "10,000 words input limit",
      "Advanced summarization modes",
      "Priority processing",
      "Export to PDF/Docx",
      "API access",
    ],
  },
};
