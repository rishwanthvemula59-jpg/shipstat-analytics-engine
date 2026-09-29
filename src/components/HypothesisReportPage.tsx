import { useState } from "react";
import type { Order } from "../engine/simulator";
import type { HypResult, DescStats, ProbStats, SLRResult } from "../engine/analytics";

interface HypothesisReportProps {
  orders: Order[];
  hypStats: HypResult;
  descStats: DescStats;
  probStats: ProbStats;
  slr: SLRResult;
}

export function HypothesisReportPage({ orders, hypStats, descStats, probStats, slr }: HypothesisReportProps) {
  const [activeTab, setActiveTab] = useState<"hyp" | "report">("hyp");

  const reportMarkdown = `# 🚢 ShipStat: E-Commerce Delivery Analytics Engine — Executive Academic Report

## 1. Executive Summary
This report presents the mathematical and statistical findings from a Monte Carlo simulation of **${orders.length.toLocaleString()} e-commerce deliveries** conducted by the ShipStat analytics engine.

### Key Descriptive Findings:
- **Sample Size (N):** ${orders.length}
- **Sample Mean Delivery Time (μ):** ${descStats.mean} hours
- **Sample Standard Deviation (σ):** ${descStats.stdDev} hours
- **Median Delivery Time:** ${descStats.median} hours
- **Interquartile Range (IQR):** ${descStats.iqr} hours
- **Distribution Skewness:** ${descStats.skewness} (Right-skewed due to weather delays)

---

## 2. Probability and SLA Compliance
- **Overall Probability of Late Delivery P(Late):** ${probStats.pLatePct}%
- **SLA On-Time Fulfillment Rate P(On-Time):** ${probStats.pOnTimePct}%
- **Storm-Induced Conditional Failure Rate P(Late | Storm):** ${probStats.weatherStats["Storm"]?.pLatePct ?? 0}%
- **Bayesian Attribution P(Storm | Late):** ${probStats.weatherStats["Storm"]?.bayesPct ?? 0}%

---

## 3. Correlation & Regression Modeling
- **Pearson Correlation (Distance vs Delivery Time):** r = ${Math.sqrt(slr.rSquared).toFixed(3)}
- **Coefficient of Determination (R²):** ${slr.rSquaredPct}% of delivery duration variance is explained by transit distance alone.
- **Fitted Regression Equation:** \`${slr.equation}\`
- **Residual RMSE:** ${slr.rmse} hours

---

## 4. Hypothesis Testing (Welch's Two-Sample t-Test)
- **Null Hypothesis (H₀):** μ_Express ≥ μ_Standard (Express delivery does not save significant time)
- **Alternative Hypothesis (H₁):** μ_Express < μ_Standard (Express delivery is significantly faster)
- **Express Sample Mean:** ${hypStats.meanExpress} hr (n = ${hypStats.nExpress})
- **Standard Sample Mean:** ${hypStats.meanStandard} hr (n = ${hypStats.nStandard})
- **Observed Welch t-Statistic:** ${hypStats.tStatistic} (df = ${hypStats.df.toFixed(1)})
- **Critical t-Threshold (α = 0.05):** ${hypStats.tCritical}
- **p-value:** ${hypStats.pValue.toExponential(2)}
- **Cohen's d Effect Size:** ${hypStats.cohensD} (${hypStats.effectSize} effect)
- **Decision:** **${hypStats.conclusion}**
`;

  const downloadReport = () => {
    const blob = new Blob([reportMarkdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "shipstat_executive_report.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-header">
        <h2>Statistical Inference, Hypothesis Testing & Academic Report</h2>
        <p>Welch's two-sample t-test comparing fulfillment tiers and downloadable markdown executive report.</p>
      </div>

      <div className="glass-panel">
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === "hyp" ? "active" : ""}`} onClick={() => setActiveTab("hyp")}>
            🧪 Welch's t-Test Lab
          </button>
          <button className={`tab-btn ${activeTab === "report" ? "active" : ""}`} onClick={() => setActiveTab("report")}>
            📑 Full Academic Report
          </button>
        </div>

        {activeTab === "hyp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* KPI Cards */}
            <div className="grid-kpis">
              <div className="stat-card">
                <span className="stat-label">Express Mean (μ₁)</span>
                <span className="stat-value" style={{ color: "var(--violet)" }}>{hypStats.meanExpress} hr</span>
                <span className="stat-sub">n₁ = {hypStats.nExpress.toLocaleString()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Standard Mean (μ₂)</span>
                <span className="stat-value" style={{ color: "var(--cyan)" }}>{hypStats.meanStandard} hr</span>
                <span className="stat-sub">n₂ = {hypStats.nStandard.toLocaleString()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Mean Reduction (Δ)</span>
                <span className="stat-value" style={{ color: "var(--emerald)" }}>{Math.abs(hypStats.diffMeans).toFixed(2)} hr</span>
                <span className="stat-sub">Time saved with Express</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Welch t-Statistic</span>
                <span className="stat-value" style={{ color: "var(--amber)" }}>{hypStats.tStatistic}</span>
                <span className="stat-sub">Critical t*: {hypStats.tCritical}</span>
              </div>
            </div>

            {/* Decision Card */}
            <div style={{
              background: hypStats.rejectNull ? "rgba(52, 211, 153, 0.1)" : "rgba(251, 113, 133, 0.1)",
              border: `1.5px solid ${hypStats.rejectNull ? "var(--emerald)" : "var(--rose)"}`,
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", color: hypStats.rejectNull ? "var(--emerald)" : "var(--rose)" }}>
                Formal Hypothesis Test Decision (α = 0.05)
              </span>
              <span style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-main)" }}>
                {hypStats.conclusion}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Welch Degrees of Freedom = {hypStats.df.toFixed(1)} | p-value = {hypStats.pValue.toExponential(4)} | Cohen's d = {hypStats.cohensD} ({hypStats.effectSize} effect)
              </span>
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={downloadReport} className="btn-primary">
                📥 Download Report (.md)
              </button>
            </div>
            <pre style={{
              background: "rgba(0,0,0,0.3)",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              fontFamily: "var(--mono)",
              fontSize: "0.85rem",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              color: "var(--text-main)"
            }}>
              {reportMarkdown}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
