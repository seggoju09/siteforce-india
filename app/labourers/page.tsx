"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

const TRADES = [
  "General Labourer (Mazdoor)",
  "Mason (Mistri / Rajmistri)",
  "Bar Bender / Steel Fixer",
  "Shuttering Carpenter",
  "Electrician",
  "Plumber",
  "Painter",
  "Tile Layer",
  "Welder / Fabricator",
  "Plant / Machine Operator",
  "Site Supervisor (Mukadam)",
  "Scaffolder",
];

const LOCATIONS = [
  "Mumbai / MMR",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Indore",
  "Kochi",
];

export default function LabourerSignupPage() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("labourers").insert({
      name: form.get("name"),
      trade: form.get("trade"),
      location: form.get("location"),
      experience_years: Number(form.get("experience_years") || 0),
      day_rate: Number(form.get("day_rate") || 0),
      availability: form.get("availability"),
      id_verified: form.get("id_verified") === "on",
      bio: form.get("bio"),
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("saved");
    (event.target as HTMLFormElement).reset();
  }

  return (
    <main className="wrap" style={{ paddingBlock: 40, maxWidth: 640 }}>
      <h1 style={{ fontSize: "1.8rem" }}>Build your profile</h1>
      <p style={{ color: "var(--muted)" }}>
        This is what a hiring company will see. Free to list &mdash; SiteForce
        never charges workers to be found.
      </p>

      <form onSubmit={handleSubmit} className="panel" style={{ marginTop: 20 }}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" required />
        </div>

        <div className="field">
          <label htmlFor="trade">Primary trade</label>
          <select id="trade" name="trade" required defaultValue="">
            <option value="" disabled>
              Select a trade
            </option>
            {TRADES.map((trade) => (
              <option key={trade} value={trade}>
                {trade}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="location">Based near</label>
          <select id="location" name="location" required defaultValue="">
            <option value="" disabled>
              Select a city
            </option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="experience_years">Years&rsquo; experience</label>
          <input
            id="experience_years"
            name="experience_years"
            type="number"
            min={0}
            max={50}
            defaultValue={1}
          />
        </div>

        <div className="field">
          <label htmlFor="day_rate">Day rate (₹)</label>
          <input
            id="day_rate"
            name="day_rate"
            type="number"
            min={0}
            step={10}
            defaultValue={600}
          />
        </div>

        <div className="field">
          <label htmlFor="availability">Availability</label>
          <select id="availability" name="availability" defaultValue="Immediate">
            <option>Immediate</option>
            <option>Within 1 week</option>
            <option>Within 2 weeks</option>
            <option>Booked until further notice</option>
          </select>
        </div>

        <div className="field">
          <label style={{ display: "flex", alignItems: "center", gap: 8, textTransform: "none", fontWeight: 400 }}>
            <input type="checkbox" name="id_verified" style={{ width: "auto" }} />
            I have an e-Shram card or BOCW registration
          </label>
        </div>

        <div className="field">
          <label htmlFor="bio">Short bio</label>
          <textarea id="bio" name="bio" rows={3} />
        </div>

        <button className="btn" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Publishing…" : "Publish profile"}
        </button>

        {status === "saved" && (
          <p className="badge" style={{ marginTop: 12 }}>
            ✓ Profile saved to the live database
          </p>
        )}
        {status === "error" && (
          <p style={{ color: "#b3261e", marginTop: 12, fontSize: "0.85rem" }}>
            Couldn&rsquo;t save that: {errorMessage}. Check your Supabase
            connection in .env.local and that supabase/schema.sql has been run.
          </p>
        )}
      </form>
    </main>
  );
}
