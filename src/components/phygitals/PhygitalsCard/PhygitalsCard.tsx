import { BoxProps } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import { MarketplaceTokenFragment } from "@/generated/graphql";
import useConvertPrices from "@/hooks/useConvertPrices";
import { SaleCurrency } from "@/types/Currencies";
import formatPrice from "@/utils/formatPrice";
import { getPaymentFromContractAddress } from "@/utils/getPaymentFromContractAddress";
import BigNumber from "bignumber.js";
import clsx from "clsx";
import React from "react";
import AspectRatio from "react-aspect-ratio";
import ReactCountdown, { CountdownRenderProps } from "react-countdown";
import styled from "styled-components";
import Link from "../../Link";

type FloatBoxProps = Pick<BoxProps, "backgroundColor"> & {
    label: string;
    children: React.ReactElement;
};

function FloatBox({ children, label, ...boxProps }: FloatBoxProps) {
    return (
        <StyledFlex
            position="absolute"
            bottom={3}
            left="50%"
            px={4}
            py={2}
            borderRadius={3}
            minWidth={180}
            {...boxProps}
        >
            <Text
                color="white"
                fontSize={4}
                textAlign="center"
                whiteSpace="nowrap"
            >
                {label}: {children}
            </Text>
        </StyledFlex>
    );
}

const countdownRender = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
}: CountdownRenderProps) =>
    completed ? null : (
        <strong>
            {days != null && <span>{days}d </span>}
            {hours != null && <span>{hours}h </span>}
            {minutes != null && (
                <span>{minutes.toString().padStart(2, "0")}m </span>
            )}
            {days == null && hours < 1 && (
                <span>{seconds.toString().padStart(2, "0")}s</span>
            )}
        </strong>
    );

export type PhygitalsCardProps = MarketplaceTokenFragment & {
    className?: string;
};

export function PhygitalsCard({ className, ...token }: PhygitalsCardProps) {
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

    return (
        <Link href={token.smartContractAddress && link} passHref>
            <Container className={clsx("card", className)}>
                <CardPreview>
                    <AspectRatio ratio="1.1">
                        <CardAsset>
                            {asset.mimeType.startsWith("video") ? (
                                <video
                                    className="asset"
                                    preload="metadata"
                                    src={`${asset.url}#t=0.001`}
                                />
                            ) : (
                                <img
                                    src={asset.url}
                                    alt="NFT preview"
                                    className="asset"
                                />
                            )}

                            {token.minimumAuctionId != null &&
                            token.minimumAuctionEndTime != null ? (
                                <FloatBox
                                    backgroundColor={
                                        new Date(token.minimumAuctionEndTime) >
                                        new Date()
                                            ? "success"
                                            : "primary"
                                    }
                                    label="Auction"
                                >
                                    <span>
                                        {new Date(token.minimumAuctionEndTime) >
                                        new Date() ? (
                                            <ReactCountdown
                                                date={
                                                    token.minimumAuctionEndTime
                                                }
                                                renderer={countdownRender}
                                            />
                                        ) : (
                                            "to be settled"
                                        )}
                                    </span>
                                </FloatBox>
                            ) : token.highestOfferId ? (
                                <FloatBox
                                    backgroundColor="primary"
                                    label="Offer"
                                >
                                    <strong>
                                        {formatPrice(token.highestOfferPrice)}{" "}
                                        {getPaymentFromContractAddress(
                                            token.highestOfferAddressVIP180
                                        )}
                                    </strong>
                                </FloatBox>
                            ) : null}
                        </CardAsset>
                    </AspectRatio>
                </CardPreview>

                <Flex flexDirection="column" flexGrow={1} minHeight={106}>
                    <Flex flexDirection="column" flexGrow={1} mt={4}>
                        <Flex alignItems="center" justifyContent="center">
                            <Text
                                variant="h3"
                                fontFamily="Poppins"
                                fontSize={6}
                                textOverflow="ellipsis"
                                overflow="hidden"
                                whiteSpace="nowrap"
                                textAlign="center"
                            >
                                {token.name}
                            </Text>
                        </Flex>
                    </Flex>

                    {!saleCurrency.price.isZero() && convertedPrices && (
                        <Flex flexDirection="column" alignItems="center" mt={4}>
                            <Text fontSize={5} fontWeight="bold" lineHeight={1}>
                                {convertedPrices[0]?.formattedPrices?.[
                                    saleCurrency.currency
                                ] || "?"}{" "}
                                {saleCurrency.currency}
                            </Text>
                            <Text color="accent" fontSize={4}>
                                <span>
                                    {convertedPrices[0]?.formattedPrices?.[
                                        otherCurrency!
                                    ] || "?"}{" "}
                                    {otherCurrency}
                                </span>
                            </Text>
                        </Flex>
                    )}
                    {/* </Flex> */}
                </Flex>
            </Container>
        </Link>
    );
}

const CardPreview = styled.div`
    position: relative;
`;

const CardAsset = styled.div`
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radii[4]}px;
    mask-image: -webkit-radial-gradient(white, black) !important;
    -webkit-mask-image: -webkit-radial-gradient(white, black) !important;
    position: relative;

    .asset {
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 1s;
        background-color: ${({ theme }) => theme.colors.neutral};
    }
`;

const Container = styled.a`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radii[4]}px;
    // box-shadow: 0px 10px 16px rgba(31, 47, 69, 0.12);

    &:hover {
        ${CardAsset} {
            img,
            video {
                transform: scale(1.1);
            }
        }
    }
`;

const StyledFlex = styled(Flex)`
    transform: translate(-50%, 0%);
`;
