"use client";

import { Container } from "@/components/layout/container";
import { useLanguage } from "@/i18n/language-context";

export default function TermsPage() {
  const { t } = useLanguage();

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing and using the Rakib Panjabi House website (rakibpanjabihouse.com), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.",
        "These terms apply to all visitors, users, and others who access or use our services.",
      ],
    },
    {
      title: "Products and Pricing",
      content: [
        "We strive to display our products and their colors as accurately as possible. However, we cannot guarantee that your computer monitor's display of any color will be accurate.",
        "All prices are listed in Bangladeshi Taka (BDT) and are subject to change without notice. We reserve the right to modify or discontinue any product at any time.",
        "We make every effort to ensure that product descriptions and pricing are accurate. If an error occurs, we reserve the right to correct it and cancel any affected orders, with a full refund.",
      ],
    },
    {
      title: "Orders and Payments",
      content: [
        "When you place an order, you will receive an order confirmation email. This email confirms receipt of your order, not acceptance of your order.",
        "We reserve the right to refuse or cancel any order at our discretion, including orders that may involve fraud, unauthorized transactions, or violations of these terms.",
        "Payment must be received in full before we ship your order, unless you choose Cash on Delivery (COD). For COD orders, payment must be made in cash at the time of delivery.",
      ],
    },
    {
      title: "Shipping and Delivery",
      content: [
        "We offer shipping across Bangladesh through our partner courier services. Estimated delivery times are provided at checkout but are not guaranteed.",
        "We are not responsible for delays caused by courier services, weather conditions, or other factors beyond our control.",
        "Risk of loss passes to you once the product is delivered to your address. Please inspect your order upon receipt and report any issues within 48 hours.",
      ],
    },
    {
      title: "Returns and Refunds",
      content: [
        "We offer a 7-day return policy for most products. Items must be unworn, unwashed, and in their original condition with tags attached.",
        "Certain items are non-returnable, including undergarments, swimwear, and personalized products. This will be clearly indicated on the product page.",
        "Refunds are processed within 3-5 business days after we receive and inspect the returned item. For more details, please see our Return & Refund Policy.",
      ],
    },
    {
      title: "User Accounts",
      content: [
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.",
        "You must be at least 16 years old to create an account. By creating an account, you represent that you meet this age requirement.",
        "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.",
      ],
    },
    {
      title: "Intellectual Property",
      content: [
        "All content on this website, including text, graphics, logos, images, and software, is the property of Rakib Panjabi House or its content suppliers and is protected by Bangladesh and international copyright laws.",
        "You may not reproduce, distribute, modify, or otherwise use any content from this website without our express written permission.",
      ],
    },
    {
      title: "Limitation of Liability",
      content: [
        "Rakib Panjabi House shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.",
        "Our total liability for any claim arising from your use of our services shall not exceed the amount you paid us for the relevant product or service.",
      ],
    },
    {
      title: "Governing Law",
      content: [
        "These Terms and Conditions are governed by the laws of Bangladesh. Any disputes arising from these terms shall be resolved in the courts of Dhaka, Bangladesh.",
      ],
    },
    {
      title: "Changes to Terms",
      content: [
        "We may update these Terms and Conditions at any time. Any changes will be posted on this page with an updated revision date. Your continued use of the website after changes constitutes acceptance of the new terms.",
      ],
    },
  ];

  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {t("policies.lastUpdated")}
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          {t("policies.termsTitle")}
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          {t("policies.termsIntro")}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="font-serif text-2xl font-medium">
                {idx + 1}. {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.content.map((para, i) => (
                  <p key={i} className="text-base leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          {t("policies.contactForQuestions")}
        </p>
      </div>
    </Container>
  );
}
