import { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ZAxis
} from "recharts";
import type { Order } from "../engine/simulator";
import type { CorrResult, SLRResult, MLRResult, predictDelivery } from "../engine/analytics";

interface CorrelationRegressionProps {
  orders: Order[];
  corrStats: CorrResult;
  slr: SLRResult;
  mlr: MLRResult;
  predictDelivery: typeof predictDelivery;
}

export function CorrelationRegressionPage({ orders, corrStats, slr, mlr, predictDelivery }: CorrelationRegressionProps) {
  const [activeTab, setActiveTab] = useState<"corr" | "slr" | "mlr" | "pred">("corr");

  // Predictor state
  const [predDist, setPredDist] = useState(45);
  const [predTier, setPredTier] = useState<"Standard" | "Express">("Standard");
  const [predWeather, setPredWeather] = useState<"Normal" | "Rain" | "Storm">("Normal");

  const prediction = predictDelivery(predDist, predTier, predWeather, slr, mlr);

  const scatterSample = orders.slice(0, 150).map(o => ({
    dist: o.distanceKm,
    time: o.totalDeliveryTimeHr,
    res: o.totalDeliveryTimeHr - (slr.intercept + slr.slope * o.distanceKm)
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-header">
        <h2>Correlation Analysis, Regression Models & What-If Predictor</h2>
        <p>Bivariate correlation, Simple Linear Regression, Multiple OLS Regression, and an interactive prediction model.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-kpis">
        <div className="stat-card">
          <span className="stat-label">Pearson Correlation (r)</span>
          <span className="stat-value" style={{ color: "var(--cyan)" }}>{corrStats.pearsonR}</span>
          <span className="stat-sub">{corrStats.interpretation}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">R-Squared (r²)</span>
          <span className="stat-value" style={{ color: "var(--emerald)" }}>{corrStats.rSquaredPct}%</span>
          <span className="stat-sub">Distance explains delivery variance</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Multiple R² (MLR)</span>
          <span className="stat-value" style={{ color: "var(--violet)" }}>{(mlr.rSquared * 100).toFixed(1)}%</span>
          <span className="stat-sub">Full 4-predictor OLS fit</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Residual RMSE</span>
          <span className="stat-value" style={{ color: "var(--amber)" }}>{slr.rmse} hr</span>
          <span className="stat-sub">Standard error of estimate</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-panel">
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === "corr" ? "active" : ""}`} onClick={() => setActiveTab("corr")}>
            🔗 Correlation
          </button>
          <button className={`tab-btn ${activeTab === "slr" ? "active" : ""}`} onClick={() => setActiveTab("slr")}>
            📏 Simple Regression
          </button>
          <button className={`tab-btn ${activeTab === "mlr" ? "active" : ""}`} onClick={() => setActiveTab("mlr")}>
            📐 Multiple Regression
          </button>
          <button className={`tab-btn ${activeTab === "pred" ? "active" : ""}`} onClick={() => setActiveTab("pred")}>
            🔮 Delivery Predictor
          </button>
        </div>

        {activeTab === "corr" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Pearson correlation test evaluates whether longer transit distance systematically increases delivery duration:
            </p>
            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="dist" name="Distance" unit="km" stroke="var(--text-subtle)" fontSize={11} />
                  <YAxis dataKey="time" name="Time" unit="hr" stroke="var(--text-subtle)" fontSize={11} />
                  <ZAxis range={[30, 40]} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Scatter name="Orders" data={scatterSample} fill="#38bdf8" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "slr" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <strong style={{ color: "var(--cyan)" }}>Fitted Equation:</strong> <code>{slr.equation}</code><br />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Each additional kilometer adds approximately {slr.slope} hours to total delivery transit time.
              </span>
            </div>
            <div style={{ height: "260px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="dist" name="Distance (km)" stroke="var(--text-subtle)" fontSize={11} />
                  <YAxis dataKey="res" name="Residual (hr)" stroke="var(--text-subtle)" fontSize={11} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Scatter name="Residuals" data={scatterSample} fill="#fb7185" opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "mlr" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Ordinary Least Squares (OLS) fit with 4 simultaneous regressors: Distance, Weather Delay, Processing Time, and Express Tier dummy.
            </p>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Predictor Variable</th>
                    <th>Regression Coefficient (β)</th>
                    <th>Impact Direction</th>
                  </tr>
                </thead>
                <tbody>
                  {mlr.coefficients.map(c => (
                    <tr key={c.name}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>{c.coef}</td>
                      <td>{c.coef > 0 ? "Increases Delivery Time" : c.coef < 0 ? "Decreases Delivery Time" : "Neutral"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "pred" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Distance ({predDist} km)</label>
                <input
                  type="range"
                  min={5}
                  max={120}
                  value={predDist}
                  onChange={e => setPredDist(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Tier</label>
                <select className="form-select" value={predTier} onChange={e => setPredTier(e.target.value as any)}>
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Forecasted Weather</label>
                <select className="form-select" value={predWeather} onChange={e => setPredWeather(e.target.value as any)}>
                  <option value="Normal">Normal</option>
                  <option value="Rain">Rain</option>
                  <option value="Storm">Storm</option>
                </select>
              </div>
            </div>

            {/* Prediction Output Cards */}
            <div className="grid-kpis">
              <div className="stat-card">
                <span className="stat-label">Predicted Time (MLR)</span>
                <span className="stat-value" style={{ color: "var(--cyan)" }}>{prediction.mlrEst} hr</span>
                <span className="stat-sub">Simple OLS: {prediction.simpleEst} hr</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Target Promised SLA</span>
                <span className="stat-value">{prediction.slaPredicted} hr</span>
                <span className="stat-sub">Distance-adjusted buffer</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">SLA Compliance Status</span>
                <span className="stat-value" style={{ color: prediction.status === "On-Time" ? "var(--emerald)" : "var(--rose)" }}>
                  {prediction.status}
                </span>
                <span className="stat-sub">Operational Forecast</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Failure Risk</span>
                <span className="stat-value" style={{ color: prediction.risk === "High" ? "var(--rose)" : prediction.risk === "Moderate" ? "var(--amber)" : "var(--emerald)" }}>
                  {prediction.risk}
                </span>
                <span className="stat-sub">Calculated delay risk</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
