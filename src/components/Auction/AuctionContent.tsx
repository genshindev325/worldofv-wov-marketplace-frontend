import useGraphQL from "@/hooks/useGraphQL";
import { useUserDataLegacy } from "@/hooks/useUserData";
import Linkify from "linkify-react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaShippingFast } from "react-icons/fa";
import { HiOutlineCubeTransparent, HiOutlineLink } from "react-icons/hi";
import styled, { useTheme } from "styled-components";
import useSWR from "swr";
import ModalBid from "../../modals/ModalBid";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { isSameAddress } from "../../utils/isSameAddress";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { CertifiedProduct } from "../common/CertifiedProduct";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import { useConnex } from "../ConnexProvider";
import ConditionalWrapper from "../HOC/ConditionalWrapper";
import Link from "../Link";
import PillsNav, { NavItemProps } from "../PillsNav";
import TokenAttributeList from "../TokenAttributeList";
import UserPreviewItem from "../UserPreviewItem";
import AuctionCountdown from "./AuctionCountdown";
import AuctionCurrentBid from "./AuctionCurrentBid";
import AuctionHistory from "./AuctionHistory";
import { useAuction } from "./AuctionProvider";

const { media, dark } = mixins;
const {
    colors: { neutrals, blue, green },
    typography: { h3, body2, captionBold1, caption2 },
} = variables;

const AuctionContent = () => {
    const user = useUserDataLegacy();
    const router = useRouter();
    const theme = useTheme();
    const { sdk } = useGraphQL();

    const { checkTransaction, bid, settleAuction, cancelAuction } = useConnex();
    const { auction, token } = useAuction();

    const navsWithProperties = [
        { label: auction?.ended ? "History" : "Bids" },
        { label: "Properties" },
        { label: "Details" },
    ];

    const navs = [
        { label: auction?.ended ? "History" : "Bids" },
        { label: "Details" },
    ];

    const navList = React.useMemo(
        () =>
            token?.attributes &&
            // pyghtails have attributes but shouldn't display properties
            token.smartContractAddress !==
                "0x5E6265680087520DC022d75f4C45F9CCD712BA97"
                ? navsWithProperties
                : navs,
        [auction?.ended]
    );

    const [isBidOpen, setIsBidOpen] = React.useState(false);

    const [selectedTab, setSelectedTab] = React.useState(navList[0].label);

    React.useEffect(() => {
        if (auction?.ended && selectedTab === "Bids") {
            setSelectedTab("History");
        }
    }, [auction?.ended, selectedTab]);

    // Only populated for Phygital tokens.
    const provenanceUrl = useMemo(
        () =>
            token?.attributes?.find((a) => a.trait_type === "provenance")
                ?.value,
        [token?.attributes]
    );
    const isPhygital = useMemo(
        () =>
            token?.attributes?.find(
                (a) => a.trait_type === "nfcChip" || a.trait_type === "NFC-Chip"
            )?.value,
        [token?.attributes]
    );

    const { data } = useSWR(
        provenanceUrl && token ? [{ token }, "GET_EDITIONS"] : null,
        ({ token }) =>
            sdk.GetEditions({
                tokenId: token.id,
                smartContractAddress: token.smartContractAddress,
            })
    );

    const selectedEdition = data?.editions?.items?.find(
        (edition) => edition.editionId === auction?.editionId
    );

    if (!auction || !token) {
        return null;
    }

    const onTabChange = (item: NavItemProps) => setSelectedTab(item.label);

    const onCancel = async () => {
        try {
            const res = await cancelAuction(
                auction.id,
                auction.editionId,
                auction.smartContractAddress
            );

            await checkTransaction({
                txID: res.txid,
                txOrigin: res.signer,
                eventName: "cancelAuctionEvent",
                toast: {
                    enabled: true,
                    success: "Auction cancelled successfully",
                },
            });
        } catch (error) {
            console.warn(error);
        }
    };

    const onSettle = async () => {
        try {
            const res = await settleAuction(
                auction.id,
                auction.editionId,
                auction.smartContractAddress
            );

            await checkTransaction({
                txID: res.txid,
                txOrigin: res.signer,
                eventName: "auctionExecuted",
                toast: {
                    enabled: true,
                    success: "Auction settled successfully!",
                },
            });

            router.push(
                `/token/${auction.smartContractAddress}/${auction.editionId}`
            );
        } catch (error) {
            console.warn(error);
        }
    };

    const onBid = async (values: any) => {
        if (!user?.canBuy) return;

        if (values.price) {
            try {
                const res = await bid(
                    auction.id,
                    auction.editionId,
                    values.price,
                    auction.payment,
                    auction.smartContractAddress
                );

                setIsBidOpen(false);

                await checkTransaction({
                    txID: res.txid,
                    txOrigin: res.signer,
                    eventName: "newBid",
                    toast: {
                        enabled: true,
                        success: "Your bid has been placed",
                    },
                });
            } catch (error) {
                console.warn(error);
            }
        }
    };

    return (
        <Container>
            <InfoWrapper>
                {isPhygital && (
                    <Flex height={50} alignItems="center" rowGap={2} mb={4}>
                        <Flex
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor={theme.colors.primary}
                            borderRadius="50%"
                            p={1}
                        >
                            <HiOutlineCubeTransparent
                                fontSize={40}
                                color="white"
                            />
                        </Flex>
                        <Link href="/phygitals" passHref>
                            <a>
                                <Text variant="bodyBold1" color="primary">
                                    NFT &amp; Phygital
                                </Text>
                            </a>
                        </Link>
                    </Flex>
                )}
                <Title>{token.name}</Title>

                {token.collection?.name && (
                    <Link
                        href={
                            token.collection?.id ||
                            token.collection?.collectionId
                                ? `/collection/${
                                      token.collection.customUrl ||
                                      token.collection.id ||
                                      token.collection.collectionId
                                  }`
                                : undefined
                        }
                        passHref
                    >
                        <Collection>{token.collection.name}</Collection>
                    </Link>
                )}
            </InfoWrapper>

            {auction.ended ? (
                auction.settled && auction.bidder ? (
                    <AuctionEndedText>
                        Auction won by{" "}
                        <Link
                            href={`/profile/${auction.bidder.address}`}
                            passHref
                        >
                            <a>{auction.bidder.username}</a>
                        </Link>
                    </AuctionEndedText>
                ) : auction.cancelled ? (
                    <AuctionEndedText>
                        The auction has been cancelled
                    </AuctionEndedText>
                ) : !auction.currentBid ? (
                    <AuctionEndedText>
                        The auction hasn&apos;t meet the reserve price of{" "}
                        <strong>
                            {auction.formattedReservePrice} {auction.payment}
                        </strong>
                    </AuctionEndedText>
                ) : user &&
                  !auction.settled &&
                  isSameAddress(auction.bidder?.address, user.address) ? (
                    <AuctionEndedText>
                        Congratulations! You won the auction for this NFT.
                        Settle the auction to add it to your collection
                    </AuctionEndedText>
                ) : null
            ) : null}

            <StyledPillsNav
                items={navList}
                value={selectedTab}
                onChange={onTabChange}
            />

            {selectedTab === "Bids" || selectedTab === "History" ? (
                <AuctionHistory />
            ) : null}

            {selectedTab === "Properties" && (
                <TokenAttributeList
                    attributes={token.attributes}
                    rank={token.rank}
                    score={token.score}
                />
            )}

            {selectedTab === "Details" && (
                <DetailsContainer>
                    {token.description && (
                        <Description>
                            <Linkify
                                options={{ ignoreTags: ["script", "style"] }}
                            >
                                {token.description}
                            </Linkify>
                        </Description>
                    )}

                    {isPhygital && (
                        <ConditionalWrapper
                            isRendered={!!provenanceUrl}
                            wrapper={(children) => (
                                <Link href={provenanceUrl as string} passHref>
                                    <a target="_blank">{children}</a>
                                </Link>
                            )}
                        >
                            <>
                                <CertifiedProduct
                                    isAuthenticated={!!provenanceUrl}
                                />
                                <Spacer y size={5} />
                            </>
                        </ConditionalWrapper>
                    )}

                    <Users>
                        <UserPreviewItem label="Creator" user={token.creator} />

                        {auction?.seller && (
                            <UserPreviewItem
                                label="Seller"
                                user={auction.seller}
                            />
                        )}
                    </Users>
                </DetailsContainer>
            )}

            <BottomWrapper>
                <AuctionInfoContainer>
                    <AuctionCurrentBid />
                    <AuctionCountdown />
                </AuctionInfoContainer>

                {user &&
                isSameAddress(user.address, auction.bidder?.address) ? (
                    <AuctionHighestBidderText>
                        You&apos;re the highest bidder!
                    </AuctionHighestBidderText>
                ) : null}

                {!auction.ended && auction.endingPhaseDate <= new Date() ? (
                    <EndingPhaseText>
                        Any bids placed in the last 10 minutes will reset the
                        countdown back to 10 minutes
                    </EndingPhaseText>
                ) : null}

                <ButtonWrapper>
                    {user &&
                        (auction.ended ? (
                            auction.settled ||
                            auction.cancelled ? null : isSameAddress(
                                  user.address,
                                  auction.seller?.address
                              ) ||
                              isSameAddress(
                                  user.address,
                                  auction.bidder?.address
                              ) ? (
                                <Button onClick={onSettle}>Settle</Button>
                            ) : null
                        ) : isSameAddress(
                              user.address,
                              auction.seller?.address
                          ) ? (
                            !auction.currentBid ? (
                                <Button onClick={onCancel}>Cancel</Button>
                            ) : null
                        ) : user.canBuy ? (
                            <Button
                                onClick={
                                    user.canBuy
                                        ? () => setIsBidOpen(true)
                                        : undefined
                                }
                                disabled={!user.canBuy || !token.canBeBought}
                            >
                                Place a bid
                            </Button>
                        ) : null)}

                    {isPhygital && (
                        <Flex alignItems="center" rowGap={3} mt={3}>
                            <FaShippingFast
                                color={theme.colors.primary}
                                fontSize={30}
                            />
                            {selectedEdition?.isFreeShipping ? (
                                <Box>
                                    <Text
                                        variant="bodyBold2"
                                        color="primaryDark10"
                                    >
                                        FREE International Shipping
                                    </Text>

                                    <Link
                                        href={`mailto:${auction.seller?.email}`}
                                    >
                                        <a>
                                            <Flex
                                                alignItems="center"
                                                rowGap={1}
                                            >
                                                <HiOutlineLink
                                                    color={theme.colors.primary}
                                                    fontSize={14}
                                                />
                                                <Text
                                                    variant="bodyBold2"
                                                    color="primaryDark10"
                                                    whiteSpace="nowrap"
                                                    underline
                                                    fontSize={{
                                                        _: "12px",
                                                        s: "16px",
                                                    }}
                                                    fontWeight={700}
                                                >
                                                    Contact the owner
                                                </Text>
                                            </Flex>
                                        </a>
                                    </Link>
                                </Box>
                            ) : (
                                <Flex rowGap={1} flexWrap="wrap">
                                    <Link
                                        href={`mailto:${auction.seller?.email}`}
                                    >
                                        <a>
                                            <Flex
                                                alignItems="center"
                                                rowGap={1}
                                            >
                                                <HiOutlineLink
                                                    color={theme.colors.primary}
                                                    fontSize={14}
                                                />
                                                <Text
                                                    variant="bodyBold2"
                                                    color="primaryDark10"
                                                    whiteSpace="nowrap"
                                                    underline
                                                    fontSize={{
                                                        _: "12px",
                                                        s: "16px",
                                                    }}
                                                    fontWeight={700}
                                                >
                                                    Contact the owner
                                                </Text>
                                            </Flex>
                                        </a>
                                    </Link>

                                    <Text
                                        variant="body2"
                                        color="primary"
                                        mt="1px"
                                        whiteSpace="nowrap"
                                        fontSize={{
                                            _: "12px",
                                            s: "16px",
                                        }}
                                    >
                                        for shipping costs
                                    </Text>
                                </Flex>
                            )}
                        </Flex>
                    )}

                    {!user && !auction.ended && !auction.settled ? (
                        <Link href="/login" passHref>
                            <a>
                                <Button>Place a bid</Button>
                            </a>
                        </Link>
                    ) : null}
                </ButtonWrapper>

                {!auction.ended && (
                    <BidIncrementText>
                        The minimum bid increment is{" "}
                        {auction.bidPercentageIncrement
                            ? `${auction.bidPercentageIncrement}%`
                            : `${auction.bidFixedIncrement} ${auction.payment}`}
                    </BidIncrementText>
                )}
            </BottomWrapper>

            <ModalBid
                isOpen={isBidOpen}
                setIsOpen={setIsBidOpen}
                onBid={onBid}
            />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 384px;
    max-height: calc(100vh - 80px - 64px - 64px);

    ${media.d`
        width: 336px;
    `}

    ${media.t`
        width: 100%;
        max-height: 100%;
    `}
`;

const InfoWrapper = styled.div`
    margin-bottom: 32px;
`;

const Title = styled.h1`
    ${h3};
    margin-bottom: 8px;
`;

const Collection = styled.div`
    cursor: pointer;
    width: fit-content;
    ${body2};
    color: ${neutrals[4]};
    transition: color 0.2s;

    &:hover {
        color: ${blue};
    }
`;

const StyledPillsNav = styled(PillsNav)`
    padding-bottom: 16px;
    border-bottom: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const DetailsContainer = styled.div`
    padding-top: 16px;
`;

const Description = styled.p`
    margin-bottom: 40px;
    ${body2};
    color: ${neutrals[4]};
    word-break: break-word;
    white-space: pre-line;

    a {
        text-decoration: underline;
        font-weight: 500;
        color: ${neutrals[2]};

        ${dark`
            color: ${neutrals[8]};
        `}

        &:hover {
            text-decoration: none;
        }
    }
`;

const Users = styled.div`
    > ${UserPreviewItem.displayName} {
        &:not(:last-child) {
            padding-bottom: 16px;
            margin-bottom: 16px;
            border-bottom: 1px solid ${neutrals[6]};

            ${dark`
                border-color: ${neutrals[3]};
            `}
        }
    }
`;

const BottomWrapper = styled.div`
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const AuctionInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ButtonWrapper = styled.div`
    margin-top: 16px;

    ${Button} {
        width: 100%;
    }
`;

const AuctionEndedText = styled.div`
    ${captionBold1};
    margin-bottom: 24px;

    a {
        font-weight: 700;
        color: ${blue};
    }
`;

const AuctionHighestBidderText = styled.div`
    ${captionBold1};
    color: ${green};
`;

const EndingPhaseText = styled.div`
    ${caption2};
    color: ${neutrals[4]};
    margin-top: 4px;
`;

const BidIncrementText = styled.div`
    margin-top: 4px;
    text-align: center;
    color: ${neutrals[4]};
    ${caption2};
`;

export default AuctionContent;
