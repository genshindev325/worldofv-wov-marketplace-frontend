import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { useUserData } from "@/hooks/useUserData";
import moment from "moment";
import { transparentize } from "polished";
import { useEffect, useMemo, useState } from "react";
import Countdown, { CountdownRendererFn, zeroPad } from "react-countdown";
import styled from "styled-components";
import useSWR from "swr";
import { useMinimumStakedCount } from "../../hooks/useMinimumStakedCount";
import ModalStake from "../../modals/ModalStake";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import formatPrice from "../../utils/formatPrice";
import { isSameAddress } from "../../utils/isSameAddress";
import { Alert } from "../common/Alert";
import { Button } from "../common/Button";
import { useConnex } from "../ConnexProvider";
import { dateOptions } from "../Dashboard/InfoTop/DashboardDelegation";
import FlatLoader from "../FlatLoader";
import Link from "../Link";
import { useItem } from "./ProductDetailProvider";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

export default function ProductDetailStakingTab() {
    const { user } = useUserData();

    const blockchain = useBlockchain();
    const { token, selectedEdition, mutateEditions, mutateOffers } = useItem();

    const stakingContractAddress =
        selectedEdition.stakingContractAddress ||
        token.collection.stakingContractAddresses?.[0];

    const minimumStakedCount = useMinimumStakedCount(stakingContractAddress);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isClaiming, setClaiming] = useState(false);
    const [isUnstaking, setUnstaking] = useState(false);

    const [hasClaimError, setHasClaimError] = useState(false);
    const [hasUnstakeError, setHasUnstakeError] = useState(false);

    const [delegationInfo, setDelegationInfo] = useState<Record<string, any>>();

    const {
        getTokenStakingInfo,
        getStakingInfo,
        checkTransaction,
        checkTransactionOnBlockchain,
        unstake,
        claim,
    } = useConnex();

    const {
        data: tokenDetails,
        error: tokenDetailsError,
        mutate: mutateTokenStakeDetails,
    } = useSWR(
        stakingContractAddress
            ? [stakingContractAddress, token.id, "TOKEN_STAKING_INFO"]
            : null,
        (contractAddress, tokenId) =>
            getTokenStakingInfo(contractAddress, tokenId),
        { refreshInterval: 10 }
    );

    const { data: stakeDetails, error: stakeDetailsError } = useSWR(
        [stakingContractAddress, "STAKING_INFO"],
        (args) => getStakingInfo(args)
    );

    const earnedPerTokenWov = useMemo(
        () => formatPrice(tokenDetails?.earnedPerToken),
        [tokenDetails?.earnedPerToken]
    );

    const hasStarted = stakeDetails
        ? stakeDetails.periodFinish >= Date.now() / 1000
        : null;

    const hasEnded = stakeDetails
        ? stakeDetails.periodFinish < Date.now() / 1000
        : false;

    const minStakePeriod = useMemo(() => {
        if (stakeDetails) {
            const duration = moment.duration(
                stakeDetails.minimumDuration * 1000
            );

            const days = Math.floor(duration.asDays());
            const hours = Math.floor(duration.asHours() % 24);
            const minutes = Math.floor(duration.asMinutes() % 60);
            const seconds = Math.floor(duration.asSeconds() % 60);

            let msg = [];
            if (days) {
                msg.push(`${days} ${days > 1 ? "days" : "day"}`);
            }

            if (hours) {
                msg.push(`${hours} ${hours > 1 ? "hours" : "hour"}`);
            }

            if (minutes) {
                msg.push(`${minutes} ${minutes > 1 ? "minutes" : "minute"}`);
            }

            if (seconds) {
                msg.push(`${seconds} ${seconds > 1 ? "seconds" : "second"}`);
            }

            return msg.join(" ");
        }

        return null;
    }, [stakeDetails]);

    const startedAt = useMemo(
        () =>
            stakeDetails?.periodFinish && tokenDetails
                ? Math.max(
                      tokenDetails.startTime,
                      stakeDetails.periodFinish - stakeDetails.rewardsDuration
                  ) * 1000
                : undefined,
        [stakeDetails, tokenDetails]
    );

    const claimableAt = useMemo(
        () =>
            stakeDetails && startedAt
                ? Math.min(
                      startedAt + stakeDetails.minimumDuration * 1000,
                      stakeDetails.periodFinish * 1000
                  )
                : undefined,
        [stakeDetails, startedAt]
    );

    const [isClaimable, setIsClaimable] = useState(false);

    useEffect(() => {
        setIsClaimable(!!claimableAt && claimableAt < Date.now());
    }, [claimableAt]);

    useEffect(() => {
        const checkDelegation = async () => {
            const delegationInfo =
                await blockchain.delegationService?.getDelegationInfo();
            setDelegationInfo(delegationInfo);
        };
        checkDelegation();
    }, [blockchain.delegationService, user]);

    const cannotUnstake = useMemo(
        () =>
            delegationInfo?.distributionEndTime >
                Math.floor(new Date().getTime() / 1000) &&
            (token.collection.name === "Genesis" ||
                token.collection.name === "Genesis Special"),
        [delegationInfo?.distributionEndTime, token.collection.name]
    );

    const onClaim = async () => {
        try {
            setClaiming(true);
            setHasClaimError(false);

            const tx = await claim({
                stakingContractAddress,
                tokenId: token.id,
            });

            await checkTransactionOnBlockchain({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "RewardPaid",
                clauseIndex: tx.clauseCount - 1,
                TIMEOUT: tx.clauseCount * 2000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your rewards have been claimed!",
                },
            });

            await mutateTokenStakeDetails();
        } catch (error: any) {
            console.warn(error.message || error);
            setHasClaimError(true);
        } finally {
            setClaiming(false);
        }
    };

    const onUnstake = async () => {
        try {
            setUnstaking(true);
            setHasUnstakeError(false);

            const tx = await unstake({
                stakingContractAddress:
                    selectedEdition!.stakingContractAddress!,
                tokenId: token.id,
            });

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "CloseTicket",
                clauseIndex: tx.clauseCount - 1,
                TIMEOUT: tx.clauseCount * 2000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your token has been unstaked!",
                },
            });

            await mutateEditions();
            await mutateOffers();
        } catch (error: any) {
            console.warn(error.message || error);
            setHasUnstakeError(true);
        } finally {
            setUnstaking(false);
        }
    };

    if (tokenDetailsError || stakeDetailsError) {
        return (
            <Container>
                <InfoText>An error occured.</InfoText>
            </Container>
        );
    }

    if (!selectedEdition.stakingContractAddress) {
        return (
            <Container>
                {minimumStakedCount ? (
                    <IndividualStakeWarning
                        mode="stake"
                        {...{ minimumStakedCount }}
                    />
                ) : (
                    <>
                        {token.stakingEarnings === "0" ? (
                            <Alert
                                variant="warn"
                                title="This token is not eligible for staking."
                            />
                        ) : hasStarted === false ? (
                            <Alert
                                variant="warn"
                                title="The staking pool is not open yet"
                                text="You'll be able to stake once it goes live"
                            />
                        ) : (
                            <Alert
                                variant="info"
                                title="The token is not currently staked"
                                text={`Stake your NFT for at least ${minStakePeriod} to earn rewards`}
                            />
                        )}

                        {isSameAddress(
                            selectedEdition?.owner?.address,
                            user?.address
                        ) && (
                            <Button
                                onClick={() =>
                                    hasStarted
                                        ? setIsModalOpen(true)
                                        : undefined
                                }
                                disabled={
                                    !hasStarted || token.stakingEarnings === "0"
                                }
                            >
                                Stake
                            </Button>
                        )}

                        <ModalStake
                            isOpen={isModalOpen}
                            setIsOpen={setIsModalOpen}
                        />
                    </>
                )}
            </Container>
        );
    }

    if (!stakeDetails || !tokenDetails) {
        return (
            <Container>
                <FlatLoader size={48} style={{ margin: "auto" }} />
            </Container>
        );
    }

    return (
        <Container>
            <InfoContainer>
                <WovIcon />
                WoV earned: <strong>{earnedPerTokenWov}</strong>
            </InfoContainer>

            {!hasEnded && !isClaimable && (
                <>
                    <Countdown
                        date={claimableAt}
                        key={claimableAt}
                        renderer={countdownRenderer}
                        onComplete={() => setIsClaimable(true)}
                    />

                    <Alert
                        variant="info"
                        title="The minimum staking time has not elapsed"
                        text="Unstaking before the end of the period will result in a loss of rewards"
                    />
                </>
            )}

            {cannotUnstake && (
                <Alert
                    variant="info"
                    title="$WoV delegation is active"
                    text={`Delegation ends on ${new Date(
                        delegationInfo?.distributionEndTime * 1000
                    ).toLocaleDateString(undefined, dateOptions)}`}
                />
            )}

            {isSameAddress(selectedEdition?.owner?.address, user?.address) &&
                (minimumStakedCount ? (
                    <IndividualStakeWarning
                        mode="unstake"
                        {...{ minimumStakedCount }}
                    />
                ) : (
                    <ButtonGroup>
                        {!hasEnded && (
                            <Button
                                disabled={
                                    !isClaimable ||
                                    isUnstaking ||
                                    hasEnded ||
                                    cannotUnstake
                                }
                                loader={isClaiming}
                                onClick={onClaim}
                            >
                                {hasClaimError ? "Retry" : "Claim"}
                            </Button>
                        )}

                        <Button
                            disabled={isClaiming || cannotUnstake}
                            loader={isUnstaking}
                            onClick={onUnstake}
                            style={
                                hasEnded ? {} : { backgroundColor: colors.red }
                            }
                        >
                            {hasUnstakeError ? "Retry" : "Unstake"}
                        </Button>
                    </ButtonGroup>
                ))}
        </Container>
    );
}

interface IndividualStakeWarningProps {
    mode: "stake" | "unstake";
    minimumStakedCount: number;
}

function IndividualStakeWarning({
    mode,
    minimumStakedCount,
}: IndividualStakeWarningProps) {
    const labelTense = mode === "stake" ? "staked" : "unstaked";
    const labelPresent = mode === "stake" ? "stake" : "unstake";

    const { token } = useItem();

    const collectionUrl = useMemo(() => {
        const slug =
            token.collection.customUrl || token.collection.collectionId;
        const tab = mode === "stake" ? "collected" : "staked";
        return `/collection/${slug}?tab=${tab}`;
    }, [mode, token.collection.customUrl, token.collection.collectionId]);

    return (
        <Alert
            variant="info"
            title={`This NFT cannot be ${labelTense} individually`}
            text={
                <>
                    There is a minimum amount of {minimumStakedCount} staked
                    NFTs for this collection. You can {labelPresent} multiple
                    tokens by navigating to the{" "}
                    <Link href={collectionUrl} passHref>
                        <a>collection</a>
                    </Link>{" "}
                    page.
                </>
            }
        />
    );
}

const countdownRenderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
}) =>
    completed ? null : (
        <CountdownContainer active={!completed}>
            Claimable in:{" "}
            <CountdownValue>
                {days ? `${days}d` : null} {hours ? `${hours}h` : null}{" "}
                {minutes}m {zeroPad(seconds)}s
            </CountdownValue>
        </CountdownContainer>
    );

const Container = styled.div`
    padding-block: 16px;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    > * {
        &:not(:last-child) {
            margin-bottom: 16px;
        }
    }
`;

const InfoText = styled.p`
    ${typography.caption1}
    text-align: center;
    color: ${neutrals[3]};
    margin-bottom: 4px;

    ${dark`
        color: ${neutrals[5]};
    `}
`;

const InfoContainer = styled.div`
    ${typography.body2}
    position: relative;
    text-align: center;
    padding: 10px;
    border-radius: 24px;
    border: 2px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const WovIcon = styled.img.attrs({
    src: "/img/wov-logo.svg",
    alt: "World of V",
})`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    padding: 8px;
    padding-left: 16px;
`;

const ButtonGroup = styled.div`
    display: flex;

    & > * {
        flex: 1;

        &:not(:first-child) {
            margin-left: 16px;
        }
    }
`;

const CountdownContainer = styled<any>(InfoContainer)`
    border-color: transparent !important;
    background-color: ${({ active }) =>
        active ? colors.blue : transparentize(0.8, neutrals[4])};
    color: ${neutrals[7]};
`;

const CountdownValue = styled.span`
    ${typography.bodyBold2}
    display:inline-block;
    min-width: 96px;
    text-align: start;
`;
