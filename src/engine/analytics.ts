// =====================================================================
// ShipStat Analytics Engine — Statistics, Probability, Regression, Hypothesis
// =====================================================================

import type { Order } from "./simulator";

// ─── Helpers ─────────────────────────────────────────────────────────
const r = (v: number, d = 3) => parseFloat(v.toFixed(d));
const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const mean = (arr: number[]) => sum(arr) / arr.length;
const sorted = (arr: number[]) => [...arr].sort((a, b) => a - b);
const percentile = (arr: number[], p: number) => {
  const s = sorted(arr);
  const idx = (p / 100) * (s.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return s[lo] + (idx - lo) * (s[hi] - s[lo]);
};

// ─── t-distribution CDF approximation (Cornish-Fisher) ───────────────
function tCDF(t: number, df: number): number {
  // Abramowitz & Stegun approximation
  const x = df / (df + t * t);
  const betaInc = betaIncomplete(df / 2, 0.5, x);
  const p = betaInc / 2;
  return t >= 0 ? 1 - p : p;
}

function betaIncomplete(a: number, b: number, x: number): number {
  // Simple continued-fraction approximation
  const lbeta = lgamma(a) + lgamma(b) - lgamma(a + b);
  if (x < 0 || x > 1) return 0;
  if (x === 0) return 0;
  if (x === 1) return 1;
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta) / a;
  // Lentz's method
  let f = 1, C = 1, D = 1 - (a + b) * x / (a + 1);
  D = D === 0 ? 1e-30 : 1 / D;
  f = D;
  for (let m = 1; m <= 200; m++) {
    let d = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    D = 1 + d * D; C = 1 + d / C;
    D = D === 0 ? 1e-30 : 1 / D; C = C === 0 ? 1e-30 : C;
    f *= C * D;
    d = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
    D = 1 + d * D; C = 1 + d / C;
    D = D === 0 ? 1e-30 : 1 / D; C = C === 0 ? 1e-30 : C;
    const delta = C * D;
    f *= delta;
    if (Math.abs(delta - 1) < 1e-8) break;
  }
  return front * f;
}

function lgamma(x: number): number {
  const c = [76.18009172947146,-86.50532032941677,24.01409824083091,
              -1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
  let y = x, tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (const ci of c) ser += ci / ++y;
  return -tmp + Math.log(2.5066282746310005 * ser / x);
}

// t inverse (Newton's method)
function tInv(p: number, df: number): number {
  let lo = -50, hi = 50, mid = 0;
  for (let i = 0; i < 100; i++) {
    mid = (lo + hi) / 2;
    tCDF(mid, df) < p ? lo = mid : hi = mid;
  }
  return mid;
}

// ─── Descriptive Statistics ──────────────────────────────────────────
export interface DescStats {
  count: number; mean: number; median: number; mode: number;
  min: number; max: number; range: number;
  variance: number; stdDev: number; iqr: number;
  q1: number; q3: number; p05: number; p95: number; p99: number;
  skewness: number; kurtosis: number; coefVariation: number;
}

export function describeStats(values: number[]): DescStats {
  const n = values.length;
  const m = mean(values);
  const med = percentile(values, 50);
  const q1 = percentile(values, 25);
  const q3 = percentile(values, 75);
  const mn = Math.min(...values), mx = Math.max(...values);
  const variance = sum(values.map(v => (v - m) ** 2)) / (n - 1);
  const std = Math.sqrt(variance);
  // Skewness (Fisher-Pearson)
  const skew = sum(values.map(v => ((v - m) / std) ** 3)) * n / ((n - 1) * (n - 2));
  const kurt = sum(values.map(v => ((v - m) / std) ** 4)) * n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))
               - 3 * (n - 1) ** 2 / ((n - 2) * (n - 3));
  // Mode via rounded histogram
  const counts: Record<string, number> = {};
  values.forEach(v => { const k = v.toFixed(1); counts[k] = (counts[k] || 0) + 1; });
  const modeKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  return {
    count: n, mean: r(m), median: r(med), mode: r(+modeKey),
    min: r(mn), max: r(mx), range: r(mx - mn),
    variance: r(variance), stdDev: r(std), iqr: r(q3 - q1),
    q1: r(q1), q3: r(q3), p05: r(percentile(values, 5)),
    p95: r(percentile(values, 95)), p99: r(percentile(values, 99)),
    skewness: r(skew, 3), kurtosis: r(kurt, 3),
    coefVariation: r((std / m) * 100, 2),
  };
}

// ─── Frequency Distribution ──────────────────────────────────────────
export interface FreqRow {
  interval: string; midpoint: number; frequency: number;
  relFreq: number; cumFreq: number; cumPct: number;
}
export function frequencyTable(values: number[], numBins = 10): FreqRow[] {
  const mn = Math.floor(Math.min(...values));
  const mx = Math.ceil(Math.max(...values));
  const step = (mx - mn) / numBins;
  const rows: FreqRow[] = [];
  let cumFreq = 0;
  for (let i = 0; i < numBins; i++) {
    const lo = mn + i * step, hi = mn + (i + 1) * step;
    const freq = values.filter(v => v >= lo && (i === numBins - 1 ? v <= hi : v < hi)).length;
    cumFreq += freq;
    rows.push({
      interval: `${lo.toFixed(1)} – ${hi.toFixed(1)}`,
      midpoint: r((lo + hi) / 2),
      frequency: freq,
      relFreq: r(freq / values.length, 4),
      cumFreq,
      cumPct: r((cumFreq / values.length) * 100, 2),
    });
  }
  return rows;
}

// ─── Probability ─────────────────────────────────────────────────────
export interface ProbStats {
  totalOrders: number; lateOrders: number;
  pLate: number; pLatePct: number; pOnTimePct: number;
  weatherStats: Record<string, { count: number; lateCount: number; pLatePct: number; bayesPct: number }>;
  typeStats: Record<string, { count: number; lateCount: number; pLatePct: number; bayesPct: number }>;
}
export function calcProbabilities(orders: Order[]): ProbStats {
  const n = orders.length;
  const late = orders.filter(o => o.isLate).length;
  const pLate = late / n;

  const ws: ProbStats["weatherStats"] = {};
  for (const w of ["Normal", "Rain", "Storm"]) {
    const grp = orders.filter(o => o.weather === w);
    const gl = grp.filter(o => o.isLate).length;
    ws[w] = {
      count: grp.length, lateCount: gl,
      pLatePct: r(gl / (grp.length || 1) * 100, 2),
      bayesPct: r((gl / (late || 1)) * 100, 2),
    };
  }
  const ts: ProbStats["typeStats"] = {};
  for (const t of ["Standard", "Express"]) {
    const grp = orders.filter(o => o.deliveryType === t);
    const gl = grp.filter(o => o.isLate).length;
    ts[t] = {
      count: grp.length, lateCount: gl,
      pLatePct: r(gl / (grp.length || 1) * 100, 2),
      bayesPct: r((gl / (late || 1)) * 100, 2),
    };
  }
  return {
    totalOrders: n, lateOrders: late,
    pLate: r(pLate, 4), pLatePct: r(pLate * 100, 2), pOnTimePct: r((1 - pLate) * 100, 2),
    weatherStats: ws, typeStats: ts,
  };
}

// ─── Confidence Interval ─────────────────────────────────────────────
export interface CIResult {
  sampleMean: number; sampleStd: number; se: number;
  tCritical: number; marginOfError: number;
  lower: number; upper: number; df: number;
}
export function meanConfidenceInterval(values: number[], conf = 0.95): CIResult {
  const n = values.length;
  const m = mean(values);
  const s = Math.sqrt(sum(values.map(v => (v - m) ** 2)) / (n - 1));
  const se = s / Math.sqrt(n);
  const df = n - 1;
  const alpha = 1 - conf;
  const tc = tInv(1 - alpha / 2, df);
  const me = tc * se;
  return {
    sampleMean: r(m), sampleStd: r(s), se: r(se, 4),
    tCritical: r(tc), marginOfError: r(me),
    lower: r(m - me), upper: r(m + me), df,
  };
}

// ─── Correlation ─────────────────────────────────────────────────────
export interface CorrResult {
  pearsonR: number; rSquared: number; rSquaredPct: number;
  pValue: number; significant: boolean; interpretation: string;
}
export function pearsonCorrelation(x: number[], y: number[]): CorrResult {
  const n = x.length;
  const mx = mean(x), my = mean(y);
  const num = sum(x.map((xi, i) => (xi - mx) * (y[i] - my)));
  const denom = Math.sqrt(sum(x.map(xi => (xi - mx) ** 2)) * sum(y.map(yi => (yi - my) ** 2)));
  const r_val = denom === 0 ? 0 : num / denom;
  const r2 = r_val ** 2;
  // t-statistic for significance
  const tStat = r_val * Math.sqrt(n - 2) / Math.sqrt(1 - r2);
  const pVal = 2 * (1 - tCDF(Math.abs(tStat), n - 2));
  const abs = Math.abs(r_val);
  const interp = abs >= 0.85 ? "Very Strong" : abs >= 0.65 ? "Strong" : abs >= 0.40 ? "Moderate" : abs >= 0.20 ? "Weak" : "Negligible";
  const dir = r_val > 0 ? "Positive" : "Negative";
  return {
    pearsonR: r(r_val), rSquared: r(r2), rSquaredPct: r(r2 * 100, 2),
    pValue: pVal, significant: pVal < 0.05,
    interpretation: `${interp} ${dir} Correlation`,
  };
}

// ─── Simple Linear Regression ────────────────────────────────────────
export interface SLRResult {
  slope: number; intercept: number; rSquared: number; rSquaredPct: number;
  adjRSquared: number; rmse: number; equation: string;
  yPred: number[]; residuals: number[];
}
export function simpleLinearRegression(x: number[], y: number[]): SLRResult {
  const n = x.length;
  const mx = mean(x), my = mean(y);
  const sxy = sum(x.map((xi, i) => (xi - mx) * (y[i] - my)));
  const sxx = sum(x.map(xi => (xi - mx) ** 2));
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const yPred = x.map(xi => intercept + slope * xi);
  const residuals = y.map((yi, i) => yi - yPred[i]);
  const ssRes = sum(residuals.map(e => e ** 2));
  const ssTot = sum(y.map(yi => (yi - my) ** 2));
  const r2 = 1 - ssRes / ssTot;
  const adjR2 = 1 - (1 - r2) * (n - 1) / (n - 2);
  const rmse = Math.sqrt(ssRes / (n - 2));
  return {
    slope: r(slope), intercept: r(intercept),
    rSquared: r(r2), rSquaredPct: r(r2 * 100, 2),
    adjRSquared: r(adjR2), rmse: r(rmse),
    equation: `Delivery Time = ${r(intercept)} + (${r(slope)} × Distance)`,
    yPred, residuals,
  };
}

// ─── Hypothesis Test (Welch's t-test) ────────────────────────────────
export interface HypResult {
  nExpress: number; nStandard: number;
  meanExpress: number; meanStandard: number; diffMeans: number;
  stdExpress: number; stdStandard: number;
  tStatistic: number; df: number; tCritical: number;
  pValue: number; alpha: number; rejectNull: boolean;
  cohensD: number; effectSize: string; conclusion: string;
}
export function testExpressVsStandard(orders: Order[], alpha = 0.05): HypResult {
  const exp = orders.filter(o => o.deliveryType === "Express").map(o => o.totalDeliveryTimeHr);
  const std = orders.filter(o => o.deliveryType === "Standard").map(o => o.totalDeliveryTimeHr);
  const n1 = exp.length, n2 = std.length;
  const m1 = mean(exp), m2 = mean(std);
  const v1 = sum(exp.map(x => (x - m1) ** 2)) / (n1 - 1);
  const v2 = sum(std.map(x => (x - m2) ** 2)) / (n2 - 1);
  const s1 = Math.sqrt(v1), s2 = Math.sqrt(v2);
  const tStat = (m1 - m2) / Math.sqrt(v1 / n1 + v2 / n2);
  // Welch df
  const num = (v1 / n1 + v2 / n2) ** 2;
  const den = (v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1);
  const df = num / den;
  const tCrit = tInv(alpha, df); // one-tailed left
  const pVal = tCDF(tStat, df);   // P(T <= tStat)
  const reject = tStat < tCrit && pVal < alpha;
  const pooledSd = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
  const d = (m1 - m2) / pooledSd;
  const absD = Math.abs(d);
  const effect = absD > 0.8 ? "Large" : absD > 0.5 ? "Moderate" : absD > 0.2 ? "Small" : "Negligible";
  return {
    nExpress: n1, nStandard: n2,
    meanExpress: r(m1), meanStandard: r(m2), diffMeans: r(m1 - m2),
    stdExpress: r(s1), stdStandard: r(s2),
    tStatistic: r(tStat), df: r(df), tCritical: r(tCrit),
    pValue: pVal, alpha, rejectNull: reject,
    cohensD: r(d), effectSize: effect,
    conclusion: reject
      ? `Reject H₀ — Express delivery is significantly faster (p = ${pVal.toExponential(2)} < α = ${alpha})`
      : `Fail to Reject H₀ — No significant difference (p = ${r(pVal, 4)} ≥ α = ${alpha})`,
  };
}

// ─── MLR coefficients (closed-form OLS) ──────────────────────────────
export interface MLRResult {
  coefficients: { name: string; coef: number; }[];
  rSquared: number; adjRSquared: number; fStatistic: number;
}
export function multipleLinearRegression(orders: Order[]): MLRResult {
  // Y = b0 + b1*dist + b2*weatherDelay + b3*processing + b4*isExpress
  const Y = orders.map(o => o.totalDeliveryTimeHr);
  const X = orders.map(o => [
    1, o.distanceKm, o.weatherDelayHr, o.processingTimeHr, o.isExpress,
  ]);
  const n = Y.length, k = 4;
  // Normal equations: (X'X)^-1 X'Y — simplified via matrix algebra
  // Use Gauss-Jordan on augmented matrix [X'X | X'Y]
  const XtX: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0));
  const XtY: number[] = Array(5).fill(0);
  for (let i = 0; i < n; i++) {
    for (let r = 0; r < 5; r++) {
      XtY[r] += X[i][r] * Y[i];
      for (let c = 0; c < 5; c++) XtX[r][c] += X[i][r] * X[i][c];
    }
  }
  // Gauss-Jordan elimination
  const aug = XtX.map((row, i) => [...row, XtY[i]]);
  for (let col = 0; col < 5; col++) {
    let maxRow = col;
    for (let row = col + 1; row < 5; row++) if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-12) continue;
    for (let j = col; j <= 5; j++) aug[col][j] /= pivot;
    for (let row = 0; row < 5; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = col; j <= 5; j++) aug[row][j] -= factor * aug[col][j];
    }
  }
  const betas = aug.map(row => row[5]);
  const yHat = orders.map((_, i) => sum(X[i].map((x, j) => x * betas[j])));
  const yMean = mean(Y);
  const ssRes = sum(Y.map((y, i) => (y - yHat[i]) ** 2));
  const ssTot = sum(Y.map(y => (y - yMean) ** 2));
  const r2 = 1 - ssRes / ssTot;
  const adjR2 = 1 - (1 - r2) * (n - 1) / (n - k - 1);
  const fStat = (r2 / k) / ((1 - r2) / (n - k - 1));
  return {
    coefficients: [
      { name: "Intercept", coef: r(betas[0]) },
      { name: "Distance (km)", coef: r(betas[1], 4) },
      { name: "Weather Delay (hr)", coef: r(betas[2], 4) },
      { name: "Processing Time (hr)", coef: r(betas[3], 4) },
      { name: "Express Dummy", coef: r(betas[4], 4) },
    ],
    rSquared: r(r2), adjRSquared: r(adjR2), fStatistic: r(fStat),
  };
}

// ─── Delivery Predictor ───────────────────────────────────────────────
export function predictDelivery(
  dist: number, type: "Standard" | "Express", weather: "Normal" | "Rain" | "Storm",
  slr: SLRResult, mlr: MLRResult
): { simpleEst: number; mlrEst: number; slaPredicted: number; status: string; risk: string } {
  const isExp = type === "Express" ? 1 : 0;
  const wDelay = weather === "Normal" ? 0 : weather === "Rain" ? 2.5 : 7.5;
  const proc = isExp ? 1.3 : 2.5;
  const coeffs = mlr.coefficients;
  const mlrEst = coeffs[0].coef + coeffs[1].coef * dist + coeffs[2].coef * wDelay
                + coeffs[3].coef * proc + coeffs[4].coef * isExp;
  const sla = isExp ? 1.3 + 0.85 + 1.0 + dist * 0.34 + 1.8 + 1.8
                    : 2.5 + 1.75 + 2.0 + dist * 0.48 + 3.2 + 2.5;
  const margin = mlrEst - sla;
  return {
    simpleEst: r(slr.intercept + slr.slope * dist),
    mlrEst: r(mlrEst), slaPredicted: r(sla),
    status: mlrEst > sla ? "Late" : "On-Time",
    risk: margin > 3 ? "High" : margin > 0 ? "Moderate" : "Low",
  };
}
