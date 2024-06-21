import { Box } from "@/components/common/Box";
import { StakingIcon } from "@/components/common/StakingIcon";
import { Text } from "@/components/common/Text";
import { Tooltip } from "@/components/common/Tooltip";
import GenesisRoundel from "@/components/Genesis/GenesisRoundel";
import Link from "@/components/Link";
import UserAvatar from "@/components/UserAvatar";
import { MarketplaceTokenFragment } from "@/generated/graphql";
import useConvertPrices from "@/hooks/useConvertPrices";
import { useGridType } from "@/hooks/useGridType";
import { userAddressSelector } from "@/store/selectors";
import mixins from "@/styles/_mixins";
import variables from "@/styles/_variables";
import { SaleCurrency } from "@/types/Currencies";
import formatPrice from "@/utils/formatPrice";
import { getPaymentFromContractAddress } from "@/utils/getPaymentFromContractAddress";
import { isSameAddress } from "@/utils/isSameAddress";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import _ from "lodash";
import React from "react";
import AspectRatio from "react-aspect-ratio";
import ReactCountdown, { CountdownRenderProps } from "react-countdown";
import { FaLock } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import styled, { useTheme } from "styled-components";

const { dark } = mixins;

const {
    colors: { neutrals, red, green, blue },
    typography: { bodyBold2, caption2, captionBold2 },
} = variables;

enum AuctionStateEnum {
    ACTIVE = "active",
    TO_SETTLE = "to settle",
    ENDED = "ended",
}

const countdownRender = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
}: CountdownRenderProps) =>
    completed ? null : (
        <Countdown>
            {days ? (
                <CountdownValue>
                    <CountdownNumber>{days}</CountdownNumber>d
                </CountdownValue>
            ) : null}

            {hours ? (
                <CountdownValue>
                    <CountdownNumber>{hours}</CountdownNumber>h
                </CountdownValue>
            ) : null}

            {minutes ? (
                <CountdownValue>
                    <CountdownNumber>
                        {minutes.toString().padStart(2, "0")}
                    </CountdownNumber>
                    m
                </CountdownValue>
            ) : null}

            {days == null && hours < 1 && (
                <CountdownValue>
                    <CountdownNumber>
                        {seconds.toString().padStart(2, "0")}
                    </CountdownNumber>
                    s
                </CountdownValue>
            )}
        </Countdown>
    );

export type CardProps = MarketplaceTokenFragment & { className?: string };

export function Card({ className, ...token }: CardProps) {
    const gridType = useGridType();
    const userAddress = useRecoilValue(userAddressSelector);
    const theme = useTheme();

    const saleCurrency = React.useMemo(() => {
        let price;
        let currency: SaleCurrency = "VET";

        if (token.minimumAuctionId) {
            price =
                token.minimumAuctionHighestBid ||
                token.minimumAuctionReservePrice;
            currency = getPaymentFromContractAddress(
                token.minimumAuctionAddressVIP180
            ) as SaleCurrency;
        } else if (token.minimumSaleId) {
            price = token.minimumSalePrice;
            currency = getPaymentFromContractAddress(
                token.minimumSaleAddressVIP180
            ) as SaleCurrency;
        }
        return { price: new BigNumber(price ?? 0), currency };
    }, [token]);

    const otherCurrency = React.useMemo(() => {
        if (!saleCurrency) return null;
        return saleCurrency.currency === "VET" ? "WoV" : "VET";
    }, [saleCurrency]);

    const convertedPrices = useConvertPrices(
        [saleCurrency.price],
        saleCurrency.currency
    );

    const link = token.minimumAuctionId
        ? `/auction/${token.minimumAuctionId}`
        : `/token/${token.smartContractAddress}/${token.tokenId}`;

    const asset =
        token.assets.find((asset) => asset.size === "STATIC_COVER_512") ||
        token.assets[token.assets.length - 1];

    const isUserOwner =
        token.editions.find((edition) => edition.saleId === token.minimumSaleId)
            ?.ownerAddress === userAddress;

    const isPFPCreator =
        token.collection?.type === "EXTERNAL" &&
        isSameAddress(token.creatorAddress, token.smartContractAddress);

    const creator = isPFPCreator
        ? {
              name: token.collection!.name,
              address:
                  token.collection!.smartContractAddress ||
                  token.collection!.collectionId,
              customUrl: token.collection!.customUrl,
              verified: token.collection!.isVerified,
              verifiedLevel: token.collection!.isVerified
                  ? "VERIFIED"
                  : "NOT_VERIFIED",
              assets: [
                  {
                      size: "ORIGINAL",
                      mimeType: "image/*",
                      url: token.collection!.thumbnailImageUrl,
                  },
              ],
          }
        : token.creator;

    const creatorProfileImageUrl = creator?.assets?.[0]?.url;

    const showCollectionVerifiedBadge =
        token.collection?.name && (creator?.verified || isPFPCreator)
            ? true
            : false;

    const isOnCooldown = React.useMemo(() => {
        const now = Date.now() / 1000;
        return token.editions.some((e) => e.cooldownEnd && e.cooldownEnd > now);
    }, [token.editions]);

    // Only Genesis and Genesis Special generates WoV
    const doesGenerateWoV = React.useMemo(
        () =>
            token.collection?.smartContractAddress
                ? [
                      "0x93Ae8aab337E58A6978E166f8132F59652cA6C56",
                      "0x9aaB6e4e017964ec7C0F092d431c314F0CAF6B4B",
                  ].includes(token.collection?.smartContractAddress)
                : false,
        [token.collection?.smartContractAddress]
    );

    const isPhygital = token.categories
        ?.map((c) => c.toUpperCase())
        .includes("PHYGITAL");

    const phygitalLabelPosition =
        token.minimumAuctionId != null ? { bottom: 10 } : { top: 10 };

    return (
        <Link href={token.smartContractAddress && link} passHref>
            <Container className={clsx("card", className)}>
                <CardPreview>
                    {token.minimumAuctionId != null && (
                        <AuctionLiveBanner
                            state={
                                new Date(token.minimumAuctionEndTime!) >
                                new Date()
                                    ? AuctionStateEnum.ACTIVE
                                    : AuctionStateEnum.TO_SETTLE
                            }
                        >
                            {new Date(token.minimumAuctionEndTime!) > new Date()
                                ? "active"
                                : "to be settled"}
                        </AuctionLiveBanner>
                    )}

                    <AspectRatio ratio="1">
                        <CardAsset>
                            {doesGenerateWoV && (
                                <GenesisRoundel name={token.name} />
                            )}

                            {isPhygital && (
                                <Box
                                    position="absolute"
                                    {...phygitalLabelPosition}
                                    right={10}
                                    bg={`${theme.colors.white} !important`}
                                    borderRadius={2}
                                    width="auto !important"
                                    height="auto !important"
                                    px={{ _: 2, a: 3 }}
                                    py={{ _: 1, a: 2 }}
                                    zIndex={1}
                                >
                                    <Text
                                        variant="captionBold2"
                                        color="black"
                                        letterSpacing={3}
                                        fontSize={{ _: 11, a: 12 }}
                                    >
                                        PHYGITAL
                                    </Text>
                                </Box>
                            )}

                            {asset.mimeType.startsWith("video") ? (
                                <video
                                    preload="metadata"
                                    src={`${asset.url}#t=0.001`}
                                />
                            ) : (
                                <img src={asset.url} alt="NFT preview" />
                            )}
                        </CardAsset>
                    </AspectRatio>

                    {creator && creatorProfileImageUrl ? (
                        <Link
                            href={`/${
                                isPFPCreator ? "collection" : "profile"
                            }/${creator.customUrl || creator.address}`}
                            passHref
                        >
                            <a>
                                <Tooltip
                                    content={
                                        isPFPCreator
                                            ? token.collection!.name
                                            : creator.name
                                    }
                                    placement="top-start"
                                >
                                    <Avatar
                                        src={creatorProfileImageUrl}
                                        verified={creator.verified}
                                        verifiedLevel={
                                            creator.verifiedLevel as any
                                        }
                                    />
                                </Tooltip>
                            </a>
                        </Link>
                    ) : null}
                </CardPreview>

                <CardLink grid={gridType}>
                    <CardBody>
                        <CardLine>
                            {token.collection?.smartContractAddress ? (
                                <CardTitle
                                    grid={gridType}
                                    showCollectionVerifiedBadge={
                                        showCollectionVerifiedBadge
                                    }
                                >
                                    {token.collection.name === "Genesis"
                                        ? token.collection.name +
                                          " - " +
                                          token.attributes[1].value
                                        : token.collection.name ===
                                          "Mad Ⓥ-Apes Elementals"
                                        ? "MVA Elementals"
                                        : token.collection.name}
                                </CardTitle>
                            ) : (
                                <CardTitle grid={gridType}>
                                    {token.name}
                                </CardTitle>
                            )}
                            {isOnCooldown && (
                                <FaLock
                                    size={12}
                                    style={{ marginLeft: "auto" }}
                                    color="#d4af37"
                                />
                            )}
                        </CardLine>

                        {!token.collection?.smartContractAddress ? (
                            <CardCollectionLine
                                showCollectionVerifiedBadge={
                                    showCollectionVerifiedBadge
                                }
                            >
                                {token.collection?.name ? (
                                    <Link
                                        href={
                                            token.collection?.collectionId &&
                                            `/collection/${
                                                token.collection.customUrl ||
                                                token.collection.collectionId
                                            }`
                                        }
                                        passHref
                                    >
                                        <CardCollection>
                                            {token.collection.name}
                                        </CardCollection>
                                    </Link>
                                ) : (
                                    <CardCollection>&nbsp;</CardCollection>
                                )}

                                {_.isNumber(token.editions.length) ? (
                                    <span>{token.editions.length}x</span>
                                ) : null}
                            </CardCollectionLine>
                        ) : (
                            <CardCollectionLine>
                                <CardCollection>
                                    ID #{token.tokenId}
                                </CardCollection>

                                {token.collection?.smartContractAddress
                                    ? token.rank
                                        ? `Rank ${token.rank}`
                                        : null
                                    : null}
                            </CardCollectionLine>
                        )}
                    </CardBody>

                    <CardFooter
                        isSoloOffer={
                            !token.editions[0].stakingContractAddress &&
                            saleCurrency.price.isZero()
                        }
                        grid={gridType}
                    >
                        {token.editions[0].stakingContractAddress ? (
                            <Tooltip
                                content="This NFT is staked"
                                placement="top-start"
                            >
                                <a>
                                    <StakingIcon size={21} />
                                </a>
                            </Tooltip>
                        ) : null}

                        {!saleCurrency.price.isZero() && convertedPrices && (
                            <PricesContainer>
                                <Price
                                    grid={gridType}
                                    isUserOwner={isUserOwner}
                                >
                                    {convertedPrices[0]?.formattedPrices?.[
                                        saleCurrency.currency
                                    ] || "?"}{" "}
                                    {saleCurrency.currency}
                                </Price>
                                <br />
                                <CardPrice
                                    grid={gridType}
                                    isUserOwner={isUserOwner}
                                >
                                    <span>
                                        {convertedPrices[0]?.formattedPrices?.[
                                            otherCurrency!
                                        ] || "?"}{" "}
                                        {otherCurrency}
                                    </span>
                                </CardPrice>
                            </PricesContainer>
                        )}

                        {token.minimumAuctionId ? (
                            <CardStock>
                                <ReactCountdown
                                    date={token.minimumAuctionEndTime!}
                                    renderer={countdownRender}
                                />
                            </CardStock>
                        ) : token.highestOfferId ? (
                            <CardPrice grid={gridType}>
                                Offer <br />
                                <span>
                                    {formatPrice(token.highestOfferPrice)}{" "}
                                    {getPaymentFromContractAddress(
                                        token.highestOfferAddressVIP180
                                    )}
                                </span>
                            </CardPrice>
                        ) : null}
                    </CardFooter>
                </CardLink>
            </Container>
        </Link>
    );
}

interface PropsGrid {
    grid: "small" | "large";
    isUserOwner?: boolean;
}

interface FooterProps extends PropsGrid {
    isSoloOffer: boolean;
}

const CardPreview = styled.div`
    position: relative;
`;

const CardAsset = styled.div`
    overflow: hidden;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    mask-image: -webkit-radial-gradient(white, black) !important;
    -webkit-mask-image: -webkit-radial-gradient(white, black) !important;

    img,
    video,
    div {
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 1s;
        background-color: ${neutrals[6]};

        ${dark`
            background-color: ${neutrals[3]};
        `}
    }
`;

const Container = styled.a`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radii[4]}px;
    border: ${({ theme }) => `1px solid ${theme.colors.muted}`};
    background: ${({ theme }) => theme.colors.highlight};
    box-shadow: 0px 10px 16px rgba(31, 47, 69, 0.12);

    &:hover {
        ${CardAsset} {
            img,
            video {
                transform: scale(1.1);
            }
        }
    }
`;

const Avatar = styled(UserAvatar).attrs(() => ({
    size: 34,
    verifiedSize: 12,
}))`
    position: absolute;
    left: 12px;
    bottom: -17px;
    border: 2px solid ${neutrals[8]};
    border-radius: 50%;

    ${dark`
        border-color: ${neutrals[2]};
        background: ${neutrals[2]};
    `}
`;

const CardLink = styled.a<PropsGrid>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 25px 12px;
    padding-bottom: ${(props: { grid: string }) =>
        props.grid === "small" ? "8px" : "16px"};
    color: ${neutrals[2]};
    ${dark`
        color: ${neutrals[8]};
    `}
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const CardLine = styled.div`
    display: flex;
    align-items: center;

    &:first-child {
        margin-bottom: 2px;
    }

    &:nth-child(3) {
        margin-top: auto;
    }
`;

const CardCollectionLine = styled(CardLine)<{
    showCollectionVerifiedBadge?: boolean;
}>`
    position: relative;
    font-size: 12px;
    color: ${neutrals[4]};
    justify-content: space-between;
    align-items: baseline;

    ${({ showCollectionVerifiedBadge }) =>
        showCollectionVerifiedBadge &&
        `
        a {
            padding-left: 15px;

            &::after {
                content: "";
                background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzI5MzoyNDM5KSI+CjxwYXRoIGQ9Ik02IDZIMzBWMzBINlY2WiIgZmlsbD0iI0ZDRkNGRCIvPgo8cGF0aCBkPSJNMzUuMzgyNCAyMC4zODIxQzM0Ljc4MjYgMTguOTAyNSAzNC43ODI2IDE3LjI2MjkgMzUuMzgyNCAxNS44MjMyTDM1LjU4MjMgMTUuMzQzNEMzNi44NjE4IDEyLjMwNDEgMzUuMzgyNCA4Ljc4NDk3IDMyLjM0MzUgNy41MDUyOEwzMS45MDM3IDcuMzA1MzNDMzAuNDI0MyA2LjcwNTQ4IDI5LjI2NDcgNS41NDU3NiAyOC42NjUgNC4wNjYxMkwyOC41MDUgMy42NjYyMkMyNy4xODU1IDAuNjI2OTY3IDIzLjcwNjkgLTAuODEyNjggMjAuNjI4IDAuNDI3MDE2TDIwLjIyODIgMC41ODY5NzdDMTguNzQ4OCAxLjE4NjgzIDE3LjEwOTQgMS4xODY4MyAxNS42MyAwLjU4Njk3N0wxNS4yNzAxIDAuNDI3MDE2QzEyLjI3MTMgLTAuODEyNjggOC43NTI2MiAwLjY2Njk1OCA3LjQ3MzExIDMuNzA2MjFMNy4zMTMxNyA0LjAyNjEzQzYuNzEzNCA1LjUwNTc3IDUuNTUzODUgNi42NjU0OSA0LjA3NDQyIDcuMjY1MzRMMy43MTQ1NSA3LjQyNTNDMC43MTU3MDggOC43MDQ5OSAtMC43NjM3MjMgMTIuMjI0MSAwLjUxNTc4NSAxNS4yNjM0TDAuNjc1NzI0IDE1LjYyMzNDMS4yNzU0OSAxNy4xMDI5IDEuMjc1NDkgMTguNzQyNSAwLjY3NTcyNCAyMC4xODIyTDAuNTE1Nzg1IDIwLjYyMjFDLTAuNzYzNzIzIDIzLjY2MTMgMC42NzU3MjQgMjcuMTgwNSAzLjc1NDU0IDI4LjQyMDFMNC4xNTQzOSAyOC41ODAxQzUuNjMzODIgMjkuMTggNi43OTMzNyAzMC4zMzk3IDcuMzkzMTQgMzEuODE5M0w3LjU5MzA2IDMyLjI1OTJDOC44MzI1OSAzNS4zMzg0IDEyLjM1MTIgMzYuNzc4MSAxNS4zOTAxIDM1LjUzODRMMTUuODI5OSAzNS4zMzg1QzE3LjMwOTMgMzQuNzM4NiAxOC45NDg3IDM0LjczODYgMjAuNDI4MSAzNS4zMzg1TDIwLjc4OCAzNS40OTg0QzIzLjgyNjggMzYuNzc4MSAyNy4zNDU1IDM1LjI5ODUgMjguNjI1IDMyLjI1OTJMMjguNzg0OSAzMS45MzkzQzI5LjM4NDcgMzAuNDU5NiAzMC41NDQyIDI5LjI5OTkgMzIuMDIzNyAyOC43MDAxTDMyLjM0MzUgMjguNTgwMUMzNS40MjI0IDI3LjMwMDQgMzYuODYxOCAyMy44MjEzIDM1LjU4MjMgMjAuNzQyTDM1LjM4MjQgMjAuMzgyMVpNMTYuMzQ5NyAyNS43ODA4TDguNTUyNjkgMTkuMjIyNEwxMC45NTE4IDE2LjM4MzFMMTUuOTA5OSAyMC41ODIxTDI0LjY2NjUgMTAuMTg0NkwyNy41MDU0IDEyLjU4NEwxNi4zNDk3IDI1Ljc4MDhaIiBmaWxsPSIjMzc3MkZGIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMjkzOjI0MzkiPgo8cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==");
                position: absolute;
                left: 0;
                bottom: 4px;
                width: 12px;
                height: 12px;
                background-size: contain;
            }
        }
    `}
`;

type CardTitleProps = PropsGrid & {
    showCollectionVerifiedBadge?: boolean;
};

const CardTitle = styled.div<CardTitleProps>`
    padding-top: 1px;
    ${bodyBold2}
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    font-size: ${(props: { grid: string }) =>
        props.grid === "small" ? "12px" : "15px"};

    position: relative;
    justify-content: space-between;
    align-items: baseline;

    ${({ showCollectionVerifiedBadge }) =>
        showCollectionVerifiedBadge &&
        `
        {
            padding-left: 20px;

            &::after {
                content: "";
                background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzI5MzoyNDM5KSI+CjxwYXRoIGQ9Ik02IDZIMzBWMzBINlY2WiIgZmlsbD0iI0ZDRkNGRCIvPgo8cGF0aCBkPSJNMzUuMzgyNCAyMC4zODIxQzM0Ljc4MjYgMTguOTAyNSAzNC43ODI2IDE3LjI2MjkgMzUuMzgyNCAxNS44MjMyTDM1LjU4MjMgMTUuMzQzNEMzNi44NjE4IDEyLjMwNDEgMzUuMzgyNCA4Ljc4NDk3IDMyLjM0MzUgNy41MDUyOEwzMS45MDM3IDcuMzA1MzNDMzAuNDI0MyA2LjcwNTQ4IDI5LjI2NDcgNS41NDU3NiAyOC42NjUgNC4wNjYxMkwyOC41MDUgMy42NjYyMkMyNy4xODU1IDAuNjI2OTY3IDIzLjcwNjkgLTAuODEyNjggMjAuNjI4IDAuNDI3MDE2TDIwLjIyODIgMC41ODY5NzdDMTguNzQ4OCAxLjE4NjgzIDE3LjEwOTQgMS4xODY4MyAxNS42MyAwLjU4Njk3N0wxNS4yNzAxIDAuNDI3MDE2QzEyLjI3MTMgLTAuODEyNjggOC43NTI2MiAwLjY2Njk1OCA3LjQ3MzExIDMuNzA2MjFMNy4zMTMxNyA0LjAyNjEzQzYuNzEzNCA1LjUwNTc3IDUuNTUzODUgNi42NjU0OSA0LjA3NDQyIDcuMjY1MzRMMy43MTQ1NSA3LjQyNTNDMC43MTU3MDggOC43MDQ5OSAtMC43NjM3MjMgMTIuMjI0MSAwLjUxNTc4NSAxNS4yNjM0TDAuNjc1NzI0IDE1LjYyMzNDMS4yNzU0OSAxNy4xMDI5IDEuMjc1NDkgMTguNzQyNSAwLjY3NTcyNCAyMC4xODIyTDAuNTE1Nzg1IDIwLjYyMjFDLTAuNzYzNzIzIDIzLjY2MTMgMC42NzU3MjQgMjcuMTgwNSAzLjc1NDU0IDI4LjQyMDFMNC4xNTQzOSAyOC41ODAxQzUuNjMzODIgMjkuMTggNi43OTMzNyAzMC4zMzk3IDcuMzkzMTQgMzEuODE5M0w3LjU5MzA2IDMyLjI1OTJDOC44MzI1OSAzNS4zMzg0IDEyLjM1MTIgMzYuNzc4MSAxNS4zOTAxIDM1LjUzODRMMTUuODI5OSAzNS4zMzg1QzE3LjMwOTMgMzQuNzM4NiAxOC45NDg3IDM0LjczODYgMjAuNDI4MSAzNS4zMzg1TDIwLjc4OCAzNS40OTg0QzIzLjgyNjggMzYuNzc4MSAyNy4zNDU1IDM1LjI5ODUgMjguNjI1IDMyLjI1OTJMMjguNzg0OSAzMS45MzkzQzI5LjM4NDcgMzAuNDU5NiAzMC41NDQyIDI5LjI5OTkgMzIuMDIzNyAyOC43MDAxTDMyLjM0MzUgMjguNTgwMUMzNS40MjI0IDI3LjMwMDQgMzYuODYxOCAyMy44MjEzIDM1LjU4MjMgMjAuNzQyTDM1LjM4MjQgMjAuMzgyMVpNMTYuMzQ5NyAyNS43ODA4TDguNTUyNjkgMTkuMjIyNEwxMC45NTE4IDE2LjM4MzFMMTUuOTA5OSAyMC41ODIxTDI0LjY2NjUgMTAuMTg0NkwyNy41MDU0IDEyLjU4NEwxNi4zNDk3IDI1Ljc4MDhaIiBmaWxsPSIjMzc3MkZGIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMjkzOjI0MzkiPgo8cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==");
                position: absolute;
                left: 0;
                bottom: 4px;
                width: 14px;
                height: 14px;
                background-size: contain;
            }
        }
    `}
`;

const CardCollection = styled.a`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const CardFooter = styled.div<FooterProps>`
    display: flex;
    align-items: flex-end;
    justify-content: ${(props) =>
        props.isSoloOffer ? "flex-end" : "space-between"};
    margin-top: 12px;
    border-top: 1px solid ${neutrals[6]};
    ${caption2}
    color: ${neutrals[4]};
    height: ${(props: { grid: string }) =>
        props.grid === "small" ? "40px" : "50px"};
    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const PricesContainer = styled.div`
    line-height: 1.3;
`;

const Price = styled.span<PropsGrid>`
    font-weight: 600;
    color: ${(props) => (props.isUserOwner ? blue : neutrals[3])};
    white-space: nowrap;
    font-size: ${(props: { grid: string }) =>
        props.grid === "small" ? "13px" : "15px"};
    ${dark`
        color: ${(props: PropsGrid) => (props.isUserOwner ? blue : neutrals[8])}
    `}
`;

const CardPrice = styled.span<PropsGrid>`
    font-weight: 500;
    color: ${neutrals[3]};

    font-size: ${(props: { grid: string }) =>
        props.grid === "small" ? "9px" : "11px"};
    ${dark`
        color: ${neutrals[8]}}
    `};
    &:last-child {
        color: ${neutrals[4]};
        text-align: end;
        ${dark`
            color: ${neutrals[4]};
        `};
        span {
            ${dark`
            color: ${(props: PropsGrid) =>
                props.isUserOwner ? blue : neutrals[8]}
        `};
            color: ${(props) => (props.isUserOwner ? blue : neutrals[3])};
        }
    }
`;

const CardStock = styled.div``;

const AuctionLiveBanner = styled.div<{ state?: AuctionStateEnum | null }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: ${({ state }) =>
        state === AuctionStateEnum.ACTIVE
            ? green
            : state === AuctionStateEnum.ENDED
            ? red
            : state === AuctionStateEnum.TO_SETTLE
            ? blue
            : neutrals[3]};
    padding: 6px 12px;
    text-align: center;
    ${captionBold2};
    color: ${neutrals[7]};
    border-top-left-radius: ${({ theme }) => theme.radii[4]}px;
    border-top-right-radius: ${({ theme }) => theme.radii[4]}px;
`;

const Countdown = styled.div`
    display: flex;

    > *:not(:first-child) {
        margin-left: 2px;
    }
`;

const CountdownValue = styled.div`
    display: flex;
    align-items: flex-end;
    font-weight: 500;
    letter-spacing: 1px;
`;

const CountdownNumber = styled.div`
    font-weight: 600;
    color: ${neutrals[3]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;
