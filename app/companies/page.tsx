"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Labourer = {
  id: string;
  name: string;
  trade: string;
  location: string;
  experience_years: number;
  day_rate: number;
  availability: string;
  id_verified: boolean;
  bio: string | null;
};

export default function CompaniesBrowsePage() {
  const [labourers, setLabourers] = useState<Labourer[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [tradeFilter, setTradeFilter] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("labourers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setLabourers(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const trades = Array.from(new Set(labourers.map((w) => w.trade))).sort();
  const visible = tradeFilter
    ? labourers.filter((w) => w.trade === tradeFilter)
    : labourers;

  return (
    <main className="wrap" style={{ paddingBlock: 40 }}>
      <h1 style={{ fontSize: "1.8rem" }}>Find your crew</h1>
      <p style={{ color: "var(--muted)" }}>
        Every profile below was published through the real signup form &mdash;
        this page reads live from the database, nothing is mocked.
      </p>

      {trades.length > 0 && (
        <select
          value={tradeFilter}
          onChange={(e) => setTradeFilter(e.target.value)}
          style={{
            marginTop: 16,
            padding: "9px 12px",
            borderRadius: 8,
            border: "1px solid var(--line)",
            background: "var(--panel)",
            color: "var(--ink)",
          }}
        >
          <option value="">All trades</option>
          {trades.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}

      {loading && <p style={{ marginTop: 20 }}>Loading…</p>}
      {errorMessage && (
        <p style={{ color: "#b3261e", marginTop: 20 }}>
          Couldn&rsquo;t load workers: {errorMessage}. Check your Supabase
          connection in .env.local and that supabase/schema.sql has been run.
        </p>
      )}
      {!loading && !errorMessage && visible.length === 0 && (
        <p style={{ marginTop: 20, color: "var(--muted)" }}>
          No profiles yet &mdash; publish one at <code>/labourers</code> to see
          it appear here.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        {visible.map((w) => (
          <div key={w.id} className="panel">
            <div style={{ fontWeight: 700 }}>{w.name}</div>
            <div style={{ color: "var(--accent)", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase" }}>
              {w.trade}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 8 }}>
              {w.location}
            </div>
            {w.id_verified ? (
              <span className="badge">✓ e-Shram / BOCW verified</span>
            ) : (
              <span className="badge" style={{ background: "#fbf0d6", color: "#9a6a00" }}>
                Verification pending
              </span>
            )}
            <p style={{ fontSize: "0.86rem", color: "var(--muted)", marginTop: 10 }}>
              {w.bio}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem" }}>
                ₹{w.day_rate}
                <small style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: "0.7rem" }}> /day</small>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{w.availability}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
