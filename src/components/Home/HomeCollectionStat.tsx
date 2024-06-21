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
    collection?: CollectionFragment | null; // pass proper interface
}

interface HomeCollectionStatProps {
    collectionStats: CollectionStats;
    idx: number;
}

const HomeCollectionStat: React.FC<HomeCollectionStatProps> = ({
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
                    justifyContent={{ _: "space-between", f: "flex-start" }}
                    py={{ _: 1, f: 2 }}
                >
                    <Flex width={{ _: "unset", f: "38%" }} alignItems="center">
                        <Text mx="2.5%" variant="captionBold1">
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
                            <Text variant="captionBold1">{name}</Text>
                        </Flex>
                    </Flex>
                    <Flex
                        width={{ _: "35%", f: "35%" }}
                        flexDirection={{ _: "column", f: "row" }}
                        justifyContent="space-between"
                    >
                        <Box width={{ _: "100%", f: "80%" }}>
                            <Text
                                textAlign="center"
                                variant="captionBold1"
                                pt={{ _: 3, f: "unset" }}
                                mx="auto"
                            >
                                {formatPrice(volumeSumInVet)} VET
                            </Text>
                            {!!parseInt(volumeWOV ?? "") && (
                                <Flex justifyContent="center" rowGap={4}>
                                    <Text
                                        variant="caption2"
                                        color="accent"
                                        whiteSpace="nowrap"
                                    >
                                        {formatPrice(volumeVET)} VET
                                    </Text>
                                    <Text
                                        variant="caption2"
                                        color="accent"
                                        whiteSpace="nowrap"
                                    >
                                        {formatPrice(volumeWOV)} WoV
                                    </Text>
                                </Flex>
                            )}
                        </Box>
                        <Text
                            width={{ _: "100%", f: "20%" }}
                            color={
                                percentageChange
                                    ? parseFloat(percentageChange) > 0
                                        ? "success"
                                        : "error"
                                    : "accent"
                            }
                            variant="captionBold1"
                            whiteSpace="nowrap"
                            fontSize={{ _: 2, f: "inherit" }}
                            textAlign={{ _: "center", f: "start" }}
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
                        width="13%"
                        textAlign="center"
                        display={{ _: "none", f: "inline" }}
                        variant="captionBold1"
                    >
                        {itemsSold}
                    </Text>
                    <Box
                        display={{ _: "none", f: "flex" }}
                        flexDirection="column"
                        width="14%"
                        alignItems="end"
                    >
                        {!!floorPrice.price ? (
                            <>
                                <Text variant="captionBold1">
                                    {formatPrice(floorPrice.price)}{" "}
                                    {floorPrice.currency}
                                </Text>
                                <Text variant="caption2" color="accent">
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
                            <Text variant="captionBold1">--</Text>
                        )}
                    </Box>
                </StyledFlex>
            </Link>

            <Box
                position="absolute"
                alignItems="center"
                bottom={1}
                mx="auto"
                left={20}
                right={0}
                width={40}
                onClick={() => setIsOpen(!isOpen)}
                display={{ _: "flex", f: "none" }}
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
                        <Text variant="captionBold1" textAlign="center">
                            Floor Price
                        </Text>
                        {!!floorPrice.price ? (
                            <>
                                <Text variant="captionBold1" textAlign="center">
                                    {formatPrice(floorPrice.price)}{" "}
                                    {floorPrice.currency}
                                </Text>
                                <Text
                                    variant="caption2"
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
                            <Text variant="captionBold1">--</Text>
                        )}
                    </Box>
                    <Box>
                        <Text textAlign="center" variant="captionBold1">
                            24h Sales #
                        </Text>
                        <Text textAlign="center" variant="captionBold1">
                            {itemsSold}
                        </Text>
                    </Box>
                    <Box>
                        <Text textAlign="center" variant="captionBold1">
                            Volumes 24h
                        </Text>
                        <Box justifyContent="space-evenly">
                            {volumeVET !== "0" && (
                                <Text textAlign="center" variant="captionBold1">
                                    {formatPrice(volumeVET)} VET
                                </Text>
                            )}
                            {volumeWOV !== "0" && (
                                <Text textAlign="center" variant="captionBold1">
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

export default HomeCollectionStat;

const StyledFlex = styled(Flex)`
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.f}) {
        :hover {
            background-color: ${({ theme }) => theme.colors.muted};
        }
    }
`;
