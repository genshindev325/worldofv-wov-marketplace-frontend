export const COLLECTION_PFP_SORT_OPTIONS = [
    { label: "Newest", value: "newest-transfer" },
    { label: "Oldest", value: "oldest-transfer" },
    { label: "Price (Low to High)", value: "price-low-to-high" },
    { label: "Price (High to Low)", value: "price-high-to-low" },
    { label: "Offer (Low to High)", value: "offer-low-to-high" },
    { label: "Offer (High to Low)", value: "offer-high-to-low" },
    { label: "Rarity (most)", value: "rarity-high-to-low" },
    { label: "Rarity (least)", value: "rarity-low-to-high" },
    { label: "TokenID (High to Low)", value: "id-high-to-low" },
    { label: "TokenID (Low to High)", value: "id-low-to-high" },
    { label: "Alphabetical (Asc)", value: "alphabetical-asc" },
    { label: "Alphabetical (Desc)", value: "alphabetical-desc" },
];

export const COLLECTION_PFP_ON_SALE_SORT_OPTIONS = [
    { label: "Price (Low to High)", value: "price-low-to-high" },
    { label: "Price (High to Low)", value: "price-high-to-low" },
    { label: "Newest", value: "newest-transfer" },
    { label: "Oldest", value: "oldest-transfer" },
    { label: "Offer (Low to High)", value: "offer-low-to-high" },
    { label: "Offer (High to Low)", value: "offer-high-to-low" },
    { label: "Rarity (most)", value: "rarity-high-to-low" },
    { label: "Rarity (least)", value: "rarity-low-to-high" },
    { label: "TokenID (High to Low)", value: "id-high-to-low" },
    { label: "TokenID (Low to High)", value: "id-low-to-high" },
    { label: "Alphabetical (Asc)", value: "alphabetical-asc" },
    { label: "Alphabetical (Desc)", value: "alphabetical-desc" },
];

export const COLLECTION_SORT_OPTIONS = [
    { label: "Newest", value: "newest-creation" },
    { label: "Oldest", value: "oldest-creation" },
    { label: "Price (Low to High)", value: "price-low-to-high" },
    { label: "Price (High to Low)", value: "price-high-to-low" },
    { label: "Offer (Low to High)", value: "offer-low-to-high" },
    { label: "Offer (High to Low)", value: "offer-high-to-low" },
];

export const COLLECTION_ON_SALE_SORT_OPTIONS = [
    ...COLLECTION_SORT_OPTIONS,
    { label: "Recently Listed", value: "newest-listing" },
];
