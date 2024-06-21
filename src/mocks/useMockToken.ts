import {
    AssetSize,
    CollectionsType,
    TokenCategory,
} from "../generated/graphql";

const MOCK_TOKEN = {
    tokenId: "563",
    smartContractAddress: "0x9c872e8420EC38f404402Bea8F8F86D5d2C17782",
    name: "Mad Ⓥ-Apes Fusion G2 #563",
    creatorAddress: "0x9c872e8420EC38f404402Bea8F8F86D5d2C17782",
    editionsCount: 1,
    editionsOnSale: 0,
    categories: [TokenCategory.Pfp],
    attributes: [
        {
            trait_type: "Background",
            value: "Pink",
        },
        {
            trait_type: "Fur",
            value: "Canary",
        },
        {
            trait_type: "Clothes",
            value: "Space Suit",
        },
        {
            trait_type: "Headwear",
            value: "Headphones",
        },
        {
            trait_type: "Eyes",
            value: "Grey Eyes",
        },
        {
            trait_type: "Face Accessories",
            value: "None",
        },
        {
            trait_type: "Face",
            value: "War Serious Face",
        },
        {
            trait_type: "Earrings",
            value: "None",
        },
        {
            trait_type: "Weapons",
            value: "Nirvana Spear",
        },
        {
            trait_type: "Hair",
            value: "Redfox Mohawk",
        },
    ],
    score: null,
    rank: null,
    collectionId: "cb9056ca-a58e-466b-8bcb-dc6d43ebc40a",
    mintedAt: 13290585,
    minimumSaleId: null,
    minimumSalePrice: null,
    minimumSaleAddressVIP180: null,
    highestOfferId: "3000083577",
    highestOfferPrice: "2.3e+21",
    highestOfferAddressVIP180: "0x45429A2255e7248e57fce99E7239aED3f84B7a53",
    minimumAuctionId: null,
    minimumAuctionReservePrice: null,
    minimumAuctionHighestBid: null,
    minimumAuctionAddressVIP180: null,
    minimumAuctionEndTime: null,
    stakingEarnings: null,
    creator: null,
    collection: {
        collectionId: "cb9056ca-a58e-466b-8bcb-dc6d43ebc40a",
        blockchainId: null,
        smartContractAddress: "0x9c872e8420EC38f404402Bea8F8F86D5d2C17782",
        stakingContractAddresses: null,
        creatorAddress: null,
        name: "Mad Ⓥ-Apes Fusion G2",
        customUrl: "MVA-Fusion-G2",
        thumbnailImageUrl:
            "https://production-f489bc7.ams3.digitaloceanspaces.com/image/collection/thumbnail/085b410a56c0b89ac461a92c28639530.jpg",
        isVerified: true,
        isVisible: true,
        type: CollectionsType.External,
        importedAt:
            "Mon Aug 22 2022 19:10:25 GMT+0000 (Coordinated Universal Time)",
    },
    editions: [
        {
            editionId: "563",
            ownerAddress: "0x29CD5e7a3EDae8C6FAcB2933Cb2EEF2D1bA77B71",
            saleId: null,
            salePrice: null,
            saleAddressVIP180: null,
            stakingContractAddress: null,
            cooldownEnd: null,
        },
    ],
    assets: [
        {
            url: "https://wov-images.ams3.cdn.digitaloceanspaces.com/tokens/0x9c872e8420EC38f404402Bea8F8F86D5d2C17782/563/static/cover/128.webp",
            mimeType: "image/webp",
            size: AssetSize.StaticCover_128,
        },
        {
            url: "https://wov-images.ams3.cdn.digitaloceanspaces.com/tokens/0x9c872e8420EC38f404402Bea8F8F86D5d2C17782/563/static/cover/256.webp",
            mimeType: "image/webp",
            size: AssetSize.StaticCover_256,
        },
        {
            url: "https://wov-images.ams3.cdn.digitaloceanspaces.com/tokens/0x9c872e8420EC38f404402Bea8F8F86D5d2C17782/563/static/cover/512.webp",
            mimeType: "image/webp",
            size: AssetSize.AnimatedInside_512,
        },
        {
            url: "https://wov-images.ams3.cdn.digitaloceanspaces.com/tokens/0x9c872e8420EC38f404402Bea8F8F86D5d2C17782/563/animated/inside/512.webp",
            mimeType: "image/webp",
            size: AssetSize.AnimatedInside_512,
        },
        {
            url: "https://wov-images.ams3.cdn.digitaloceanspaces.com/tokens/0x9c872e8420EC38f404402Bea8F8F86D5d2C17782/563/animated/inside/1024.webp",
            mimeType: "image/webp",
            size: AssetSize.AnimatedInside_1024,
        },
        {
            url: "https://wov-images.ams3.cdn.digitaloceanspaces.com/tokens/0x9c872e8420EC38f404402Bea8F8F86D5d2C17782/563/original.png",
            mimeType: "image/png",
            size: AssetSize.Original,
        },
    ],
};

export function useMockToken() {
    return MOCK_TOKEN;
}
