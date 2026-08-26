"use client";

import * as React from "react";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 2-5 business days inside Dhaka and 3-7 days outside Dhaka. Express delivery (1-2 days) is available inside Dhaka for an additional charge. Same-day delivery is available for orders placed before 11 AM within Dhaka city limits.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order anytime by visiting our Track Order page and entering your order number.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free shipping on all orders above ৳2000 within Bangladesh. Orders below this amount incur a flat shipping fee of ৳80 (inside Dhaka) or ৳130 (outside Dhaka).",
      },
      {
        q: "Which courier services do you use?",
        a: "We partner with Pathao, SteadFast, RedX, and Sundarban Courier to ensure reliable delivery across Bangladesh. The courier is automatically selected based on your location for fastest delivery.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy. If you're not satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange. Items must be unworn, unwashed, and with original tags attached.",
      },
      {
        q: "How do I initiate a return?",
        a: "To initiate a return, go to your dashboard, find the order, and click 'Request Return'. You can also contact our support team via email or WhatsApp with your order number and reason for return.",
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes, size exchanges are free within the 7-day return window, provided the item is in original condition. Just initiate a return request and specify the size you'd like instead.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed within 3-5 business days after we receive and inspect the returned item. The refund will be credited to your original payment method (bKash, Nagad, bank card) or as store credit.",
      },
    ],
  },
  {
    category: "Products & Sizing",
    items: [
      {
        q: "How do I choose the right size?",
        a: "We provide a detailed size guide on each product page. Click 'Size Guide' link near the size selector to view measurements. If you're between sizes, we recommend sizing up for a more comfortable fit. Our customer support team can also help you choose.",
      },
      {
        q: "Are your products true to size?",
        a: "Most of our products follow standard Bangladeshi sizing. However, fit can vary by product type (regular, slim, tailored). The product description mentions the fit type, and the size guide provides exact measurements.",
      },
      {
        q: "Do you offer custom tailoring?",
        a: "Currently, we don't offer custom tailoring. However, our Premium Collection includes made-to-measure options for select products. Contact us for details.",
      },
      {
        q: "How should I care for my premium ethnic wear?",
        a: "Care instructions vary by fabric. Cotton items can usually be machine washed in cold water. Silk and embroidered pieces should be dry cleaned only. Always check the care label on your garment.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept SSLCommerz (bKash, Nagad, Rocket, and all major bank cards), Stripe (Visa, Mastercard, Amex for international customers), and Cash on Delivery (COD) across Bangladesh.",
      },
      {
        q: "Is Cash on Delivery available?",
        a: "Yes, COD is available across Bangladesh with an additional charge of ৳50. This charge covers the COD handling fee charged by our courier partners.",
      },
      {
        q: "Is it safe to use my credit card on your site?",
        a: "Absolutely. We use industry-standard SSL encryption and partner with trusted payment processors (SSLCommerz, Stripe) that are PCI-DSS compliant. We never store your full card details on our servers.",
      },
      {
        q: "Can I get an invoice for my order?",
        a: "Yes, you can download a PDF invoice for any order from your dashboard under 'My Orders'. The invoice includes all order details and can be used for business expense reporting.",
      },
    ],
  },
  {
    category: "Account & Privacy",
    items: [
      {
        q: "Do I need an account to place an order?",
        a: "No, you can checkout as a guest. However, creating an account gives you benefits like order tracking, faster checkout, wishlist, and exclusive member-only offers.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. The link expires in 1 hour for security reasons.",
      },
      {
        q: "Is my personal information safe?",
        a: "Yes, we take your privacy seriously. We never share your personal information with third parties. Read our Privacy Policy for detailed information on how we handle your data.",
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");

  const categories = ["All", ...faqs.map((f) => f.category)];

  const filteredFaqs = faqs
    .filter((f) => activeCategory === "All" || f.category === activeCategory)
    .map((f) => ({
      ...f,
      items: f.items.filter(
        (item) =>
          !search ||
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((f) => f.items.length > 0);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-muted/20 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <HelpCircle className="h-7 w-7 text-accent" />
            </div>
            <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Find quick answers to common questions. Can&apos;t find what you&apos;re
              looking for? We&apos;re just a message away.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        {/* Search */}
        <div className="mx-auto mb-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="mx-auto max-w-3xl space-y-8">
          {filteredFaqs.map((section) => (
            <div key={section.category}>
              <h2 className="mb-4 font-serif text-xl font-medium text-accent">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {section.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${section.category}-${idx}`}
                    className="rounded-lg border border-border/60 bg-card px-4"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="py-16 text-center">
              <HelpCircle className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium">No matching questions found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different search term or contact us directly.
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-lg bg-muted/30 p-8 text-center">
          <h2 className="font-serif text-2xl font-medium">Still Have Questions?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Our support team is ready to help you with any questions you might have.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/track-order">Track Order</Link>
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
