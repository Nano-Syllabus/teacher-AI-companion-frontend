"use client";

import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for trying out NanoSyllabus with one course.",
    features: [
      "1 notebook",
      "Up to 10 resources",
      "50 student questions/month",
      "Public teacher profile",
      "Basic analytics",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Educator",
    price: "12",
    period: "per month",
    description: "Everything a full-time teacher needs for an entire semester.",
    features: [
      "Unlimited notebooks",
      "Unlimited resources",
      "Unlimited student questions",
      "Custom profile URL",
      "Advanced analytics",
      "Priority AI processing",
      "Email support",
    ],
    cta: "Start Educator Plan",
    highlight: true,
  },
  {
    name: "Institution",
    price: "Custom",
    period: "per institution",
    description: "Bring NanoSyllabus to your entire department or university.",
    features: [
      "Everything in Educator",
      "SSO & LMS integration",
      "Bulk teacher onboarding",
      "Dedicated support",
      "Custom branding",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label">Pricing</p>
          <h2 className="heading-lg text-ink mb-5">
            Start free.<br />
            <em>Grow as you teach.</em>
          </h2>
          <p className="body-lg max-w-xl mx-auto">
            No credit card required to get started. Upgrade when your classes grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-ink text-paper shadow-2xl"
                  : "card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-amber-400 text-ink px-4 py-1.5 rounded-full font-body font-semibold text-xs">
                  ✦ Most Popular
                </div>
              )}

              <div className="mb-6">
                <p className={`font-mono text-xs uppercase tracking-widest mb-2 ${plan.highlight ? "text-amber-400" : "text-ink/40"}`}>
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5 mb-3">
                  {plan.price !== "Custom" ? (
                    <>
                      <span className={`font-display text-5xl font-bold ${plan.highlight ? "text-paper" : "text-ink"}`}>
                        ${plan.price}
                      </span>
                      <span className={`font-body text-sm ${plan.highlight ? "text-paper/50" : "text-ink/40"}`}>
                        /{plan.period}
                      </span>
                    </>
                  ) : (
                    <span className={`font-display text-4xl font-bold ${plan.highlight ? "text-paper" : "text-ink"}`}>
                      Custom
                    </span>
                  )}
                </div>
                <p className={`font-body text-sm leading-relaxed ${plan.highlight ? "text-paper/60" : "text-ink/55"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check
                      size={15}
                      className={`flex-shrink-0 mt-0.5 ${plan.highlight ? "text-amber-400" : "text-moss"}`}
                    />
                    <span className={`font-body text-sm ${plan.highlight ? "text-paper/80" : "text-ink/70"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`w-full text-center block py-3.5 rounded-full font-body font-medium text-sm transition-all duration-300 ${
                  plan.highlight
                    ? "bg-amber-400 text-ink hover:bg-amber-300"
                    : "border border-ink/20 text-ink hover:border-ink hover:shadow-md"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}