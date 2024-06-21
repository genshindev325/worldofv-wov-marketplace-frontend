import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import _ from "lodash";
import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useSWR from "swr";
import Web3 from "web3";
import { Alert } from "../components/common/Alert";
import { Button } from "../components/common/Button";
import { Divider } from "../components/common/Divider";
import { Flex } from "../components/common/Flex";
import { Text } from "../components/common/Text";
import { StakingInfo, useConnex } from "../components/ConnexProvider";
import { BATCH_CLAIM_MAX_COUNT } from "../constants/batchSelect";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import formatPrice from "../utils/formatPrice";
import AnimatedModal, { AnimatedModalProps } from "./AnimatedModal";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

export interface ModalBatchClaimProps extends AnimatedModalProps {
    collectionId: string;
}

export default function ModalBatchClaim({
    collectionId,
    ...props
}: ModalBatchClaimProps) {
    return (
        <AnimatedModal
            small
            title="Batch Claim"
            transitionProps={{ mountOnEnter: false }}
            {...props}
        >
            <ModalContent {...props} {...{ collectionId }} />
        </AnimatedModal>
    );
}

function ModalContent({ setIsOpen, collectionId }: ModalBatchClaimProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const userAddress = useRecoilValue(userAddressSelector);
    const { checkTransaction, claim, getTokenStakingInfo, getStakingInfo } =
        useConnex();

    const { sdk } = useGraphQL();

    const { data: tokens, error: apiError } = useSWR(
        [{ collectionId, ownerAddress: userAddress! }, "STAKED_TOKENS"],
        async (args) => {
            const { tokens } = await sdk.GetStakedTokens(args);
            return tokens?.items || [];
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
        }
    );

    const contractAddresses: string[] = useMemo(
        () =>
            _.uniq(
                tokens?.map((t) =>
                    Web3.utils.toChecksumAddress(t.stakingContractAddress)
                )
            ),
        [tokens]
    );

    const { data: stakeDetails, error: stakeDetailsError } = useSWR(
        [contractAddresses, "STAKING_INFO_BY_ADDRESS"],
        async (contractAddresses) => {
            const info = await Promise.all(
                contractAddresses.map((a) => getStakingInfo(a))
            );
            return contractAddresses.reduce(
                (details, address, i) => ({ ...details, [address]: info[i] }),
                {} as Record<string, StakingInfo>
            );
        }
    );

    const { data: tokenDetails, error: tokenDetailsError } = useSWR(
        [tokens, "TOKEN_STAKING_INFO_BY_ADDRESS"],
        (tokens = []) =>
            Promise.all(
                tokens.map((t) =>
                    getTokenStakingInfo(t.stakingContractAddress, t.tokenId)
                )
            )
    );

    const allClaimableTokens = useMemo(() => {
        if (!tokenDetails || !stakeDetails || !tokens) return null;

        const now = Date.now() / 1000;

        return tokens
            .map((token, i) => {
                const { startTime, earnedPerToken } = tokenDetails[i]!;

                const address = Web3.utils.toChecksumAddress(
                    token.stakingContractAddress
                );

                const { rewardsDuration, periodFinish, minimumDuration } =
                    stakeDetails[address];

                const periodStart = periodFinish - rewardsDuration;
                const startedAt = Math.max(startTime, periodStart);

                const claimableAt = Math.min(
                    startedAt + minimumDuration,
                    periodFinish
                );

                return { ...token, earnedPerToken, claimableAt };
            })
            .filter((t) => t.claimableAt <= now);
    }, [stakeDetails, tokenDetails, tokens]);

    const claimableTokens = useMemo(
        () =>
            allClaimableTokens
                ?.sort((a, b) => b.earnedPerToken.comparedTo(a.earnedPerToken))
                ?.slice(0, BATCH_CLAIM_MAX_COUNT),
        [allClaimableTokens]
    );

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

    const onSubmit = async () => {
        try {
            setLoading(true);
            setHasError(false);

            const tx = await claim(...claimableTokens!);

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "CloseTicket",
                clauseIndex: tx.clauseCount - 1,
                TIMEOUT: tx.clauseCount * 2000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your rewards have been claimed!",
                },
            });

            setIsOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    if (tokenDetailsError || stakeDetailsError || apiError) {
        return (
            <Text variant="body1" textAlign="center">
                An error occured.
            </Text>
        );
    }

    return (
        <Flex flexDirection="column" columnGap={3}>
            {!!claimableTokens?.length && (
                <>
                    {claimableTokens.map((t) => (
                        <InfoText key={t.tokenId}>
                            <span>Edition #{t.tokenId}</span>
                            <Spacer />
                            <span>
                                <strong>{formatPrice(t.earnedPerToken)}</strong>{" "}
                                WoV
                            </span>
                        </InfoText>
                    ))}

                    <Divider />
                </>
            )}

            {earnings && (
                <InfoText>
                    <span>Total earnings</span>
                    <Spacer />
                    <span>
                        <strong>{earnings}</strong> WoV
                    </span>
                </InfoText>
            )}

            {(allClaimableTokens?.length ?? 0) > BATCH_CLAIM_MAX_COUNT && (
                <Alert
                    variant="warn"
                    title="Some rewards will not be claimed"
                    text={
                        <>
                            The number of rewards to claim is bigger than the
                            batch operation limit of {BATCH_CLAIM_MAX_COUNT}{" "}
                            rewards. You will be able to claim the remaining
                            rewards by initiating another batch claim.
                        </>
                    }
                />
            )}

            {!!tokenDetails &&
                allClaimableTokens?.length !== tokens?.length && (
                    <Alert
                        variant="info"
                        title="The minimum staking time has not elapsed for some tokens"
                        text={
                            <>
                                Some rewards are not yet eligible for claim
                                because the tokens are still in the minimum
                                staking period.
                            </>
                        }
                    />
                )}

            <Button
                onClick={onSubmit}
                loader={
                    tokens?.length !== 0 &&
                    (isLoading || !tokenDetails || !stakeDetails)
                }
                disabled={!claimableTokens?.length}
            >
                {hasError ? "Retry" : "Confirm"}
            </Button>
        </Flex>
    );
}

const InfoText = styled.p`
    ${typography.body2}
    color: ${neutrals[3]};
    display: flex;

    ${dark`
        color: ${neutrals[5]};
    `}
`;

const Spacer = styled.span`
    flex: 1;
`;
