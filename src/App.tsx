import { useState, useMemo } from "react";
import { simulateOrders, DEFAULT_CONFIG, type SimConfig } from "./engine/simulator";
import {
  describeStats, frequencyTable, calcProbabilities, meanConfidenceInterval,
  pearsonCorrelation, simpleLinearRegression, multipleLinearRegression,
  testExpressVsStandard, predictDelivery,
} from "./engine/analytics";
import { Overview } from "./components/Overview";
import { SimulationPage } from "./components/SimulationPage";
import { DistributionsPage } from "./components/DistributionsPage";
import { ProbabilityPage } from "./components/ProbabilityPage";
import { CorrelationRegressionPage } from "./components/CorrelationRegressionPage";
import { HypothesisReportPage } from "./components/HypothesisReportPage";
import "./App.css";

const PAGES = [
  { id: "overview",     label: "Executive Overview",      icon: "📊" },
  { id: "simulation",   label: "Simulation Engine",       icon: "⚙️" },
  { id: "distributions",label: "Distributions",           icon: "📈" },
  { id: "probability",  label: "Probability & Risk",      icon: "🎲" },
  { id: "correlation",  label: "Correlation & Regression",icon: "🔗" },
  { id: "hypothesis",   label: "Hypothesis & Report",     icon: "🧪" },
];

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const orders    = useMemo(() => simulateOrders(config), [config]);
  const times     = useMemo(() => orders.map(o => o.totalDeliveryTimeHr), [orders]);
  const distances = useMemo(() => orders.map(o => o.distanceKm),          [orders]);
  const descStats = useMemo(() => describeStats(times),                    [times]);
  const freqTable = useMemo(() => frequencyTable(times, 12),               [times]);
  const probStats = useMemo(() => calcProbabilities(orders),               [orders]);
  const ci        = useMemo(() => meanConfidenceInterval(times),           [times]);
  const corrStats = useMemo(() => pearsonCorrelation(distances, times),    [distances, times]);
  const slr       = useMemo(() => simpleLinearRegression(distances, times),[distances, times]);
  const mlr       = useMemo(() => multipleLinearRegression(orders),        [orders]);
  const hypStats  = useMemo(() => testExpressVsStandard(orders),           [orders]);

  const pageProps = {
    orders, times, distances, descStats, freqTable, probStats,
    ci, corrStats, slr, mlr, hypStats, predictDelivery, config,
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo-group">
            <span className="logo-icon">🚢</span>
            {sidebarOpen && <div className="logo-text"><span className="logo-name">ShipStat</span><span className="logo-sub">Analytics Engine</span></div>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(p => !p)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {PAGES.map((p, idx) => (
            <button
              key={p.id}
              id={`nav-${p.id}`}
              className={`nav-item ${activePage === p.id ? "active" : ""}`}
              onClick={() => setActivePage(p.id)}
            >
              <span className="nav-icon">{p.icon}</span>
              {sidebarOpen && (
                <span className="nav-label">
                  <span className="nav-num">{String(idx + 1).padStart(2, "0")}</span>
                  {p.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="sidebar-badge">
            <div className="badge-row"><span>Orders Simulated</span><span className="badge-val">{config.numOrders.toLocaleString()}</span></div>
            <div className="badge-row"><span>SLA Compliance</span><span className="badge-val" style={{ color: "#34d399" }}>{(100 - probStats.pLatePct).toFixed(1)}%</span></div>
            <div className="badge-row"><span>Avg Delivery</span><span className="badge-val">{descStats.mean} hr</span></div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            {PAGES.find(p => p.id === activePage)?.icon}&ensp;
            {PAGES.find(p => p.id === activePage)?.label}
          </div>
          <div className="topbar-meta">
            <span className="chip chip-cyan">N = {config.numOrders.toLocaleString()}</span>
            <span className="chip chip-emerald">σ = {descStats.stdDev} hr</span>
            <span className="chip chip-violet">r = {corrStats.pearsonR}</span>
          </div>
        </header>

        <div className="page-body">
          {activePage === "overview"      && <Overview      {...pageProps} />}
          {activePage === "simulation"    && <SimulationPage {...pageProps} config={config} setConfig={setConfig} />}
          {activePage === "distributions" && <DistributionsPage {...pageProps} />}
          {activePage === "probability"   && <ProbabilityPage  {...pageProps} />}
          {activePage === "correlation"   && <CorrelationRegressionPage {...pageProps} />}
          {activePage === "hypothesis"    && <HypothesisReportPage {...pageProps} />}
        </div>
      </main>
    </div>
  );
}
