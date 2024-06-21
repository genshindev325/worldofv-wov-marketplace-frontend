import usePriceConversion from "@/hooks/usePriceConversion";
import BigNumber from "bignumber.js";
import { useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import styled from "styled-components";
import { CollectionFragment, VerifiedStatus } from "../../generated/graphql";
import formatPrice from "../../utils/formatPrice";
import { Box } from "../common/Box";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Link from "../Link";
import UserAvatar from "../UserAvatar";

interface FloorPrice {
    price?: string | null;
    currency: string;
}

interface CollectionStats {
    smartContactAddress: string;
    name?: string | null;
    itemsSold?: number | null;
    percentageChange?: string | null;
    volumeSumInVet?: string | null;
    volumeVET?: string | null;
    volumeWOV?: string | null;
    floorPrice: FloorPrice;
    collection?: CollectionFragment | null;
    ownerCount: number;
    totalItemsSold: number;
    totalVolumeVET: string;
    totalVolumeWOV: string;
    totalVolumeSumInVet: string;
    averagePriceVET: string;
    averagePriceWOV: string;
}

interface TrendingCollectionsTableProps {
    collectionStats: CollectionStats;
    idx: number;
}

const TrendingCollectionsTable: React.FC<TrendingCollectionsTableProps> = ({
    collectionStats,
    idx,
}) => {
    const {
        smartContactAddress,
        collection,
        name,
        floorPrice,
        itemsSold,
        volumeVET,
        volumeWOV,
        volumeSumInVet,
        percentageChange,
        ownerCount,
        totalItemsSold,
        totalVolumeVET,
        totalVolumeWOV,
        totalVolumeSumInVet,
        averagePriceVET,
        averagePriceWOV,
    } = collectionStats;
    const priceConversion = usePriceConversion();
    const [isOpen, setIsOpen] = useState(false);

    const otherCurrency = floorPrice.currency === "VET" ? "WoV" : "VET";
    return (
        <Box position="relative">
            <Link
                href={
                    collection?.isVisible
                        ? `/collection/${smartContactAddress}`
                        : ""
                }
                passHref
            >
                <StyledFlex
                    alignItems="center"
                    justifyContent={{ _: "space-between", d: "flex-start" }}
                    py={{ _: 1, d: 2 }}
                >
                    <Flex width={{ _: "unset", d: "20%" }} alignItems="center">
                        <Text mx="2.5%" variant="captionBold2">
                            {idx + 1}.
                        </Text>

                        <Flex alignItems="center" rowGap={3}>
                            <UserAvatar
                                src={collection?.thumbnailImageUrl ?? ""}
                                size={65}
                                verified={collection?.isVerified}
                                verifiedLevel={VerifiedStatus.Verified}
                                verifiedSize={18}
                                altText="Collection Thumbnail"
                            />
                            <Text variant="captionBold2">{name}</Text>
                        </Flex>
                    </Flex>
                    <Flex
                        width="20%"
                        flexDirection={{ _: "column", d: "row" }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box width={{ _: "100%", d: "80%" }}>
                            <Text
                                textAlign="center"
                                variant="captionBold2"
                                mx="auto"
                            >
                                {formatPrice(volumeSumInVet)} VET
                            </Text>
                            {!!parseInt(volumeWOV ?? "") && (
                                <Flex justifyContent="center" rowGap={3}>
                                    <Text
                                        variant="caption3"
                                        color="accent"
                                        whiteSpace="nowrap"
                                    >
                                        {formatPrice(volumeVET)} VET
                                    </Text>
                                    <Text
                                        variant="caption3"
                                        color="accent"
                                        whiteSpace="nowrap"
                                    >
                                        {formatPrice(volumeWOV)} WoV
                                    </Text>
                                </Flex>
                            )}
                        </Box>
                        <Text
                            width={{ _: "100%", d: "20%" }}
                            color={
                                percentageChange
                                    ? parseFloat(percentageChange) > 0
                                        ? "success"
                                        : "error"
                                    : "accent"
                            }
                            variant="captionBold2"
                            whiteSpace="nowrap"
                            fontSize={{ _: 2, d: "inherit" }}
                            textAlign={{ _: "center", d: "start" }}
                        >
                            {percentageChange
                                ? `${
                                      parseFloat(percentageChange) > 0
                                          ? "+"
                                          : ""
                                  }${parseFloat(percentageChange).toFixed()}
                    %`
                                : "--"}
                        </Text>
                    </Flex>
                    <Text
                        width="8%"
                        textAlign="center"
                        display={{ _: "none", d: "inline" }}
                        variant="captionBold2"
                    >
                        {itemsSold}
                    </Text>

                    <Box
                        width="10%"
                        display={{ _: "none", d: "flex" }}
                        flexDirection="column"
                        alignItems="center"
                    >
                        {!!floorPrice.price ? (
                            <>
                                <Text variant="captionBold2">
                                    {formatPrice(floorPrice.price)}{" "}
                                    {floorPrice.currency}
                                </Text>
                                <Text variant="caption3" color="accent">
                                    {priceConversion &&
                                        formatPrice(
                                            new BigNumber(floorPrice.price)
                                                .multipliedBy(
                                                    priceConversion[
                                                        floorPrice.currency as
                                                            | "VET"
                                                            | "WoV"
                                                    ]
                                                )
                                                .dividedBy(
                                                    priceConversion[
                                                        otherCurrency
                                                    ]
                                                )
                                        )}{" "}
                                    {otherCurrency}
                                </Text>
                            </>
                        ) : (
                            <Text variant="captionBold2">--</Text>
                        )}
                    </Box>
                    <Box
                        width="10%"
                        display={{ _: "none", d: "flex" }}
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Text variant="captionBold2">
                            {formatPrice(averagePriceVET)} VET
                        </Text>
                        <Text variant="caption3" color="accent">
                            {priceConversion && formatPrice(averagePriceWOV)}{" "}
                            WoV
                        </Text>
                    </Box>
                    <Text
                        width="10%"
                        textAlign="center"
                        display={{ _: "none", d: "inline" }}
                        variant="captionBold2"
                    >
                        {ownerCount}
                    </Text>
                    <Text
                        width="6%"
                        textAlign="center"
                        display={{ _: "none", d: "inline" }}
                        variant="captionBold2"
                    >
                        {totalItemsSold}
                    </Text>
                    <Box display={{ _: "none", d: "block" }} width="20%">
                        <Text
                            textAlign="center"
                            variant="captionBold2"
                            pt={{ _: 3, d: "unset" }}
                            mx="auto"
                        >
                            {formatPrice(totalVolumeSumInVet)} VET
                        </Text>
                        {!!parseInt(totalVolumeWOV ?? "") && (
                            <Flex justifyContent="center" rowGap={3}>
                                <Text
                                    variant="caption3"
                                    color="accent"
                                    whiteSpace="nowrap"
                                >
                                    {formatPrice(totalVolumeVET)} VET
                                </Text>
                                <Text
                                    variant="caption3"
                                    color="accent"
                                    whiteSpace="nowrap"
                                >
                                    {formatPrice(totalVolumeWOV)} WoV
                                </Text>
                            </Flex>
                        )}
                    </Box>
                </StyledFlex>
            </Link>

            <Box
                position="absolute"
                alignItems="center"
                bottom={1}
                mx="auto"
                width={40}
                left={20}
                right={0}
                onClick={() => setIsOpen(!isOpen)}
                display={{ _: "flex", d: "none" }}
            >
                {!isOpen ? (
                    <>
                        <Text variant="caption3" mr={1}>
                            More
                        </Text>
                        <AiOutlineDown style={{ paddingTop: "2px" }} />
                    </>
                ) : (
                    <>
                        <Text variant="caption3" mr={1}>
                            Less
                        </Text>
                        <AiOutlineUp style={{ paddingTop: "2px" }} />
                    </>
                )}
            </Box>
            {isOpen && (
                <Flex justifyContent="space-between" my={4}>
                    <Box ml="2.5%">
                        <Text variant="captionBold2" textAlign="center">
                            Floor Price
                        </Text>
                        {!!floorPrice.price ? (
                            <>
                                <Text variant="captionBold2" textAlign="center">
                                    {formatPrice(floorPrice.price)}{" "}
                                    {floorPrice.currency}
                                </Text>
                                <Text
                                    variant="caption3"
                                    color="accent"
                                    textAlign="center"
                                >
                                    {priceConversion &&
                                        formatPrice(
                                            new BigNumber(floorPrice.price)
                                                .multipliedBy(
                                                    priceConversion[
                                                        floorPrice.currency as
                                                            | "VET"
                                                            | "WoV"
                                                    ]
                                                )
                                                .dividedBy(
                                                    priceConversion[
                                                        otherCurrency
                                                    ]
                                                )
                                        )}{" "}
                                    {otherCurrency}
                                </Text>
                            </>
                        ) : (
                            <Text variant="captionBold2">--</Text>
                        )}
                    </Box>
                    <Box>
                        <Text textAlign="center" variant="captionBold2">
                            24h Sales #
                        </Text>
                        <Text textAlign="center" variant="captionBold2">
                            {itemsSold}
                        </Text>
                    </Box>
                    <Box>
                        <Text textAlign="center" variant="captionBold2">
                            Volumes 24h
                        </Text>
                        <Box justifyContent="space-evenly">
                            {volumeVET !== "0" && (
                                <Text textAlign="center" variant="captionBold2">
                                    {formatPrice(volumeVET)} VET
                                </Text>
                            )}
                            {volumeWOV !== "0" && (
                                <Text textAlign="center" variant="captionBold2">
                                    {formatPrice(volumeWOV)} WoV
                                </Text>
                            )}
                        </Box>
                    </Box>
                </Flex>
            )}
            <Divider />
        </Box>
    );
};

export default TrendingCollectionsTable;

const StyledFlex = styled(Flex)`
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.f}) {
        :hover {
            background-color: ${({ theme }) => theme.colors.muted};
        }
    }
`;
