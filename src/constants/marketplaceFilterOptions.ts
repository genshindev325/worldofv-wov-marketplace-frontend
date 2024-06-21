import { SaleCurrency } from "../types/Currencies";
import CATEGORIES from "./categories";

export type PaymentOption = SaleCurrency | "ALL";

export const PAYMENT_OPTIONS: { label: string; value: PaymentOption }[] = [
    { label: "VET & WoV", value: "ALL" },
    { label: "VET", value: "VET" },
    { label: "WoV", value: "WoV" },
];

export const CATEGORY_OPTIONS = [
    { label: "All Categories", value: "all" },
    { label: "Phygital", value: "phygital" },
    ...CATEGORIES,
];

export const SORT_OPTIONS = [
    { label: "Newest", value: "newest-listing" },
    { label: "Oldest", value: "oldest-listing" },
    { label: "Price (Low to High)", value: "price-low-to-high" },
    { label: "Price (High to Low)", value: "price-high-to-low" },
    { label: "Offer (Low to High)", value: "offer-low-to-high" },
    { label: "Offer (High to Low)", value: "offer-high-to-low" },
    { label: "Rarity (most)", value: "rarity-high-to-low" },
    { label: "Rarity (least)", value: "rarity-low-to-high" },
    { label: "Auction ending soon", value: "auction-ending-soon" },
    { label: "Alphabetical (Asc)", value: "alphabetical-asc" },
    { label: "Alphabetical (Desc)", value: "alphabetical-desc" },
];

export const CREATOR_OPTIONS = [
    { label: "Verified & Curated", value: "verified-and-curator" },
    { label: "Curated", value: "curator" },
    { label: "Verified", value: "verified" },
    { label: "All", value: "all" },
];

export const FILTER_SORT_OPTIONS = [
    { label: "Sort", value: "sort", options: SORT_OPTIONS },
    { label: "Filter", value: "filter", options: CREATOR_OPTIONS },
];

// TODO: add types and make the values match the graphql spec (all uppercase)
export const TOKEN_TYPE_FILTER_OPTIONS = [
    { label: "Art & PFPs", value: "all" },
    { label: "Art only", value: "artist" },
    { label: "PFP only", value: "pfp" },
];
