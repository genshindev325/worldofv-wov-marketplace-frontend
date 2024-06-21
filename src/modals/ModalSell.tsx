import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import React from "react";
import { HiOutlineCubeTransparent } from "react-icons/hi";
import styled, { useTheme } from "styled-components";
import PillsNav, { NavItemProps } from "../components/PillsNav";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import AnimatedModal from "./AnimatedModal";
import ModalSell_FixedPrice from "./ModalSell_FixedPrice";
import ModalSell_HighestBid from "./ModalSell_HighestBid";

interface ModalSellProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    onSell: (values: any) => void | Promise<void>;
    onAuction: (values: any) => void | Promise<void>;
}

const ModalSell: React.FC<ModalSellProps> = ({
    isOpen,
    setIsOpen,
    onSell,
    onAuction,
}) => {
    const { token, selectedEdition } = useItem();
    const theme = useTheme();

    const allowAuctionCreation = React.useMemo(() => {
        const areAuctionDisabled =
            process.env.NEXT_PUBLIC_DISABLE_AUCTIONS?.toLowerCase() == "true";

        return (
            !areAuctionDisabled &&
            token.editionsCount === 1 &&
            !selectedEdition?.saleId
        );
    }, [selectedEdition?.saleId, token.editionsCount]);

    const navList = React.useMemo(
        () => [{ label: "Fixed Price" }, { label: "Highest Bid" }],
        []
    );

    const [selectedTab, setSelectedTab] = React.useState(navList[0].label);

    const onTabChange = (item: NavItemProps) => setSelectedTab(item.label);

    return (
        <AnimatedModal
            small
            title={selectedEdition?.saleId ? "Update Price" : "Sell"}
            {...{ isOpen, setIsOpen }}
        >
            {!!token.attributes?.find((a) => a.trait_type === "provenance") && (
                <Flex
                    height={50}
                    alignItems="center"
                    justifyContent="center"
                    rowGap={2}
                    mb={4}
                >
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor={theme.colors.primary}
                        borderRadius="50%"
                        p={1}
                    >
                        <HiOutlineCubeTransparent fontSize={40} color="white" />
                    </Flex>
                    <Text variant="body1" color="primary">
                        NFT &amp; Phygital
                    </Text>
                </Flex>
            )}
            {allowAuctionCreation && (
                <PillsNav
                    items={navList}
                    value={selectedTab}
                    onChange={onTabChange}
                    style={{ marginBottom: 16 }}
                />
            )}

            <ModalSell_FixedPrice
                {...{ onSell }}
                visible={selectedTab === "Fixed Price"}
            />

            {allowAuctionCreation && (
                <ModalSell_HighestBid
                    {...{ onAuction }}
                    visible={selectedTab === "Highest Bid"}
                />
            )}

            <WoVNoFees />
        </AnimatedModal>
    );
};
const WoVNoFees = styled.img.attrs({
    src: "/img/wov__no-fee-if-listed-banner.png",
    alt: "World of V",
})`
    position: relative;
    text-align: center;
    display: block;
    margin: 20px auto 0;
    width: 100%;
    pointer-events: none;
`;

export default ModalSell;
