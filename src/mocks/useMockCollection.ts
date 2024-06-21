import { MarketplaceTokenFragment } from "../generated/graphql";

const MOCK_COLLECTION = [
    {
        tokenId: "4418",
        smartContractAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
        name: "Mad Ⓥ-Ape #4418",
        creatorAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
        editionsCount: 1,
        editionsOnSale: 0,
        categories: ["PFP"],
        attributes: [
            {
                trait_type: "Background",
                value: "Green",
            },
            {
                trait_type: "Skin",
                value: "Brown Metalic",
            },
            {
                trait_type: "Face",
                value: "White Teeth",
            },
            {
                trait_type: "Nose",
                value: "Normal",
            },
            {
                trait_type: "Nose Ring",
                value: "None",
            },
            {
                trait_type: "Bracelet",
                value: "None",
            },
            {
                trait_type: "Earring",
                value: "None",
            },
            {
                trait_type: "Eyes",
                value: "Angry",
            },
            {
                trait_type: "Eyewear",
                value: "John Lennon  Glasses",
            },
            {
                trait_type: "Headwear",
                value: "Top Knot",
            },
            {
                trait_type: "Clothes",
                value: "African Garb",
            },
            {
                trait_type: "Neckwear",
                value: "None",
            },
            {
                trait_type: "Mouthwear",
                value: "None",
            },
            {
                trait_type: "World Cup Set",
                value: "✅",
            },
            {
                trait_type: "World Cup",
                value: "Unclaimed",
            },
        ],
        score: 110.54000091552734,
        rank: 2505,
        collectionId: "fafc86fd-79a2-47ae-ae31-938f19a6022b",
        assets: [
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/thumbnail/a2d0be337553c0e5ce319cec6c3e53b4.webp",
                mimeType: "image/webp",
                size: "STATIC_COVER_128",
            },
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/preview/0ea203819e8634f2fe7614bba1c61ee3.webp",
                mimeType: "image/webp",
                size: "ANIMATED_INSIDE_512",
            },
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/original/708afe3ab16740fd1404370979391fb9.png",
                mimeType: "image/png",
                size: "ORIGINAL",
            },
        ],
        mintedAt: 10798121,
        minimumSaleId: null,
        minimumSalePrice: null,
        minimumSaleAddressVIP180: null,
        highestOfferId: "3000063646",
        highestOfferPrice: "5.5e+21",
        highestOfferAddressVIP180: "0x45429A2255e7248e57fce99E7239aED3f84B7a53",
        minimumAuctionId: null,
        minimumAuctionReservePrice: null,
        minimumAuctionHighestBid: null,
        minimumAuctionAddressVIP180: null,
        minimumAuctionEndTime: null,
        stakingEarnings: null,
        creator: null,
        collection: {
            collectionId: "fafc86fd-79a2-47ae-ae31-938f19a6022b",
            blockchainId: null,
            smartContractAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
            stakingContractAddresses: null,
            creatorAddress: null,
            name: "Mad Ⓥ-Apes",
            customUrl: "mad-vapes",
            thumbnailImageUrl:
                "https://production-f489bc7.ams3.digitaloceanspaces.com/image/collection/thumbnail/d3da5419481de88648d80e205b894a94.png",
            isVerified: true,
            isVisible: true,
            type: "EXTERNAL",
            importedAt:
                "Mon Aug 22 2022 08:21:06 GMT+0000 (Coordinated Universal Time)",
        },
        editions: [
            {
                editionId: "4418",
                ownerAddress: "0x2C43caA2B1BE58B3e1DC286f291c7Da9A40a4245",
                saleId: null,
                salePrice: null,
                saleAddressVIP180: null,
                stakingContractAddress: null,
                cooldownEnd: null,
            },
        ],
    },
    {
        tokenId: "4417",
        smartContractAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
        name: "Mad Ⓥ-Ape #4417",
        creatorAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
        editionsCount: 1,
        editionsOnSale: 0,
        categories: ["PFP"],
        attributes: [
            {
                trait_type: "Background",
                value: "Purple",
            },
            {
                trait_type: "Skin",
                value: "Normal",
            },
            {
                trait_type: "Face",
                value: "Normal",
            },
            {
                trait_type: "Nose",
                value: "Normal",
            },
            {
                trait_type: "Nose Ring",
                value: "None",
            },
            {
                trait_type: "Bracelet",
                value: "None",
            },
            {
                trait_type: "Earring",
                value: "Vechain",
            },
            {
                trait_type: "Eyes",
                value: "Angry",
            },
            {
                trait_type: "Eyewear",
                value: "Morpheus Glasses",
            },
            {
                trait_type: "Headwear",
                value: "G Cap",
            },
            {
                trait_type: "Neckwear",
                value: "Skull and Cross Bones",
            },
            {
                trait_type: "Clothes",
                value: "College Jacket",
            },
            {
                trait_type: "Mouthwear",
                value: "None",
            },
            {
                trait_type: "World Cup Set",
                value: "✅",
            },
            {
                trait_type: "World Cup",
                value: "Unclaimed",
            },
        ],
        score: 105.4800033569336,
        rank: 2764,
        collectionId: "fafc86fd-79a2-47ae-ae31-938f19a6022b",
        assets: [
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/thumbnail/559b5d1cd64549a54228cb2e76ac0271.webp",
                mimeType: "image/webp",
                size: "STATIC_COVER_128",
            },
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/preview/edb5129929c29c6c58a1c9f4b7640c3b.webp",
                mimeType: "image/webp",
                size: "ANIMATED_INSIDE_512",
            },
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/original/68433f02380ac1c2aa9c9af31cb3266b.png",
                mimeType: "image/png",
                size: "ORIGINAL",
            },
        ],
        mintedAt: 10798121,
        minimumSaleId: null,
        minimumSalePrice: null,
        minimumSaleAddressVIP180: null,
        highestOfferId: "3000063646",
        highestOfferPrice: "5.5e+21",
        highestOfferAddressVIP180: "0x45429A2255e7248e57fce99E7239aED3f84B7a53",
        minimumAuctionId: null,
        minimumAuctionReservePrice: null,
        minimumAuctionHighestBid: null,
        minimumAuctionAddressVIP180: null,
        minimumAuctionEndTime: null,
        stakingEarnings: null,
        creator: null,
        collection: {
            collectionId: "fafc86fd-79a2-47ae-ae31-938f19a6022b",
            blockchainId: null,
            smartContractAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
            stakingContractAddresses: null,
            creatorAddress: null,
            name: "Mad Ⓥ-Apes",
            customUrl: "mad-vapes",
            thumbnailImageUrl:
                "https://production-f489bc7.ams3.digitaloceanspaces.com/image/collection/thumbnail/d3da5419481de88648d80e205b894a94.png",
            isVerified: true,
            isVisible: true,
            type: "EXTERNAL",
            importedAt:
                "Mon Aug 22 2022 08:21:06 GMT+0000 (Coordinated Universal Time)",
        },
        editions: [
            {
                editionId: "4417",
                ownerAddress: "0x2C43caA2B1BE58B3e1DC286f291c7Da9A40a4245",
                saleId: null,
                salePrice: null,
                saleAddressVIP180: null,
                stakingContractAddress: null,
                cooldownEnd: null,
            },
        ],
    },
    {
        tokenId: "4416",
        smartContractAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
        name: "Mad Ⓥ-Ape #4416",
        creatorAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
        editionsCount: 1,
        editionsOnSale: 0,
        categories: ["PFP"],
        attributes: [
            {
                trait_type: "Background",
                value: "Skyblue",
            },
            {
                trait_type: "Skin",
                value: "Normal",
            },
            {
                trait_type: "Face",
                value: "Normal",
            },
            {
                trait_type: "Nose",
                value: "Normal",
            },
            {
                trait_type: "Nose Ring",
                value: "None",
            },
            {
                trait_type: "Bracelet",
                value: "None",
            },
            {
                trait_type: "Earring",
                value: "Diamonds",
            },
            {
                trait_type: "Eyes",
                value: "Angry",
            },
            {
                trait_type: "Eyewear",
                value: "Agent Glasses",
            },
            {
                trait_type: "Headwear",
                value: "None",
            },
            {
                trait_type: "Neckwear",
                value: "None",
            },
            {
                trait_type: "Clothes",
                value: "Polo Shirt",
            },
            {
                trait_type: "Mouthwear",
                value: "None",
            },
            {
                trait_type: "World Cup Set",
                value: "✅",
            },
            {
                trait_type: "World Cup",
                value: "Unclaimed",
            },
        ],
        score: 124.02999877929688,
        rank: 1872,
        collectionId: "fafc86fd-79a2-47ae-ae31-938f19a6022b",
        assets: [
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/thumbnail/eb2590d099e5e43945ceb8d95c777d83.webp",
                mimeType: "image/webp",
                size: "STATIC_COVER_128",
            },
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/preview/3baccf8895959d7204740379f5b14801.webp",
                mimeType: "image/webp",
                size: "ANIMATED_INSIDE_512",
            },
            {
                url: "https://production-f489bc7.ams3.digitaloceanspaces.com/image/token/original/48cade7d0328145a0d64a2c28a32e0ee.png",
                mimeType: "image/png",
                size: "ORIGINAL",
            },
        ],
        mintedAt: 10798121,
        minimumSaleId: null,
        minimumSalePrice: null,
        minimumSaleAddressVIP180: null,
        highestOfferId: "3000063646",
        highestOfferPrice: "5.5e+21",
        highestOfferAddressVIP180: "0x45429A2255e7248e57fce99E7239aED3f84B7a53",
        minimumAuctionId: null,
        minimumAuctionReservePrice: null,
        minimumAuctionHighestBid: null,
        minimumAuctionAddressVIP180: null,
        minimumAuctionEndTime: null,
        stakingEarnings: null,
        creator: null,
        collection: {
            collectionId: "fafc86fd-79a2-47ae-ae31-938f19a6022b",
            blockchainId: null,
            smartContractAddress: "0xFFcC1c4492c3b49825712e9A8909E4fCEBfE6C02",
            stakingContractAddresses: null,
            creatorAddress: null,
            name: "Mad Ⓥ-Apes",
            customUrl: "mad-vapes",
            thumbnailImageUrl:
                "https://production-f489bc7.ams3.digitaloceanspaces.com/image/collection/thumbnail/d3da5419481de88648d80e205b894a94.png",
            isVerified: true,
            isVisible: true,
            type: "EXTERNAL",
            importedAt:
                "Mon Aug 22 2022 08:21:06 GMT+0000 (Coordinated Universal Time)",
        },
        editions: [
            {
                editionId: "4416",
                ownerAddress: "0x2C43caA2B1BE58B3e1DC286f291c7Da9A40a4245",
                saleId: null,
                salePrice: null,
                saleAddressVIP180: null,
                stakingContractAddress: null,
                cooldownEnd: null,
            },
        ],
    },
] as MarketplaceTokenFragment[];

export function useMockCollection(ownerAddress?: string) {
    return ownerAddress != null
        ? MOCK_COLLECTION.map((c) => ({
              ...c,
              editions: [
                  { ...c.editions[0], ownerAddress },
                  ...c.editions.slice(1),
              ],
          }))
        : MOCK_COLLECTION;
}
