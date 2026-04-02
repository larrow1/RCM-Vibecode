export interface TaxonomyCategory {
  key: string;
  label: string;
  subcategories: string[];
  keywords: string[];
}

export const STANDARD_TAXONOMY: TaxonomyCategory[] = [
  {
    key: "Revenue",
    label: "Revenue",
    subcategories: ["Product Revenue", "Service Revenue", "Other Revenue"],
    keywords: [
      "revenue",
      "sales",
      "income",
      "net sales",
      "gross sales",
      "service revenue",
      "product revenue",
      "subscription",
      "recurring revenue",
      "fee income",
    ],
  },
  {
    key: "COGS",
    label: "Cost of Goods Sold",
    subcategories: ["Materials", "Direct Labor", "Manufacturing Overhead"],
    keywords: [
      "cost of goods",
      "cogs",
      "cost of sales",
      "cost of revenue",
      "direct materials",
      "direct labor",
      "manufacturing",
      "production cost",
    ],
  },
  {
    key: "GrossProfit",
    label: "Gross Profit",
    subcategories: [],
    keywords: ["gross profit", "gross margin", "gross income"],
  },
  {
    key: "OpEx_SGA",
    label: "SG&A Expenses",
    subcategories: [
      "Salaries & Wages",
      "Benefits",
      "Rent & Facilities",
      "Office Expenses",
      "Professional Fees",
      "Insurance",
      "Travel & Entertainment",
    ],
    keywords: [
      "selling",
      "general",
      "administrative",
      "sga",
      "sg&a",
      "salaries",
      "wages",
      "payroll",
      "benefits",
      "rent",
      "lease",
      "office",
      "supplies",
      "professional fees",
      "legal",
      "accounting",
      "consulting",
      "insurance",
      "travel",
      "entertainment",
      "meals",
      "utilities",
      "telephone",
      "communications",
    ],
  },
  {
    key: "OpEx_SM",
    label: "Sales & Marketing",
    subcategories: [
      "Advertising",
      "Marketing Programs",
      "Sales Commissions",
      "Marketing Staff",
    ],
    keywords: [
      "sales expense",
      "marketing",
      "advertising",
      "promotion",
      "commission",
      "trade show",
      "brand",
      "media",
    ],
  },
  {
    key: "OpEx_RD",
    label: "Research & Development",
    subcategories: [
      "R&D Staff",
      "Lab & Equipment",
      "Product Development",
    ],
    keywords: [
      "research",
      "development",
      "r&d",
      "engineering",
      "product development",
      "innovation",
      "lab",
    ],
  },
  {
    key: "OpEx_DA",
    label: "Depreciation & Amortization",
    subcategories: ["Depreciation", "Amortization"],
    keywords: [
      "depreciation",
      "amortization",
      "d&a",
      "impairment",
      "write-down",
    ],
  },
  {
    key: "OperatingIncome",
    label: "Operating Income",
    subcategories: [],
    keywords: [
      "operating income",
      "operating profit",
      "ebit",
      "income from operations",
    ],
  },
  {
    key: "OtherIncomeExpense",
    label: "Other Income / Expense",
    subcategories: [
      "Interest Income",
      "Interest Expense",
      "Gain/Loss on Sale",
      "Foreign Exchange",
      "Other",
    ],
    keywords: [
      "interest income",
      "interest expense",
      "other income",
      "other expense",
      "gain on sale",
      "loss on sale",
      "foreign exchange",
      "fx",
      "investment income",
      "dividend",
      "non-operating",
    ],
  },
  {
    key: "Tax",
    label: "Income Tax",
    subcategories: ["Current Tax", "Deferred Tax"],
    keywords: [
      "income tax",
      "tax expense",
      "tax provision",
      "current tax",
      "deferred tax",
    ],
  },
  {
    key: "NetIncome",
    label: "Net Income",
    subcategories: [],
    keywords: ["net income", "net profit", "net loss", "net earnings", "bottom line"],
  },
];

export const CATEGORY_KEYS = STANDARD_TAXONOMY.map((c) => c.key);

/**
 * Suggest a standardCategory for a given account name using keyword matching.
 * Returns the best match key or null if no match found.
 */
export function suggestCategory(accountName: string): string | null {
  const lower = accountName.toLowerCase().trim();

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const category of STANDARD_TAXONOMY) {
    for (const keyword of category.keywords) {
      if (lower.includes(keyword)) {
        const score = keyword.length; // longer match = more specific
        if (score > bestScore) {
          bestScore = score;
          bestMatch = category.key;
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Get the display label for a category key.
 */
export function getCategoryLabel(key: string): string {
  const cat = STANDARD_TAXONOMY.find((c) => c.key === key);
  return cat?.label ?? key;
}
