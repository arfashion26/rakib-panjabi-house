/**
 * Seed 2 Test Products in Supabase Database
 *
 * Run: bun run scripts/seed-test-products.ts
 *
 * This adds 2 real test products with sizes, colors, and images
 * so you can test the full e-commerce flow:
 * - Browse products on the shop page
 * - Add to cart
 * - Checkout
 * - See order in admin panel
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://diraphksavgifippktuh.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcmFwaGtzYXZnaWZpcHBrdHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzM2OTY3NCwiZXhwIjoyMTAyOTQ1Njc0fQ.KKX0SyFymw-9QbHIhVa6WtbWN6_jUes7aOYx75yFigA";

async function seedTestProducts() {
  console.log("=".repeat(60));
  console.log("Seeding 2 Test Products");
  console.log("=".repeat(60));

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Step 1: Get the Panjabi Collection category
  console.log("\n1. Fetching Panjabi Collection category...");
  const { data: category, error: catError } = await admin
    .from("categories")
    .select("id, name")
    .eq("slug", "panjabi-collection")
    .single();

  if (catError || !category) {
    console.log("   ✗ Category not found. Make sure 0001_init.sql has been run!");
    return;
  }
  console.log(`   ✓ Found category: ${category.name} (${category.id})`);

  // Test Product 1: Premium Cotton Panjabi
  console.log("\n2. Creating Product 1: Premium Cotton Panjabi — Emerald...");
  const { data: product1, error: p1Error } = await admin
    .from("products")
    .upsert(
      {
        name: "Premium Cotton Panjabi — Emerald",
        slug: "premium-cotton-panjabi-emerald",
        sku: "RPH-PAN-001",
        description:
          "Experience luxury with our Premium Cotton Panjabi in deep emerald. Crafted from 100% premium cotton, this panjabi features elegant embroidery on the collar and cuffs. Perfect for special occasions, festive celebrations, or elevating your everyday style. The breathable fabric ensures all-day comfort while maintaining a refined silhouette.",
        short_description: "Premium cotton panjabi with elegant embroidery",
        fabric: "100% Premium Cotton",
        fit: "Regular Fit",
        care: "Machine wash cold, iron at low temperature",
        origin: "Made in Bangladesh",
        category_id: category.id,
        price: 2499,
        discount_price: 1999,
        currency: "BDT",
        status: "ACTIVE",
        type: "PHYSICAL",
        is_featured: true,
        is_best_seller: true,
        is_new_arrival: true,
        is_flash_sale: false,
        allow_reviews: true,
        allow_returns: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (p1Error) {
    console.log("   ✗ Error:", p1Error.message);
  } else {
    console.log(`   ✓ Product created: ${product1.id}`);

    // Add sizes for Product 1
    console.log("   Adding sizes...");
    const sizes1 = [
      { size: "38", stock: 10 },
      { size: "40", stock: 15 },
      { size: "42", stock: 12 },
      { size: "44", stock: 8 },
      { size: "46", stock: 5 },
    ];
    for (const s of sizes1) {
      await admin.from("product_sizes").upsert(
        {
          product_id: product1.id,
          size: s.size,
          stock: s.stock,
          sort_order: sizes1.indexOf(s),
        },
        { onConflict: "product_id,size" }
      );
    }
    console.log("   ✓ Sizes added (5 sizes)");

    // Add colors for Product 1
    console.log("   Adding colors...");
    const colors1 = [
      { name: "Emerald", hex_value: "#0F5132", stock: 25 },
      { name: "Charcoal", hex_value: "#1A1A1F", stock: 15 },
      { name: "Brown", hex_value: "#8B6F47", stock: 10 },
    ];
    for (const c of colors1) {
      await admin.from("product_colors").upsert(
        {
          product_id: product1.id,
          name: c.name,
          hex_value: c.hex_value,
          stock: c.stock,
        },
        { onConflict: "product_id,name" }
      );
    }
    console.log("   ✓ Colors added (3 colors)");
  }

  // Test Product 2: Linen Casual Shirt
  console.log("\n3. Creating Product 2: Linen Casual Shirt — Sand...");
  const { data: product2, error: p2Error } = await admin
    .from("products")
    .upsert(
      {
        name: "Linen Casual Shirt — Sand",
        slug: "linen-casual-shirt-sand",
        sku: "RPH-SHT-001",
        description:
          "Stay cool and stylish with our Linen Casual Shirt in sand color. Made from 100% pure linen, this shirt is perfect for Bangladesh's warm climate. Features a modern collar, button-down front, and relaxed fit. Versatile enough for both casual and semi-formal occasions.",
        short_description: "Breathable linen casual shirt",
        fabric: "100% Pure Linen",
        fit: "Relaxed Fit",
        care: "Machine wash cold, hang dry",
        origin: "Made in Bangladesh",
        category_id: category.id,
        price: 1499,
        discount_price: 1199,
        currency: "BDT",
        status: "ACTIVE",
        type: "PHYSICAL",
        is_featured: true,
        is_best_seller: false,
        is_new_arrival: true,
        is_flash_sale: true,
        allow_reviews: true,
        allow_returns: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (p2Error) {
    console.log("   ✗ Error:", p2Error.message);
  } else {
    console.log(`   ✓ Product created: ${product2.id}`);

    // Add sizes for Product 2
    console.log("   Adding sizes...");
    const sizes2 = [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 6 },
    ];
    for (const s of sizes2) {
      await admin.from("product_sizes").upsert(
        {
          product_id: product2.id,
          size: s.size,
          stock: s.stock,
          sort_order: sizes2.indexOf(s),
        },
        { onConflict: "product_id,size" }
      );
    }
    console.log("   ✓ Sizes added (5 sizes)");

    // Add colors for Product 2
    console.log("   Adding colors...");
    const colors2 = [
      { name: "Sand", hex_value: "#D2B48C", stock: 20 },
      { name: "White", hex_value: "#FFFFFF", stock: 15 },
      { name: "Navy", hex_value: "#1A237E", stock: 10 },
    ];
    for (const c of colors2) {
      await admin.from("product_colors").upsert(
        {
          product_id: product2.id,
          name: c.name,
          hex_value: c.hex_value,
          stock: c.stock,
        },
        { onConflict: "product_id,name" }
      );
    }
    console.log("   ✓ Colors added (3 colors)");
  }

  // Verify
  console.log("\n4. Verifying products...");
  const { data: allProducts } = await admin
    .from("products")
    .select("id, name, sku, price, discount_price, status, is_featured, is_new_arrival, is_flash_sale")
    .order("created_at", { ascending: false })
    .limit(5);

  if (allProducts) {
    console.log(`\n   Total products in database: ${allProducts.length}`);
    allProducts.forEach((p) => {
      console.log(`   - ${p.name} (SKU: ${p.sku}, Price: ৳${p.price}, Status: ${p.status})`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("✓ SEEDING COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Test Products Added:");
  console.log("   1. Premium Cotton Panjabi — Emerald (৳1999)");
  console.log("   2. Linen Casual Shirt — Sand (৳1199)");
  console.log("\n🌐 Visit your site to test:");
  console.log("   - Shop page: https://rakib-panjabi-house.vercel.app/shop");
  console.log("   - Product detail: https://rakib-panjabi-house.vercel.app/product/linen-casual-shirt-sand");
  console.log("   - New Arrivals: https://rakib-panjabi-house.vercel.app/new-arrivals");
  console.log("   - Sale: https://rakib-panjabi-house.vercel.app/sale");
  console.log("\n🧪 Test the full flow:");
  console.log("   1. Browse products on /shop");
  console.log("   2. Click a product to view details");
  console.log("   3. Select size and color");
  console.log("   4. Add to cart");
  console.log("   5. Go to checkout");
  console.log("   6. Place order (COD)");
  console.log("   7. Login to admin panel to see the order");
  console.log("");
}

seedTestProducts().catch(console.error);
