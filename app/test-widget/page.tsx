// ============================================
// ADD THIS FILE TO YOUR NEXT.JS PROJECT AT:
// app/test-widget/page.tsx
//
// Then visit: https://wallproud.vercel.app/test-widget
// ============================================

import Script from "next/script";

export const metadata = {
  title: "WallProud — Widget Test Page",
};

export default function TestWidgetPage() {
  return (
    <>
      <div
        style={{
          background: "#dbeafe",
          border: "2px dashed #3b82f6",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: 14,
          color: "#1e40af",
          fontWeight: 600,
        }}
      >
        🧪 TEST PAGE — Look for the 💬 WallProud widget button at
        bottom-right!
      </div>

      {/* NAV */}
      <nav
        style={{
          background: "white",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          <span style={{ color: "#e85d04" }}>Fresh</span>Bite Kitchen
        </div>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: 28,
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <a href="#menu" style={{ textDecoration: "none", color: "#555" }}>
              Menu
            </a>
          </li>
          <li>
            <a
              href="#reviews"
              style={{ textDecoration: "none", color: "#555" }}
            >
              Reviews
            </a>
          </li>
          <li>
            <a
              href="#order"
              style={{
                textDecoration: "none",
                color: "white",
                background: "#e85d04",
                padding: "10px 22px",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Order Now
            </a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "white",
          padding: "100px 40px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
          Fresh Food,{" "}
          <span style={{ color: "#e85d04" }}>Fastest</span> Delivered
        </h1>
        <p
          style={{
            fontSize: 19,
            color: "#b0b0c0",
            maxWidth: 560,
            margin: "0 auto 32px",
          }}
        >
          Handcrafted meals made with locally sourced ingredients. Order in 30
          seconds, delivered in 30 minutes.
        </p>
        <a
          href="#order"
          style={{
            display: "inline-block",
            background: "#e85d04",
            color: "white",
            padding: "16px 36px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          🍔 Order Now
        </a>
      </section>

      {/* FEATURES */}
      <section
        id="menu"
        style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}
      >
        <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 800 }}>
          Why People Love Us
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#777",
            fontSize: 17,
            marginBottom: 50,
          }}
        >
          We obsess over quality, speed, and taste
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {[
            {
              icon: "🥗",
              title: "Farm-Fresh Ingredients",
              desc: "Every ingredient sourced from local farms within 50 miles.",
            },
            {
              icon: "⚡",
              title: "30-Minute Delivery",
              desc: "From our kitchen to your door in under 30 minutes.",
            },
            {
              icon: "👨‍🍳",
              title: "Chef-Crafted Recipes",
              desc: "Our menu is designed by award-winning chefs.",
            },
            {
              icon: "🌱",
              title: "Vegan & GF Options",
              desc: "Over 20 plant-based and gluten-free options.",
            },
            {
              icon: "💰",
              title: "Best Price Promise",
              desc: "Premium quality at honest prices.",
            },
            {
              icon: "📱",
              title: "Easy Reorder",
              desc: "Save your favorites and reorder in one tap.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: 32,
                borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 8 }}>
                {item.title}
              </h3>
              <p style={{ color: "#666", fontSize: 15 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXISTING TESTIMONIALS */}
      <section
        id="reviews"
        style={{ background: "#f0f0f5", padding: "80px 40px" }}
      >
        <h2 style={{ textAlign: "center", fontSize: 34, fontWeight: 800 }}>
          What Our Customers Say
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#777",
            fontSize: 17,
            marginBottom: 50,
          }}
        >
          Real reviews from real food lovers
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {[
            {
              quote:
                "Best food delivery in the city! The butter chicken is absolutely unreal.",
              name: "Ayesha K.",
              role: "Regular Customer",
              initial: "A",
            },
            {
              quote:
                "Finally a place that takes vegan options seriously! The mushroom wrap is my go-to.",
              name: "Rahul M.",
              role: "Ordered 40+ times",
              initial: "R",
            },
            {
              quote:
                "Ordered for a family dinner — 8 dishes, all perfect. Everyone asked where the food was from!",
              name: "Sarah L.",
              role: "Verified Order",
              initial: "S",
            },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: 28,
                borderRadius: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  color: "#f5a623",
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                ⭐⭐⭐⭐⭐
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: "#444",
                  marginBottom: 16,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#e85d04",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: 14 }}>
                    {t.name}
                  </strong>
                  <span style={{ fontSize: 13, color: "#888" }}>
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="order"
        style={{
          padding: "80px 40px",
          textAlign: "center",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12 }}>
          Hungry Yet?
        </h2>
        <p style={{ color: "#777", fontSize: 17, marginBottom: 32 }}>
          Order now and get your first delivery free. Use code FRESHBITE.
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            background: "#e85d04",
            color: "white",
            padding: "16px 36px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          🛒 Start Your Order
        </a>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#1a1a2e",
          color: "#888",
          padding: 40,
          textAlign: "center",
          fontSize: 14,
        }}
      >
        <p>© 2026 FreshBite Kitchen. All rights reserved.</p>
        <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
          📍 123 Food Street, Faisalabad | 📞 +92 300 1234567
        </p>
      </footer>

      {/* ===== WALLPROUD COLLECT WIDGET ===== */}
      <Script
        src="https://wallproud.vercel.app/collect-widget/5e00ad7d-c69a-4a35-8895-cf321fc292c5.js"
        strategy="lazyOnload"
      />
    </>
  );
}