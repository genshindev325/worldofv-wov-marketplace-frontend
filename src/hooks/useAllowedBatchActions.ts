import { useCollection } from "../providers/CollectionProvider";

export default function useAllowedBatchActions() {
    const { collection, selectedTab } = useCollection();

    const canBatchSell = selectedTab.value === "collected";

    const canBatchBuy = ["all", "onsale"].includes(selectedTab.value);

    const canBatchStake =
        process.env.NEXT_PUBLIC_DISABLE_STAKING?.toLowerCase() != "true" &&
        collection.stakingContractAddresses?.length &&
        selectedTab.value === "collected";

    const canBatchUnstake =
        process.env.NEXT_PUBLIC_DISABLE_STAKING?.toLowerCase() != "true" &&
        collection.stakingContractAddresses?.length &&
        selectedTab.value === "staked";

    const canBatchOffer = ["all", "onsale"].includes(selectedTab.value);

    const canOfferToCollection =
        collection.type === "EXTERNAL" &&
        ["all", "onsale"].includes(selectedTab.value) &&
        collection?.name !== "Genesis Special";

    const canBatchTransfer = selectedTab.value === "collected";

    const canBatchUnlist = selectedTab.value === "collected";

    return {
        canBatchSell,
        canBatchBuy,
        canBatchStake,
        canBatchUnstake,
        canBatchOffer,
        canOfferToCollection,
        canBatchTransfer,
        canBatchUnlist,
    };
}
