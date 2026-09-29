import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from "recharts";
import type { ProbStats, CIResult } from "../engine/analytics";

interface ProbabilityPageProps {
  probStats: ProbStats;
  ci: CIResult;
}

export function ProbabilityPage({ probStats, ci }: ProbabilityPageProps) {
  const weatherData = Object.entries(probStats.weatherStats).map(([w, s]) => ({
    category: w,
    pLate: s.pLatePct,
    pBayes: s.bayesPct,
    total: s.count,
    late: s.lateCount,
  }));

  const typeData = Object.entries(probStats.typeStats).map(([t, s]) => ({
    category: t,
    pLate: s.pLatePct,
    pBayes: s.bayesPct,
    total: s.count,
    late: s.lateCount,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-header">
        <h2>Conditional Probability, Risk Modeling & Bayes' Law</h2>
        <p>Unconditional failure baseline, weather/tier conditional probabilities, posterior Bayes updates, and confidence intervals.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-kpis">
        <div className="stat-card">
          <span className="stat-label">Unconditional P(Late)</span>
          <span className="stat-value" style={{ color: "var(--rose)" }}>{probStats.pLatePct}%</span>
          <span className="stat-sub">Overall risk of SLA miss</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">SLA Compliance P(On-Time)</span>
          <span className="stat-value" style={{ color: "var(--emerald)" }}>{probStats.pOnTimePct}%</span>
          <span className="stat-sub">1 - P(Late)</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Mean 95% Confidence Interval</span>
          <span className="stat-value" style={{ fontSize: "1.3rem", color: "var(--cyan)" }}>
            [{ci.lower}, {ci.upper}]
          </span>
          <span className="stat-sub">Margin of Error: ±{ci.marginOfError} hr</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Storm Conditional Risk</span>
          <span className="stat-value" style={{ color: "var(--amber)" }}>
            {probStats.weatherStats["Storm"]?.pLatePct ?? 0}%
          </span>
          <span className="stat-sub">P(Late | Storm)</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2col">
        {/* Weather condition conditional probabilities */}
        <div className="glass-panel">
          <div className="panel-title">
            <span>🌦️ Conditional Risk vs Bayes Posterior by Weather</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>P(Late|Weather) vs P(Weather|Late)</span>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" stroke="var(--text-subtle)" fontSize={12} />
                <YAxis stroke="var(--text-subtle)" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "6px" }} />
                <Bar dataKey="pLate" name="P(Late | Weather) %" fill="#fb7185" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pBayes" name="P(Weather | Late) % [Bayes]" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier conditional risk */}
        <div className="glass-panel">
          <div className="panel-title">
            <span>📦 Delivery Tier Conditional Failure Comparison</span>
            <span style={{ fontSize: "0.8rem", color: "var(--violet)" }}>Express vs Standard</span>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="category" stroke="var(--text-subtle)" fontSize={12} />
                <YAxis stroke="var(--text-subtle)" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "6px" }} />
                <Bar dataKey="pLate" name="P(Late | Tier) %" fill="#fb7185" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pBayes" name="P(Tier | Late) % [Bayes]" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bayes explanation box */}
      <div className="glass-panel" style={{ borderLeft: "4px solid var(--violet)" }}>
        <div className="panel-title">
          <span>📐 Bayes' Theorem Formulation</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6" }}>
          By applying Bayes' Rule, we invert conditional probabilities to answer: <strong style={{ color: "var(--text-main)" }}>Given an order arrived late, what is the probability it was delayed due to Storm?</strong>
          <br />
          <code>P(Storm | Late) = [P(Late | Storm) × P(Storm)] / P(Late)</code> = <strong style={{ color: "var(--violet)" }}>{probStats.weatherStats["Storm"]?.bayesPct ?? 0}%</strong>
        </p>
      </div>
    </div>
  );
}
