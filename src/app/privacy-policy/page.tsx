"use client";

import { Container } from "@/components/layout/container";
import { useLanguage } from "@/i18n/language-context";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "We collect information you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact our customer support. This includes your name, email address, phone number, shipping address, and payment information.",
        "We also automatically collect certain information about your device and browsing behavior, including IP address, browser type, operating system, pages visited, and the dates and times of your visits.",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "We use your personal information to process and fulfill your orders, communicate with you about your orders and our products, provide customer support, personalize your shopping experience, and send marketing communications (with your consent).",
        "We also use aggregated and anonymized data for analytics purposes to improve our products, services, and website performance.",
      ],
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who help us operate our business (such as payment processors, shipping companies, and email service providers), but only to the extent necessary to provide our services.",
        "We may also disclose your information when required by law or to protect our rights, property, or safety.",
      ],
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your personal information, including SSL encryption for data transmission, secure storage of payment information (we never store full card details), and regular security audits.",
        "However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, analyze website traffic, and serve relevant advertisements. You can control cookies through your browser settings.",
        "Essential cookies are necessary for the website to function and cannot be disabled. Analytics cookies help us understand how visitors use our site.",
      ],
    },
    {
      title: "Your Rights",
      content: [
        "You have the right to access, update, or delete your personal information. You can do this through your account dashboard or by contacting us directly. You also have the right to opt-out of marketing communications at any time.",
        "If you wish to delete your account, please contact our support team. Note that we may need to retain certain information for legal or business purposes.",
      ],
    },
    {
      title: "Children's Privacy",
      content: [
        "Our website is not intended for children under 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.",
      ],
    },
    {
      title: "Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.",
      ],
    },
    {
      title: "Contact Us",
      content: [
        "If you have any questions about this Privacy Policy or our data practices, please contact us at info@alrakib.com or call +880 1716-243949.",
      ],
    },
  ];

  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">
          {t("policies.lastUpdated")}
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          {t("policies.privacyTitle")}
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          {t("policies.privacyIntro")}
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
