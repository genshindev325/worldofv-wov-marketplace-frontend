import { userAddressSelector } from "@/store/selectors";
import { useContext, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { useMinimumStakedCount } from "../../../hooks/useMinimumStakedCount";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { useCollection } from "../../../providers/CollectionProvider";
import { Alert } from "../../common/Alert";
import { Button } from "../../common/Button";
import { Divider } from "../../common/Divider";
import { Flex } from "../../common/Flex";
import { useConnex } from "../../ConnexProvider";
import { useRefresh } from "../../RefreshContext";
import StakingDetails from "../../StakingDetails";
import TokenList from "../../TokenList";

export function ModalBatchStake({ setIsOpen }: ModalContentProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const userAddress = useRecoilValue(userAddressSelector);
    const refreshCollection = useRefresh("collection-tab");
    const { collection } = useCollection();

    const minimumStakedCount = useMinimumStakedCount(
        collection.stakingContractAddresses![0]
    );

    const { checkTransaction, stake, getStakingInfo, getUserStakingInfo } =
        useConnex();

    const { selectedItems, setSelecting, deselectItem } = useContext(
        TokenBatchSelectContext
    );

    const tokenArray = useMemo(
        () => selectedItems.valueSeq().toArray(),
        [selectedItems]
    );

    const { data: stakingInfo, error: stakingInfoError } = useSWR(
        ["STAKING_INFO", collection.stakingContractAddresses![0]],
        (_, ...args) => getStakingInfo(...args)
    );

    const {
        data: stakedCount,
        error: stakedCountError,
        mutate: refreshStakedCount,
    } = useSWR(
        ["STAKED_COUNT", collection.stakingContractAddresses![0], userAddress!],
        async (_, ...args) => {
            const { stakedCount } = await getUserStakingInfo(...args);
            return stakedCount;
        },
        { revalidateOnMount: true }
    );

    const toStake = useMemo(
        () =>
            typeof stakedCount === "number"
                ? Math.max(
                      0,
                      minimumStakedCount! - stakedCount - selectedItems.size
                  )
                : null,
        [minimumStakedCount, selectedItems.size, stakedCount]
    );

    const hasStarted = stakingInfo
        ? stakingInfo.periodFinish >= Date.now() / 1000
        : null;

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const onSubmit = async (): Promise<void> => {
        try {
            setLoading(true);
            setHasError(false);

            // Make sure we don't have stale data
            const updatedStakedCount = await refreshStakedCount();
            if (updatedStakedCount !== stakedCount) return;

            const stakingContractAddress =
                collection.stakingContractAddresses![0];

            const tx = await stake(
                ...tokenArray.map((t) => ({
                    tokenId: t.tokenId,
                    smartContractAddress: t.smartContractAddress,
                    onSale: !!t.minimumSalePrice,
                    auctionId: t.minimumAuctionId,
                    saleId: t.minimumSaleId,
                    stakingContractAddress,
                }))
            );

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "Ticket",
                clauseIndex: tx.clauseCount - 1,
                TIMEOUT: tx.clauseCount * 2000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your NFTs have been staked!",
                },
            });

            await refreshCollection();

            setSelecting(false);
            setIsOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    const isDisabled =
        stakedCountError || stakingInfoError || !hasStarted || toStake;

    return (
        <Flex flexDirection="column" columnGap={3}>
            <TokenList items={tokenArray} onDeselect={deselectItem} />

            <Divider color="neutral" />

            {stakingInfo && <StakingDetails {...stakingInfo} />}

            {!!toStake && (
                <Alert
                    variant="warn"
                    title={`You need to select at least ${toStake} more tokens.`}
                    text={`The minimum number of staked tokens for this collection is ${minimumStakedCount}.`}
                />
            )}

            {(stakedCountError || stakingInfoError) && (
                <Alert variant="error" title="An error occured." />
            )}

            <Button
                onClick={onSubmit}
                disabled={isDisabled}
                loader={
                    !isDisabled &&
                    (isLoading || !stakingInfo || typeof toStake !== "number")
                }
            >
                {hasError ? "Retry" : "Confirm"}
            </Button>
        </Flex>
    );
}
