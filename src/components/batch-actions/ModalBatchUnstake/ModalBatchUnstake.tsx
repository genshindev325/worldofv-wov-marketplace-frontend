import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import _ from "lodash";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import Web3 from "web3";
import { useGetMinimumStakedCount } from "../../../hooks/useMinimumStakedCount";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import formatPrice from "../../../utils/formatPrice";
import getShortAddress from "../../../utils/getShortAddress";
import { Alert } from "../../common/Alert";
import { Button } from "../../common/Button";
import { Divider } from "../../common/Divider";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import { StakingInfo, useConnex } from "../../ConnexProvider";
import { useRefresh } from "../../RefreshContext";
import TokenList from "../../TokenList";

export function ModalBatchUnstake({ setIsOpen }: ModalContentProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const userAddress = useRecoilValue(userAddressSelector);

    const refreshCollection = useRefresh("collection-tab");
    const getMinimumStakedCount = useGetMinimumStakedCount();

    const {
        checkTransaction,
        unstake,
        getTokenStakingInfo,
        getStakingInfo,
        getUserStakingInfo,
    } = useConnex();

    const { selectedItems, setSelecting, deselectItem } = useContext(
        TokenBatchSelectContext
    );

    const tokenArray = useMemo(
        () => selectedItems.valueSeq().toArray(),
        [selectedItems]
    );

    const contractAddresses: string[] = useMemo(
        () =>
            _.uniq(
                tokenArray.map((t) =>
                    Web3.utils.toChecksumAddress(
                        t.editions[0].stakingContractAddress
                    )
                )
            ),
        [tokenArray]
    );

    const fetchStakeDetailsByAddress = useCallback(
        async (contractAddresses: string[]) => {
            const info = await Promise.all(
                contractAddresses.map((a) => getStakingInfo(a))
            );
            return contractAddresses.reduce(
                (details, address, i) => ({ ...details, [address]: info[i] }),
                {} as Record<string, StakingInfo>
            );
        },
        [getStakingInfo]
    );

    const { data: stakeDetailsByAddress, error: stakeDetailsError } = useSWR(
        [contractAddresses, "STAKING_INFO_BY_ADDRESS"],
        fetchStakeDetailsByAddress
    );

    const fetchTokenDetails = useCallback(
        (tokenArray: any[]) =>
            Promise.all(
                tokenArray.map((token) =>
                    getTokenStakingInfo(
                        token.editions[0].stakingContractAddress,
                        token.tokenId
                    )
                )
            ),
        [getTokenStakingInfo]
    );

    const { data: tokenDetails, error: tokenDetailsError } = useSWR(
        [tokenArray, "TOKEN_STAKING_INFO_BY_ADDRESS"],
        fetchTokenDetails
    );

    const fetchStakedCountsByAddress = useCallback(
        async (contractAddresses: string[], userAddress: string) => {
            const info = await Promise.all(
                contractAddresses.map((a) => getUserStakingInfo(a, userAddress))
            );
            return contractAddresses.reduce(
                (vs, addr, i) => ({ ...vs, [addr]: info[i].stakedCount }),
                {} as Record<string, number>
            );
        },
        [getUserStakingInfo]
    );

    const {
        data: stakedCountsByAddress,
        error: stakedCountsError,
        mutate: refreshStakedCounts,
    } = useSWR(
        [contractAddresses, userAddress!, "STAKED_COUNTS_BY_ADDRESS"],
        fetchStakedCountsByAddress,
        { revalidateOnMount: true }
    );

    const [claimableTokens, unclaimableTokens] = useMemo(() => {
        if (!tokenDetails || !stakeDetailsByAddress) return [null, null];

        const tokens = tokenArray.map((token, i) => {
            const { startTime, earnedPerToken } = tokenDetails[i]!;

            const address = Web3.utils.toChecksumAddress(
                token.editions[0].stakingContractAddress
            );

            const { rewardsDuration, periodFinish, minimumDuration } =
                stakeDetailsByAddress[address];

            const periodStart = periodFinish - rewardsDuration;
            const startedAt = Math.max(startTime, periodStart);

            const claimableAt = Math.min(
                startedAt + minimumDuration,
                periodFinish
            );

            const label = new Date(claimableAt * 1000).toLocaleString();

            return {
                tokenId: token.tokenId,
                earnedPerToken,
                claimableAt,
                claimableAtLabel: label,
            };
        });

        const now = Date.now() / 1000;
        return _.partition(tokens, (t) => t.claimableAt < now);
    }, [stakeDetailsByAddress, tokenArray, tokenDetails]);

    const earnings = useMemo(
        () =>
            formatPrice(
                claimableTokens?.reduce(
                    (acc, t) => acc.plus(t.earnedPerToken),
                    new BigNumber(0)
                )
            ),
        [claimableTokens]
    );

    /**
     * Contains information about the contracts where the minimum staked count
     * would be violated if the transaction was executed.
     */
    const invalidStakedCounts = useMemo(() => {
        if (!stakedCountsByAddress) return null;

        const invalid = [];

        const selectedCounts = _.countBy(tokenArray, (t) =>
            Web3.utils.toChecksumAddress(t.editions[0].stakingContractAddress)
        );

        for (const [address, count] of Object.entries(stakedCountsByAddress)) {
            const predictedCount = Math.max(0, count - selectedCounts[address]);
            const minimumCount = getMinimumStakedCount(address) || 0;

            if (predictedCount > 0 && predictedCount < minimumCount) {
                invalid.push({
                    address: getShortAddress(address),
                    minimumCount,
                    predictedCount,
                });
            }
        }

        return invalid;
    }, [getMinimumStakedCount, stakedCountsByAddress, tokenArray]);

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const hasNetworkError = Boolean(
        stakedCountsError || stakeDetailsError || tokenDetailsError
    );

    const onSubmit = async () => {
        try {
            setLoading(true);
            setHasError(false);

            // Make sure we don't have stale data
            const updatedCounts = await refreshStakedCounts();
            if (!_.isEqual(updatedCounts, stakedCountsByAddress)) {
                return;
            }

            const tx = await unstake(
                ...tokenArray.map((t) => {
                    return {
                        tokenId: t.tokenId,
                        stakingContractAddress:
                            t.editions[0].stakingContractAddress,
                    };
                })
            );

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "CloseTicket",
                clauseIndex: tx.clauseCount - 1,
                TIMEOUT: tx.clauseCount * 2000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your NFTs have been unstaked!",
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

    return (
        <Flex flexDirection="column" columnGap={3}>
            <TokenList
                showStakingContract={contractAddresses.length > 1}
                items={tokenArray}
                onDeselect={deselectItem}
            />

            <Divider color="neutral" />

            {earnings && (
                <Text variant="body2" color="neutral">
                    Total earnings:
                    <span style={{ float: "right" }}>
                        <strong>{earnings}</strong> WoV
                    </span>
                </Text>
            )}

            {!!unclaimableTokens?.length && (
                <Alert
                    variant="warn"
                    title={
                        "The minimum staking time has not elapsed for some tokens"
                    }
                    text={
                        <>
                            <p>
                                Unstaking before the end of the period will
                                result in a loss of rewards
                            </p>
                            <br />
                            <ul>
                                {unclaimableTokens.map(
                                    ({ tokenId, claimableAtLabel }) => (
                                        <li key={tokenId}>
                                            • Token #{tokenId} will be eligible
                                            for claim on {claimableAtLabel}
                                        </li>
                                    )
                                )}
                            </ul>
                        </>
                    }
                />
            )}

            {!!invalidStakedCounts?.length &&
                invalidStakedCounts.map(
                    ({ address, minimumCount, predictedCount }) => (
                        <Alert
                            key={address}
                            variant="error"
                            title={`Not enough NFTs left on stake for contract ${address}.`}
                            text={
                                <>
                                    The minimum number of staked NFTs for this
                                    contract is {minimumCount}, but performing
                                    the transaction would leave {predictedCount}{" "}
                                    NFTs on stake.
                                </>
                            }
                        />
                    )
                )}

            {hasNetworkError && (
                <Alert variant="error" title="An error occured." />
            )}

            <Button
                onClick={onSubmit}
                loader={isLoading || !tokenDetails || !stakeDetailsByAddress}
                disabled={hasNetworkError || !!invalidStakedCounts?.length}
            >
                {hasError ? "Retry" : "Confirm"}
            </Button>
        </Flex>
    );
}
