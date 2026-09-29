// =====================================================================
// ShipStat Simulation Engine — Pure TypeScript, zero dependencies
// =====================================================================

export interface SimConfig {
  numOrders: number;
  seed: number;
  minDistance: number;
  maxDistance: number;
  expressRatio: number;
  weatherProbs: { Normal: number; Rain: number; Storm: number };
}

export interface Order {
  orderId: string;
  distanceKm: number;
  deliveryType: "Standard" | "Express";
  weather: "Normal" | "Rain" | "Storm";
  processingTimeHr: number;
  packingTimeHr: number;
  transportTimeHr: number;
  lastMileTimeHr: number;
  weatherDelayHr: number;
  totalDeliveryTimeHr: number;
  expectedDeliveryTimeHr: number;
  delayMarginHr: number;
  status: "On-Time" | "Late";
  isLate: 0 | 1;
  isExpress: 0 | 1;
}

export const DEFAULT_CONFIG: SimConfig = {
  numOrders: 2000,
  seed: 42,
  minDistance: 5,
  maxDistance: 100,
  expressRatio: 0.30,
  weatherProbs: { Normal: 0.70, Rain: 0.20, Storm: 0.10 },
};

// — Seeded pseudo-random (mulberry32) ——————————————————————————
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function sampleNormal(rng: () => number, mean: number, std: number, minVal: number): number {
  // Box-Muller
  const u1 = Math.max(1e-9, rng());
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(minVal, mean + std * z);
}

function sampleUniform(rng: () => number, low: number, high: number): number {
  return low + rng() * (high - low);
}

function sampleExponential(rng: () => number, scale: number): number {
  return -scale * Math.log(Math.max(1e-9, rng()));
}

function round2(v: number) { return Math.round(v * 100) / 100; }

// — Main simulator ————————————————————————————————————————————
export function simulateOrders(config: SimConfig = DEFAULT_CONFIG): Order[] {
  const rng = makeRng(config.seed);
  const orders: Order[] = [];

  for (let i = 0; i < config.numOrders; i++) {
    // 1. Distance
    const dist = round2(sampleUniform(rng, config.minDistance, config.maxDistance));

    // 2. Delivery type
    const isExpress = rng() < config.expressRatio;
    const deliveryType: "Standard" | "Express" = isExpress ? "Express" : "Standard";

    // 3. Weather
    const wr = rng();
    const weather: "Normal" | "Rain" | "Storm" =
      wr < config.weatherProbs.Normal ? "Normal"
      : wr < config.weatherProbs.Normal + config.weatherProbs.Rain ? "Rain"
      : "Storm";

    // 4. Stage times
    const processing = round2(
      isExpress
        ? sampleNormal(rng, 1.3, 0.20, 0.3)
        : sampleNormal(rng, 2.5, 0.40, 0.5)
    );
    const packing = round2(
      isExpress
        ? sampleUniform(rng, 0.5, 1.2)
        : sampleUniform(rng, 1.0, 2.5)
    );
    const transportBase = isExpress
      ? 1.0 + dist * 0.34 + sampleNormal(rng, 0, 0.40, -99)
      : 2.0 + dist * 0.48 + sampleNormal(rng, 0, 0.60, -99);
    const transport = round2(Math.max(0.3, transportBase));
    const lastMile = round2(
      isExpress
        ? sampleNormal(rng, 1.8, 0.30, 0.5)
        : sampleNormal(rng, 3.2, 0.50, 0.8)
    );

    // 5. Weather delay
    let weatherDelay = 0;
    if (weather === "Rain") weatherDelay = round2(sampleExponential(rng, 1.8));
    else if (weather === "Storm") weatherDelay = round2(3.0 + sampleExponential(rng, 3.5));

    // 6. Total
    const total = round2(processing + packing + transport + lastMile + weatherDelay);

    // 7. SLA (nominal + buffer)
    const stdNominal = 2.5 + 1.75 + 2.0 + dist * 0.48 + 3.2 + 2.5;
    const expNominal = 1.3 + 0.85 + 1.0 + dist * 0.34 + 1.8 + 1.8;
    const expectedTime = round2(isExpress ? expNominal : stdNominal);

    const delayMargin = round2(total - expectedTime);
    const late = total > expectedTime;

    orders.push({
      orderId: `ORD-${10000 + i + 1}`,
      distanceKm: dist,
      deliveryType,
      weather,
      processingTimeHr: processing,
      packingTimeHr: packing,
      transportTimeHr: transport,
      lastMileTimeHr: lastMile,
      weatherDelayHr: weatherDelay,
      totalDeliveryTimeHr: total,
      expectedDeliveryTimeHr: expectedTime,
      delayMarginHr: delayMargin,
      status: late ? "Late" : "On-Time",
      isLate: late ? 1 : 0,
      isExpress: isExpress ? 1 : 0,
    });
  }
  return orders;
}
