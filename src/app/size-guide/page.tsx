import { Container } from "@/components/layout/container";

export const metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with our comprehensive size guide for panjabis, shirts, pants, and more.",
};

export default function SizeGuidePage() {
  const sizeCharts = [
    {
      category: "Panjabi / Kurta",
      headers: ["Size", "Chest (inches)", "Length (inches)", "Shoulder (inches)"],
      rows: [
        ["38", "38", "44", "17.5"],
        ["40", "40", "45", "18"],
        ["42", "42", "46", "18.5"],
        ["44", "44", "47", "19"],
        ["46", "46", "48", "19.5"],
      ],
    },
    {
      category: "Shirts",
      headers: ["Size", "Chest (inches)", "Length (inches)", "Shoulder (inches)"],
      rows: [
        ["S", "38", "28", "17"],
        ["M", "40", "29", "17.5"],
        ["L", "42", "30", "18"],
        ["XL", "44", "31", "18.5"],
        ["XXL", "46", "32", "19"],
        ["3XL", "48", "33", "19.5"],
      ],
    },
    {
      category: "Pants / Trousers / Jeans",
      headers: ["Size", "Waist (inches)", "Length (inches)", "Hip (inches)"],
      rows: [
        ["30", "30", "32", "36"],
        ["32", "32", "32", "38"],
        ["34", "34", "34", "40"],
        ["36", "36", "34", "42"],
        ["38", "38", "34", "44"],
        ["40", "40", "34", "46"],
      ],
    },
    {
      category: "Blazers / Jackets",
      headers: ["Size", "Chest (inches)", "Length (inches)", "Sleeve (inches)"],
      rows: [
        ["38", "38", "30", "24.5"],
        ["40", "40", "30.5", "25"],
        ["42", "42", "31", "25.5"],
        ["44", "44", "31.5", "26"],
        ["46", "46", "32", "26.5"],
      ],
    },
  ];

  return (
    <Container className="py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Find Your Perfect Fit
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Size Guide
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Use this guide to find your perfect fit. All measurements are in inches. If
          you&apos;re between sizes, we recommend sizing up for a more comfortable fit.
        </p>

        {/* How to measure */}
        <div className="mt-12 rounded-lg border border-border/60 bg-card p-6">
          <h2 className="font-serif text-2xl font-medium">How to Measure</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold">Chest</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Measure around the fullest part of your chest, keeping the tape level
                under your arms.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Waist</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Measure around your natural waistline, keeping the tape comfortably
                loose.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Length</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Measure from the highest point of your shoulder to the desired hemline.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Shoulder</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Measure from one shoulder edge to the other across your back.
              </p>
            </div>
          </div>
        </div>

        {/* Size charts */}
        <div className="mt-10 space-y-10">
          {sizeCharts.map((chart) => (
            <div key={chart.category}>
              <h2 className="mb-4 font-serif text-2xl font-medium">{chart.category}</h2>
              <div className="overflow-hidden rounded-lg border border-border/60">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {chart.headers.map((header) => (
                          <th
                            key={header}
                            className="p-3 text-left font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {chart.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          {row.map((cell, i) => (
                            <td
                              key={i}
                              className={`p-3 ${i === 0 ? "font-medium" : "text-muted-foreground"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-12 rounded-lg bg-muted/30 p-6">
          <h2 className="font-serif text-2xl font-medium">Fit Tips</h2>
          <ul className="mt-4 space-y-2 text-base text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
              If you&apos;re between sizes, size up for panjabis and kurtas (more comfortable).
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
              For a slim fit, choose your exact size. For a relaxed fit, size up.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
              Sherwanis are typically tailored — check product-specific sizing notes.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
              When in doubt, contact our support team — we&apos;re happy to help!
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
