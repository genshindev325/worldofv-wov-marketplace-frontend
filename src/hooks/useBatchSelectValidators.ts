import { SALE_BLACKLIST_COLLECTIONS } from "@/constants/saleBlacklist";
import { userAddressSelector } from "@/store/selectors";
import { isSameAddress } from "@/utils/isSameAddress";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import {
    BATCH_OFFER_TARGET_ID,
    BATCH_PURCHASE_TARGET_ID,
    BATCH_SALE_TARGET_ID,
    BATCH_STAKE_TARGET_ID,
    BATCH_TRANSFER_TARGET_ID,
    BATCH_UNLIST_TARGET_ID,
    BATCH_UPDATE_PRICE_TARGET_ID,
} from "../constants/batchSelect";
import { MarketplaceEditionFragment } from "../generated/graphql";

export default function useBatchSelectValidators() {
    const userAddress = useRecoilValue(userAddressSelector);

    const validateBatchOffer = useCallback(
        (token: any) => {
            if (token.editionsCount > 1) {
                return (
                    "Multiple edition NFTs are not supported " +
                    "for batch offers."
                );
            }

            if (isSameAddress(token.editions[0].ownerAddress, userAddress)) {
                return "You already own this NFT.";
            }
        },
        [userAddress]
    );

    const validateBatchPurchase = useCallback(
        (token: any) => {
            if (token.editionsCount > 1) {
                return (
                    "Multiple edition NFTs are not supported " +
                    "for batch purchases."
                );
            }

            if (isSameAddress(token.editions[0].ownerAddress, userAddress)) {
                return "You already own this NFT.";
            }

            if (token.editionsOnSale === 0) {
                return "This NFT is not on sale.";
            }

            if (token.minimumAuctionId) {
                return "This NFT is on auction.";
            }
        },
        [userAddress]
    );

    const validateBatchSale = useCallback(
        (token: any) => {
            if (token.editionsCount > 1) {
                return (
                    "Multiple edition NFTs are not supported " +
                    "for batch sales."
                );
            }

            if (!isSameAddress(token.editions[0].ownerAddress, userAddress)) {
                return "You don't own this NFT.";
            }

            if (token.editions[0].stakingContractAddress) {
                return "This NFT is on stake.";
            }

            if (
                token.editions.some(
                    (e: MarketplaceEditionFragment) =>
                        e.cooldownEnd && e.cooldownEnd > Date.now() / 1000
                )
            ) {
                return "This NFT is currently locked due to burning.";
            }

            if (
                SALE_BLACKLIST_COLLECTIONS.some((a) =>
                    isSameAddress(token.smartContractAddress, a)
                )
            ) {
                return "This NFT cannot be sold.";
            }
        },
        [userAddress]
    );

    const validateBatchTransfer = useCallback((token: any) => {
        if (token.editionsCount > 1) {
            return (
                "Multiple edition NFTs are not supported " +
                "for batch transfer."
            );
        }

        if (token.editionsOnSale === 1) {
            return "This NFT is on sale.";
        }

        if (token.editions[0].stakingContractAddress) {
            return "This NFT is on stake.";
        }
    }, []);

    const validateBatchUnlist = useCallback(
        (token: any) => {
            if (!isSameAddress(token.editions[0].ownerAddress, userAddress)) {
                return "You don't own this NFT.";
            }

            if (token.editionsOnSale === 0) {
                return "This NFT is not on sale.";
            }
        },
        [userAddress]
    );

    const validateBatchStake = useCallback(
        (token: any) => {
            if (token.editionsCount > 1) {
                return "Multiple edition NFTs are not supported for staking.";
            }

            if (!isSameAddress(token.editions[0].ownerAddress, userAddress)) {
                return "You don't own this NFT.";
            }

            if (token.editions[0].auctionId) {
                return "This NFT is on auction.";
            }

            if (token.editions[0].stakingContractAddress) {
                return "This NFT is already on stake.";
            }

            if (token.stakingEarnings === "0") {
                return "This NFT is not eligible for staking.";
            }
        },
        [userAddress]
    );

    const validateBatchUpdatePrice = useCallback((token: any) => {
        if (token.editionsCount > 1) {
            return (
                "Multiple edition NFTs are not supported " +
                "for batch price updates."
            );
        }
    }, []);

    return {
        [BATCH_OFFER_TARGET_ID]: validateBatchOffer,
        [BATCH_PURCHASE_TARGET_ID]: validateBatchPurchase,
        [BATCH_SALE_TARGET_ID]: validateBatchSale,
        [BATCH_TRANSFER_TARGET_ID]: validateBatchTransfer,
        [BATCH_UNLIST_TARGET_ID]: validateBatchUnlist,
        [BATCH_STAKE_TARGET_ID]: validateBatchStake,
        [BATCH_UPDATE_PRICE_TARGET_ID]: validateBatchUpdatePrice,
    };
}
