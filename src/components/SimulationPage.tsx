import { useState } from "react";
import type { Order, SimConfig } from "../engine/simulator";

interface SimulationPageProps {
  orders: Order[];
  config: SimConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimConfig>>;
}

export function SimulationPage({ orders, config, setConfig }: SimulationPageProps) {
  const [numOrdersInput, setNumOrdersInput] = useState(config.numOrders);
  const [seedInput, setSeedInput] = useState(config.seed);
  const [expressRatioInput, setExpressRatioInput] = useState(config.expressRatio);
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherFilter, setWeatherFilter] = useState("All");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(prev => ({
      ...prev,
      numOrders: Number(numOrdersInput),
      seed: Number(seedInput),
      expressRatio: Number(expressRatioInput),
    }));
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeather = weatherFilter === "All" || o.weather === weatherFilter;
    return matchesSearch && matchesWeather;
  }).slice(0, 100);

  const downloadCSV = () => {
    const headers = [
      "orderId,distanceKm,deliveryType,weather,processingTimeHr,packingTimeHr,transportTimeHr,lastMileTimeHr,weatherDelayHr,totalDeliveryTimeHr,expectedDeliveryTimeHr,delayMarginHr,status"
    ];
    const rows = orders.map(o =>
      `${o.orderId},${o.distanceKm},${o.deliveryType},${o.weather},${o.processingTimeHr},${o.packingTimeHr},${o.transportTimeHr},${o.lastMileTimeHr},${o.weatherDelayHr},${o.totalDeliveryTimeHr},${o.expectedDeliveryTimeHr},${o.delayMarginHr},${o.status}`
    );
    const blob = new Blob([[...headers, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `shipstat_simulation_orders_${orders.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="section-header">
        <h2>Monte Carlo Simulation Engine & Synthetic Dataset</h2>
        <p>Configure stochastic transit distributions, re-seed the pseudo-random generator, and inspect simulated orders.</p>
      </div>

      {/* Param config */}
      <div className="glass-panel">
        <div className="panel-title">
          <span>⚙️ Simulation Hyperparameters</span>
          <span style={{ fontSize: "0.8rem", color: "var(--cyan)" }}>Deterministic Seed = {config.seed}</span>
        </div>
        <form onSubmit={handleApply} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", alignItems: "flex-end" }}>
          <div className="form-group">
            <label className="form-label">Order Volume (N)</label>
            <input
              type="number"
              className="form-input"
              value={numOrdersInput}
              min={100}
              max={10000}
              step={100}
              onChange={e => setNumOrdersInput(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">PRNG Seed</label>
            <input
              type="number"
              className="form-input"
              value={seedInput}
              onChange={e => setSeedInput(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Express Delivery Ratio</label>
            <input
              type="number"
              className="form-input"
              value={expressRatioInput}
              min={0.05}
              max={0.9}
              step={0.05}
              onChange={e => setExpressRatioInput(Number(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Run Simulation</button>
            <button type="button" onClick={downloadCSV} className="tab-btn" style={{ border: "1px solid var(--border)", borderRadius: "8px" }}>
              📥 Export CSV
            </button>
          </div>
        </form>
      </div>

      {/* Order data explorer */}
      <div className="glass-panel">
        <div className="panel-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>📦 Simulated Orders Explorer (Showing first {filteredOrders.length} records)</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Search Order ID..."
              className="form-input"
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select"
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
              value={weatherFilter}
              onChange={e => setWeatherFilter(e.target.value)}
            >
              <option value="All">All Weather</option>
              <option value="Normal">Normal</option>
              <option value="Rain">Rain</option>
              <option value="Storm">Storm</option>
            </select>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Distance (km)</th>
                <th>Service Tier</th>
                <th>Weather</th>
                <th>Processing</th>
                <th>Transport</th>
                <th>Weather Delay</th>
                <th>Total Time</th>
                <th>Expected SLA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.orderId}>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--cyan)" }}>{o.orderId}</td>
                  <td>{o.distanceKm} km</td>
                  <td>
                    <span style={{ color: o.deliveryType === "Express" ? "var(--violet)" : "var(--text-muted)", fontWeight: 600 }}>
                      {o.deliveryType}
                    </span>
                  </td>
                  <td>{o.weather}</td>
                  <td>{o.processingTimeHr}h</td>
                  <td>{o.transportTimeHr}h</td>
                  <td>{o.weatherDelayHr > 0 ? `+${o.weatherDelayHr}h` : "—"}</td>
                  <td style={{ fontWeight: 600 }}>{o.totalDeliveryTimeHr}h</td>
                  <td>{o.expectedDeliveryTimeHr}h</td>
                  <td>
                    <span className={`status-badge ${o.status === "On-Time" ? "on-time" : "late"}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
