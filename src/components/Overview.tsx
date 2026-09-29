import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Legend, ScatterChart, Scatter, ZAxis
} from "recharts";
import type { Order } from "../engine/simulator";
import type { DescStats, ProbStats, SLRResult } from "../engine/analytics";

interface OverviewProps {
  orders: Order[];
  descStats: DescStats;
  probStats: ProbStats;
  slr: SLRResult;
}

export function Overview({ orders, descStats, probStats, slr }: OverviewProps) {
  // Prep distribution bins for delivery time
  const bins: { range: string; count: number }[] = [];
  const minVal = Math.floor(descStats.min);
  const maxVal = Math.ceil(descStats.max);
  const step = Math.max(1, Math.round((maxVal - minVal) / 14));
  for (let b = minVal; b < maxVal; b += step) {
    const c = orders.filter(o => o.totalDeliveryTimeHr >= b && o.totalDeliveryTimeHr < b + step).length;
    bins.push({ range: `${b}-${b + step}h`, count: c });
  }

  // Scatter sample to keep render performant
  const scatterData = orders.slice(0, 150).map(o => ({
    dist: o.distanceKm,
    time: o.totalDeliveryTimeHr,
    type: o.deliveryType
  }));

  // Weather risk breakdown data
  const weatherRiskData = Object.entries(probStats.weatherStats).map(([w, s]) => ({
    weather: w,
    latePct: s.pLatePct,
    onTimePct: parseFloat((100 - s.pLatePct).toFixed(1))
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-header">
        <h2>Executive Delivery Performance & Uncertainty Overview</h2>
        <p>Real-time simulation diagnostics, delivery duration distributions, and stochastic operational risk factors.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-kpis">
        <div className="stat-card">
          <span className="stat-label">Total Simulated Orders</span>
          <span className="stat-value">{orders.length.toLocaleString()}</span>
          <span className="stat-sub">Active Monte Carlo batch</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Mean Delivery Duration</span>
          <span className="stat-value" style={{ color: "var(--cyan)" }}>{descStats.mean} hr</span>
          <span className="stat-sub">Std Dev (σ): {descStats.stdDev} hr</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">On-Time SLA Rate</span>
          <span className="stat-value" style={{ color: "var(--emerald)" }}>{probStats.pOnTimePct}%</span>
          <span className="stat-sub">Late Probability: {probStats.pLatePct}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Distance Correlation (r)</span>
          <span className="stat-value" style={{ color: "var(--violet)" }}>{Math.sqrt(slr.rSquared).toFixed(3)}</span>
          <span className="stat-sub">R²: {slr.rSquaredPct}% explained</span>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2col">
        <div className="glass-panel">
          <div className="panel-title">
            <span>⏱️ Delivery Duration Density Distribution</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Mean = {descStats.mean}h</span>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="range" stroke="var(--text-subtle)" fontSize={11} />
                <YAxis stroke="var(--text-subtle)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Area type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#timeGrad)" name="Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-title">
            <span>🌦️ Conditional SLA Failure by Weather Condition</span>
            <span style={{ fontSize: "0.8rem", color: "var(--rose)" }}>P(Late | Weather)</span>
          </div>
          <div style={{ height: "260px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="weather" stroke="var(--text-subtle)" fontSize={12} />
                <YAxis stroke="var(--text-subtle)" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "6px" }} />
                <Bar dataKey="onTimePct" name="On-Time %" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="latePct" name="Late %" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Scatter distance vs time */}
      <div className="glass-panel">
        <div className="panel-title">
          <span>📏 Distance vs Total Delivery Time (Sampled Sub-cohort)</span>
          <span style={{ fontSize: "0.8rem", color: "var(--cyan)" }}>OLS Fit: {slr.equation}</span>
        </div>
        <div style={{ height: "280px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="dist" name="Distance" unit="km" stroke="var(--text-subtle)" fontSize={11} />
              <YAxis dataKey="time" name="Time" unit="hr" stroke="var(--text-subtle)" fontSize={11} />
              <ZAxis range={[30, 40]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
              />
              <Scatter name="Orders" data={scatterData} fill="#38bdf8" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
