/**
 * Financial ratio calculations and utilities.
 */

export interface PeriodFinancials {
  period: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingIncome: number;
  ebitda: number;
  netIncome: number;
  depreciationAmortization: number;
}

export interface FinancialRatios {
  period: string;
  grossMargin: number | null;
  operatingMargin: number | null;
  ebitdaMargin: number | null;
  netMargin: number | null;
  revenueGrowth: number | null;
}

/**
 * Calculate profitability ratios for a single period.
 */
export function calculateRatios(
  financials: PeriodFinancials,
  previousPeriod?: PeriodFinancials
): FinancialRatios {
  const { revenue, grossProfit, operatingIncome, ebitda, netIncome } =
    financials;

  return {
    period: financials.period,
    grossMargin: revenue !== 0 ? grossProfit / revenue : null,
    operatingMargin: revenue !== 0 ? operatingIncome / revenue : null,
    ebitdaMargin: revenue !== 0 ? ebitda / revenue : null,
    netMargin: revenue !== 0 ? netIncome / revenue : null,
    revenueGrowth:
      previousPeriod && previousPeriod.revenue !== 0
        ? (revenue - previousPeriod.revenue) / previousPeriod.revenue
        : null,
  };
}

/**
 * Aggregate line items by standardCategory to produce PeriodFinancials.
 */
export function aggregateLineItems(
  lineItems: Array<{ standardCategory: string | null; amount: number }>
): PeriodFinancials {
  let revenue = 0;
  let cogs = 0;
  let opexSGA = 0;
  let opexSM = 0;
  let opexRD = 0;
  let da = 0;
  let otherIncExp = 0;
  let tax = 0;

  for (const item of lineItems) {
    const cat = item.standardCategory;
    const amt = item.amount;

    switch (cat) {
      case "Revenue":
        revenue += amt;
        break;
      case "COGS":
        cogs += amt;
        break;
      case "OpEx_SGA":
        opexSGA += amt;
        break;
      case "OpEx_SM":
        opexSM += amt;
        break;
      case "OpEx_RD":
        opexRD += amt;
        break;
      case "OpEx_DA":
        da += amt;
        break;
      case "OtherIncomeExpense":
        otherIncExp += amt;
        break;
      case "Tax":
        tax += amt;
        break;
      // GrossProfit, OperatingIncome, NetIncome are computed, not summed
    }
  }

  const grossProfit = revenue - cogs;
  const totalOpex = opexSGA + opexSM + opexRD + da;
  const operatingIncome = grossProfit - totalOpex;
  const ebitda = operatingIncome + da;
  const netIncome = operatingIncome + otherIncExp - tax;

  return {
    period: "",
    revenue,
    cogs,
    grossProfit,
    operatingExpenses: totalOpex,
    operatingIncome,
    ebitda,
    netIncome,
    depreciationAmortization: da,
  };
}

/**
 * Format a number as currency string.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a ratio as percentage string.
 */
export function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Traffic-light rating for a ratio based on benchmark thresholds.
 */
export function getRatioRating(
  value: number | null,
  benchmarkMedian: number,
  higherIsBetter: boolean = true
): "green" | "yellow" | "red" | "neutral" {
  if (value === null) return "neutral";

  const threshold = benchmarkMedian * 0.2; // 20% band

  if (higherIsBetter) {
    if (value >= benchmarkMedian) return "green";
    if (value >= benchmarkMedian - threshold) return "yellow";
    return "red";
  } else {
    if (value <= benchmarkMedian) return "green";
    if (value <= benchmarkMedian + threshold) return "yellow";
    return "red";
  }
}

/**
 * Detect anomalies in a time series (values beyond 1.5 standard deviations).
 */
export function detectAnomalies(
  values: number[]
): Array<{ index: number; value: number; zscore: number }> {
  if (values.length < 3) return [];

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return [];

  const anomalies: Array<{ index: number; value: number; zscore: number }> = [];
  const THRESHOLD = 1.5;

  for (let i = 0; i < values.length; i++) {
    const zscore = (values[i] - mean) / stdDev;
    if (Math.abs(zscore) > THRESHOLD) {
      anomalies.push({ index: i, value: values[i], zscore });
    }
  }

  return anomalies;
}
