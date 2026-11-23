/**
 * The uGNET application fee and how it is worked out: the fee before tax,
 * less any coupon, then 18% IGST on what is left. With no coupon it comes
 * to ₹1,000, the fee sot.upgrad.com/uGNET gives (₹847.46 + ₹152.54 IGST),
 * as in the admissions team's payment summary.
 *
 * The coupons here are test codes so the summary can be tried end to end;
 * real ones will be checked by the admissions back end once it is wired
 * up.
 */

export const BASE_FEE = 847.46;
export const GST_RATE = 0.18;

type Coupon = { label: string; off: (base: number) => number };

export const COUPONS: Record<string, Coupon> = {
  UGSOT10: { label: "10% off", off: (base) => base * 0.1 },
  EARLYBIRD: { label: "₹200 off", off: () => 200 },
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export type FeeSummary = {
  base: number;
  discount: number;
  subtotal: number;
  igst: number;
  total: number;
  coupon?: string;
};

/** the summary, with a coupon applied if its code is known */
export function feeSummary(code?: string): FeeSummary {
  const coupon = code ? COUPONS[code] : undefined;
  const discount = coupon
    ? round2(Math.min(BASE_FEE, coupon.off(BASE_FEE)))
    : 0;
  const subtotal = round2(BASE_FEE - discount);
  const igst = round2(subtotal * GST_RATE);
  return {
    base: BASE_FEE,
    discount,
    subtotal,
    igst,
    total: round2(subtotal + igst),
    coupon: coupon ? code : undefined,
  };
}

/** a coupon code as typed, tidied (upper case, no spaces) */
export const normaliseCode = (code: string) =>
  code.trim().toUpperCase().replace(/\s+/g, "");

/** ₹ with paise: "₹1,000.00" */
export const money = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
