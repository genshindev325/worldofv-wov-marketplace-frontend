import React from "react";
import { AiFillTag } from "react-icons/ai";
import { BiTransfer } from "react-icons/bi";
import { FaDollarSign, FaHandHolding, FaPlus, FaTimes } from "react-icons/fa";
import { ImFire, ImHammer2, ImStack } from "react-icons/im";
import { useTheme } from "styled-components";

const useEventType = (event: any) => {
    const theme = useTheme();

    const saleEvent = React.useMemo(() => {
        if (event.address === event.fromAddress) return "Sold";
        if (event.address === event.toAddress) return "Purchase";
        return "Sale";
    }, []);

    const eventType = React.useMemo(() => {
        switch (event.event) {
            case "TRANSFER":
                return {
                    icon: BiTransfer,
                    text: "Transfer",
                    color: theme.colors.accent,
                };
            case "AUCTION_CREATED":
                return {
                    icon: ImHammer2,
                    text: "Auction",
                    color: theme.colors.warning,
                };
            case "SALE_CREATED":
                return {
                    icon: AiFillTag,
                    text: "Listing",
                    color: theme.colors.primary,
                };
            case "OFFER_CREATED":
                return {
                    icon: FaHandHolding,
                    text: event.tokenId ? "Offer" : "Collection Offer",
                    color: theme.colors.warning,
                };
            case "SALE_SETTLED":
                return {
                    icon: FaDollarSign,
                    text: saleEvent,
                    color: theme.colors.success,
                };
            case "AUCTION_SETTLED":
                return {
                    icon: FaDollarSign,
                    text: `${saleEvent} (Auction)`,
                    color: theme.colors.success,
                };
            case "OFFER_ACCEPTED":
                return {
                    icon: FaDollarSign,
                    text: `${saleEvent} (Offer)`,
                    color: theme.colors.success,
                };
            case "AUCTION_CANCELED":
                return {
                    icon: FaTimes,
                    text: "Canceled (Auction)",
                    color: theme.colors.error,
                };
            case "AUCTION_EXPIRED":
                return {
                    icon: FaTimes,
                    text: "Auction Expired",
                    color: theme.colors.error,
                };
            case "SALE_CANCELED":
                return {
                    icon: FaTimes,
                    text: "Canceled (Sale)",
                    color: theme.colors.error,
                };
            case "OFFER_CANCELED":
                return {
                    icon: FaTimes,
                    text: "Canceled (Offer)",
                    color: theme.colors.error,
                };
            case "MINT":
                return {
                    icon: FaPlus,
                    text: "Mint",
                    color: theme.colors.accent,
                };
            case "BURN":
                return {
                    icon: ImFire,
                    text: "Burned",
                    color: theme.colors.error,
                };
            case "STAKE_STARTED":
                return {
                    icon: ImStack,
                    text: "Staked",
                    color: theme.colors.warning,
                };
            case "STAKE_ENDED":
                return {
                    icon: ImStack,
                    text: "Unstaked",
                    color: theme.colors.error,
                };
            default:
                return {
                    icon: BiTransfer,
                    text: "",
                    color: "",
                };
        }
    }, [event.event]);

    return { eventType };
};

export default useEventType;
