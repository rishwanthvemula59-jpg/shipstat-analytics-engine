import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, Legend
} from "recharts";
import type { DescStats, FreqRow } from "../engine/analytics";

interface DistributionsPageProps {
  descStats: DescStats;
  freqTable: FreqRow[];
}

export function DistributionsPage({ descStats, freqTable }: DistributionsPageProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-header">
        <h2>Descriptive Statistics & Continuous Distributions</h2>
        <p>Measures of central tendency, statistical dispersion, shape parameters, and grouped frequency histogram.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-kpis">
        <div className="stat-card">
          <span className="stat-label">Mean (μ)</span>
          <span className="stat-value" style={{ color: "var(--cyan)" }}>{descStats.mean} hr</span>
          <span className="stat-sub">Central expectation</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Median (Q2)</span>
          <span className="stat-value">{descStats.median} hr</span>
          <span className="stat-sub">50th Percentile</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Standard Deviation (σ)</span>
          <span className="stat-value" style={{ color: "var(--amber)" }}>{descStats.stdDev} hr</span>
          <span className="stat-sub">Variance: {descStats.variance}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Interquartile Range (IQR)</span>
          <span className="stat-value">{descStats.iqr} hr</span>
          <span className="stat-sub">Q1: {descStats.q1} | Q3: {descStats.q3}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Skewness</span>
          <span className="stat-value" style={{ color: descStats.skewness > 0 ? "var(--rose)" : "var(--emerald)" }}>
            {descStats.skewness}
          </span>
          <span className="stat-sub">{descStats.skewness > 0 ? "Right-skewed (Tail late)" : "Left-skewed"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Kurtosis</span>
          <span className="stat-value">{descStats.kurtosis}</span>
          <span className="stat-sub">Tails thickness</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2col">
        {/* Frequency Histogram */}
        <div className="glass-panel">
          <div className="panel-title">
            <span>📊 Grouped Frequency Distribution Histogram</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Bins = 12 intervals</span>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqTable} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="interval" stroke="var(--text-subtle)" fontSize={10} angle={-25} textAnchor="end" />
                <YAxis stroke="var(--text-subtle)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Bar dataKey="frequency" name="Order Count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Ogive */}
        <div className="glass-panel">
          <div className="panel-title">
            <span>📈 Cumulative Frequency Ogive (%)</span>
            <span style={{ fontSize: "0.8rem", color: "var(--emerald)" }}>CDF Empirical</span>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={freqTable} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="interval" stroke="var(--text-subtle)" fontSize={10} angle={-25} textAnchor="end" />
                <YAxis stroke="var(--text-subtle)" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "6px" }} />
                <Line type="monotone" dataKey="cumPct" name="Cumulative %" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="glass-panel">
        <div className="panel-title">
          <span>📋 Grouped Frequency Table</span>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Class Interval (hr)</th>
                <th>Midpoint (x)</th>
                <th>Frequency (f)</th>
                <th>Relative Frequency</th>
                <th>Cumulative Frequency</th>
                <th>Cumulative Percentage</th>
              </tr>
            </thead>
            <tbody>
              {freqTable.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontFamily: "var(--mono)" }}>{row.interval}</td>
                  <td>{row.midpoint}</td>
                  <td style={{ fontWeight: 600, color: "var(--cyan)" }}>{row.frequency}</td>
                  <td>{(row.relFreq * 100).toFixed(2)}%</td>
                  <td>{row.cumFreq}</td>
                  <td style={{ color: "var(--emerald)", fontWeight: 600 }}>{row.cumPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
