import { formatUsername } from "@/utils/formatUsername";
import picasso from "@vechain/picasso";
import { useMemo } from "react";
import styled from "styled-components";
import formatPrice from "../../utils/formatPrice";
import { Box } from "../common/Box";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Link from "../Link";
import UserAvatar from "../UserAvatar";

interface BuyerStats {
    buyerAddress: string;
    itemsBought: number;
    volumeVET: string;
    volumeWOV: string;
    volumeSumInVet: string;
    percentageChange?: string | null;
    totalItemsBought: number;
    totalVolumeVET: string;
    totalVolumeWOV: string;
    totalVolumeSumInVet: string;
    user?: any | null; //pass proper type
}

interface TopBuyersTableProps {
    buyerStats: BuyerStats;
    idx: number;
}

const TopBuyersTable: React.FC<TopBuyersTableProps> = ({ buyerStats, idx }) => {
    const {
        buyerAddress,
        itemsBought,
        volumeVET,
        volumeWOV,
        volumeSumInVet,
        percentageChange,
        totalItemsBought,
        totalVolumeVET,
        totalVolumeWOV,
        totalVolumeSumInVet,
        user,
    } = buyerStats;

    const svg = useMemo(() => {
        const svg = picasso(buyerAddress);
        return `data:image/svg+xml;utf8,${svg}`;
    }, [buyerAddress]);

    return (
        <Box position="relative">
            <Link href={`/profile/${user?.customUrl ?? buyerAddress}`} passHref>
                <StyledFlex
                    alignItems="center"
                    justifyContent={{ _: "space-between", f: "flex-start" }}
                    py={{ _: 1, f: 2 }}
                >
                    <Flex width="25%" alignItems="center">
                        <Text mx="2.5%" variant="captionBold2">
                            {idx + 1}.
                        </Text>

                        <Flex alignItems="center" rowGap={3}>
                            {user?.assets ? (
                                <UserAvatar
                                    src={user?.assets[0].url ?? ""}
                                    size={65}
                                    verified={user?.isVerified}
                                    verifiedLevel={user?.verifiedLevel}
                                    verifiedSize={18}
                                    altText="User Thumbnail"
                                />
                            ) : (
                                <ThumbnailSvg src={svg} />
                            )}
                            <Text variant="captionBold2">
                                {formatUsername(user?.name ?? buyerAddress)}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex
                        width="30%"
                        flexDirection={{ _: "column", f: "row" }}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box width={{ _: "100%", f: "80%" }}>
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
                            width={{ _: "100%", f: "20%" }}
                            color={
                                percentageChange
                                    ? parseFloat(percentageChange) > 0
                                        ? "success"
                                        : "error"
                                    : "accent"
                            }
                            variant="captionBold2"
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
                        width="8%"
                        textAlign="center"
                        display={{ _: "none", p: "inline" }}
                        variant="captionBold2"
                    >
                        {itemsBought}
                    </Text>

                    <Box display={{ _: "none", f: "block" }} width="25%">
                        <Text
                            textAlign="center"
                            variant="captionBold2"
                            pt={{ _: 3, f: "unset" }}
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
                    <Text
                        width="6%"
                        textAlign="center"
                        display={{ _: "none", f: "inline" }}
                        variant="captionBold2"
                    >
                        {totalItemsBought}
                    </Text>
                </StyledFlex>
            </Link>

            {/* <Box
                position="absolute"
                alignItems="center"
                bottom={1}
                mx="auto"
                width={40}
                left={20}
                right={0}
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
                    <Box>
                        <Text textAlign="center" variant="captionBold2">
                            24h Sales #
                        </Text>
                        <Text textAlign="center" variant="captionBold2">
                            {itemsBought}
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
            )} */}
            <Divider />
        </Box>
    );
};

export default TopBuyersTable;

const StyledFlex = styled(Flex)`
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.f}) {
        :hover {
            background-color: ${({ theme }) => theme.colors.muted};
        }
    }
`;

const ThumbnailSvg = styled.img`
    height: 65px;
    width: 65px;
    border-radius: 50%;
`;
