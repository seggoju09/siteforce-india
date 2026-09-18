import Link from "next/link";

export default function HomePage() {
  return (
    <main className="wrap" style={{ paddingBlock: 60 }}>
      <div style={{ color: "var(--accent)", fontFamily: "var(--font-display)", letterSpacing: "0.12em", fontSize: "0.78rem", textTransform: "uppercase" }}>
        India construction labour, matched fast
      </div>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", margin: "6px 0 12px", maxWidth: "16ch" }}>
        India&rsquo;s on-demand construction workforce.
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: "56ch", lineHeight: 1.5 }}>
        SiteForce connects verified mazdoors, mistris and tradespeople directly
        with construction companies across India. Workers never pay to be
        found; companies pay only when they hire.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <Link className="btn" href="/labourers">
          I&rsquo;m a worker &mdash; build my profile
        </Link>
        <Link className="btn ghost" href="/companies">
          I&rsquo;m hiring &mdash; browse workers
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 40,
          flexWrap: "wrap",
          color: "var(--muted)",
          fontSize: "0.82rem",
        }}
      >
        <span>✓ Free for workers, always</span>
        <span>✓ e-Shram / BOCW verification shown on every profile</span>
        <span>✓ Companies pay only on a successful hire</span>
      </div>
    </main>
  );
}
