import { Container } from "@/components/layout/container";
import { Truck, MapPin, Clock, Package } from "lucide-react";

export const metadata = {
  title: "Shipping Policy",
  description: "Learn about our shipping methods, delivery times, and shipping charges at Rakib Panjabi House.",
};

export default function ShippingPolicyPage() {
  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Last Updated: August 2026
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Shipping Policy
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          We ship across Bangladesh with reliable courier partners. Here&apos;s everything
          you need to know about our shipping options.
        </p>

        <div className="mt-12 space-y-10">
          {/* Shipping options */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Shipping Methods</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Standard Delivery</h3>
                    <p className="text-xs text-muted-foreground">
                      1 day (Dhaka) · 1-3 days (Outside Dhaka)
                    </p>
                  </div>
                  <p className="text-sm font-medium">৳80-130</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Free for orders above ৳2000. Our most economical option.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Express Delivery</h3>
                    <p className="text-xs text-muted-foreground">
                      1-2 business days (Dhaka only)
                    </p>
                  </div>
                  <p className="text-sm font-medium">+৳50</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Faster delivery within Dhaka city for urgent orders.
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">Same-Day Delivery</h3>
                    <p className="text-xs text-muted-foreground">
                      Order before 11 AM (Dhaka only)
                    </p>
                  </div>
                  <p className="text-sm font-medium">+৳100</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Get your order delivered the same day within Dhaka city limits.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping charges */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Shipping Charges</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Location</th>
                    <th className="p-3 text-center font-medium">Order Value</th>
                    <th className="p-3 text-right font-medium">Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="p-3">Inside Dhaka</td>
                    <td className="p-3 text-center">Below ৳2000</td>
                    <td className="p-3 text-right font-medium">৳80</td>
                  </tr>
                  <tr>
                    <td className="p-3">Inside Dhaka</td>
                    <td className="p-3 text-center">Above ৳2000</td>
                    <td className="p-3 text-right font-medium text-accent">FREE</td>
                  </tr>
                  <tr>
                    <td className="p-3">Outside Dhaka</td>
                    <td className="p-3 text-center">Below ৳2000</td>
                    <td className="p-3 text-right font-medium">৳130</td>
                  </tr>
                  <tr>
                    <td className="p-3">Outside Dhaka</td>
                    <td className="p-3 text-center">Above ৳2000</td>
                    <td className="p-3 text-right font-medium text-accent">FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Courier partners */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Our Courier Partners</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Pathao", "SteadFast", "RedX", "Sundarban"].map((courier) => (
                <div
                  key={courier}
                  className="flex flex-col items-center justify-center rounded-lg border border-border/60 bg-card p-4"
                >
                  <Truck className="mb-2 h-6 w-6 text-accent" />
                  <p className="text-sm font-medium">{courier}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order processing */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Order Processing Time</h2>
            <ul className="mt-4 space-y-2 text-base text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                Orders are processed within 24 hours (excluding weekends and holidays)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                Orders placed after 5 PM will be processed the next business day
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                Pre-order items will be shipped once they become available
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                You&apos;ll receive a tracking number via email and SMS once shipped
              </li>
            </ul>
          </div>

          {/* Delivery areas */}
          <div>
            <h2 className="font-serif text-2xl font-medium">Delivery Coverage</h2>
            <p className="mt-3 text-base text-muted-foreground">
              We deliver to all 64 districts of Bangladesh. Some remote areas may have
              longer delivery times. If you&apos;re unsure about delivery to your area,
              please contact us before placing your order.
            </p>
          </div>

          {/* International shipping */}
          <div className="rounded-lg bg-muted/30 p-6">
            <h2 className="font-serif text-2xl font-medium">International Shipping</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Currently, we only ship within Bangladesh. We&apos;re working on expanding to
              international destinations — stay tuned for updates! In the meantime,
              international customers can contact us directly for special arrangements.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-lg bg-primary p-6 text-center text-primary-foreground">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-accent" />
            <h2 className="font-serif text-xl font-medium">Shipping Questions?</h2>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Contact our support team for any shipping-related inquiries.
            </p>
            <p className="mt-3 text-sm font-medium">
              Email: info@alrakib.com · Phone: +880 1716-243949
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
