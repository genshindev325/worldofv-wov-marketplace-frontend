export const PURCHASE_CURRENCIES = [
    "VET",
    "WoV",
    "VSEA",
    "VEUSD",
    // "vVET",
    "VTHO",
    "SHA",
] as const;

export type PurchaseCurrency = (typeof PURCHASE_CURRENCIES)[number];

export const SALE_CURRENCIES = ["VET", "WoV"] as const;

export type SaleCurrency = (typeof SALE_CURRENCIES)[number];

/** Array of all currencies */
export const CURRENCIES = [
    "VET",
    "WoV",
    "vVET",
    "VTHO",
    "VEUSD",
    "SHA",
    "VSEA",
] as const;

export type Currency = (typeof CURRENCIES)[number];

export const OFFER_CURRENCIES = ["vVET", "WoV"] as const;

export type OfferCurrency = (typeof OFFER_CURRENCIES)[number];

export const AUCTION_CURRENCIES = ["VET", "WoV"] as const;

export type AuctionCurrency = (typeof AUCTION_CURRENCIES)[number];
