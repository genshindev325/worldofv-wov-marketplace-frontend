import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { useUserData } from "@/hooks/useUserData";
import { useMediaQuery } from "@react-hook/media-query";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "styled-components";
import useAllowedBatchActions from "../../hooks/useAllowedBatchActions";
import { useCollection } from "../../providers/CollectionProvider";
import ActionCard from "../ActionCard";
import {
    BuyToken,
    CollectionOffer,
    OfferToken,
    SellToken,
    StakeToken,
    TransferToken,
    UnlistToken,
    UnstakeToken,
} from "../batch-actions";
import { Button } from "../common/Button";
import GenesisSidebarInfo from "../Genesis/GenesisSidebarInfo";
import Link from "../Link";
import LinkedCollection from "../LinkedCollection/LinkedCollection";
import LinkedCollectionData from "../LinkedCollection/LinkedCollectionData";
import ClaimAllCard from "./ClaimAllCard";

export const CollectionActions = () => {
    const theme = useTheme();
    const { user } = useUserData();
    const { collection, selectedTab } = useCollection();
    const blockchain = useBlockchain();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.m})`);
    const {
        canBatchSell,
        canBatchBuy,
        canBatchStake,
        canBatchUnstake,
        canBatchOffer,
        canOfferToCollection,
        canBatchTransfer,
        canBatchUnlist,
    } = useAllowedBatchActions();

    const [delegationInfo, setDelegationInfo] = useState<Record<string, any>>();

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
            (collection?.name === "Genesis" ||
                collection?.name === "Genesis Special"),
        [collection?.name, delegationInfo?.distributionEndTime]
    );

    const actions = [
        { id: "SellToken", Comp: SellToken, props: {}, display: canBatchSell },
        { id: "BuyToken", Comp: BuyToken, props: {}, display: canBatchBuy },
        {
            id: "StakeToken",
            Comp: StakeToken,
            props: {},
            display: canBatchStake,
        },
        {
            id: "UnstakeToken",
            Comp: UnstakeToken,
            props: {
                disabled: selectedTab.value === "staked" && cannotUnstake,
                delegationInfo,
                collectionName: collection.name,
            },
            display:
                canBatchUnstake &&
                !(selectedTab.value === "staked" && cannotUnstake),
        },
        {
            id: "OfferToken",
            Comp: OfferToken,
            props: {},
            display: canBatchOffer,
        },
        {
            id: "TransferToken",
            Comp: TransferToken,
            props: {},
            display: canBatchTransfer,
        },
        {
            id: "UnlistToken",
            Comp: UnlistToken,
            props: {},
            display: canBatchUnlist,
        },
        {
            id: "CollectionOffer",
            Comp: CollectionOffer,
            props: {},
            display: canOfferToCollection,
        },
    ];

    const linkedCollections = LinkedCollectionData.filter((f) =>
        f.collections.some((s) => s.name === collection.name)
    )
        .flatMap((fm) => fm.collections)
        .filter(({ name }) => name !== collection.name);

    const hasMultipleLinkedCollections = React.useMemo(
        () => linkedCollections && linkedCollections.length > 2,
        [linkedCollections]
    );

    return (
        <>
            {selectedTab.value === "staked" && !!user && (
                <ClaimAllCard
                    isDelegated={cannotUnstake}
                    delegationInfo={delegationInfo}
                />
            )}

            {["Genesis Special", "Genesis"].includes(collection.name) && (
                <ActionCard description="">
                    <Link href={user ? "/dashboard" : "/login"} passHref>
                        <Button small>Genesis Dashboard</Button>
                    </Link>
                </ActionCard>
            )}

            {!isSmallScreen && actions.some(({ display }) => display) && (
                <ActionCard description="Select multiple items for batch actions">
                    {actions.map(({ id, Comp, props, display }) =>
                        display ? <Comp key={id} {...props} /> : null
                    )}
                </ActionCard>
            )}

            {!isSmallScreen && (
                <LinkedCollection
                    {...{ hasMultipleLinkedCollections, linkedCollections }}
                />
            )}

            {!isSmallScreen &&
                ["Genesis Special", "Genesis"].includes(collection.name) && (
                    <GenesisSidebarInfo />
                )}
        </>
    );
};
