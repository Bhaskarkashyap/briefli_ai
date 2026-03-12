import { Navbar } from "@/components/ui/Navbar";
import { PricingCard } from "@/components/ui/PricingCard";

const freeFeatures = [
  "3 summaries per day",
  "500 words input limit",
  "Basic summarization",
  "Standard speed",
];

const proFeatures = [
  "Unlimited summaries",
  "10,000 words input limit",
  "Advanced summarization modes",
  "Priority processing",
  "Export to PDF/Docx",
  "API access",
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards through Stripe, including Visa, Mastercard, American Express, and more.",
  },
  {
    question: "Is there a free trial?",
    answer: "Our free tier gives you 3 summaries per day so you can try before you buy. No credit card required.",
  },
  {
    question: "What happens to my summaries if I downgrade?",
    answer: "Your saved summaries will remain accessible. You can still use the summarizer within the free tier limits.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Simple, Transparent Pricing
            </h1>
            <p className="text-text-secondary">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <PricingCard name="Free" price={0} features={freeFeatures} />
            <PricingCard
              name="Pro"
              price={19}
              features={proFeatures}
              isPopular
            />
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-center mb-8"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="card p-6">
                  <h3
                    className="font-semibold mb-2"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    {faq.question}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
