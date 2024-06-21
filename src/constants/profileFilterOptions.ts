export const PROFILE_TAB_SORT_OPTIONS = [
    { label: "Newest", value: "newest-transfer" },
    { label: "Oldest", value: "oldest-transfer" },
    { label: "Offer (Low to High)", value: "offer-low-to-high" },
    { label: "Offer (High to Low)", value: "offer-high-to-low" },
    { label: "Rarity (most)", value: "rarity-high-to-low" },
    { label: "Rarity (least)", value: "rarity-low-to-high" },
    { label: "Price (Low to High)", value: "price-low-to-high" },
    { label: "Price (High to Low)", value: "price-high-to-low" },
    { label: "TokenID (Low to High)", value: "id-low-to-high" },
    { label: "TokenID (High to Low)", value: "id-high-to-low" },
    { label: "Alphabetical (Asc)", value: "alphabetical-asc" },
    { label: "Alphabetical (Desc)", value: "alphabetical-desc" },
];

export const PROFILE_TAB_ON_AUCTION_SORT_OPTIONS = [
    { label: "Auction ending soon", value: "auction-ending-soon" },
    ...PROFILE_TAB_SORT_OPTIONS,
];

export const PROFILE_TAB_ON_SALE_FILTER_OPTIONS = [
    { label: "Primary / Secondary", value: "all" },
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
];
