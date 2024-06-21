import { useUserData } from "@/hooks/useUserData";
import { UserData } from "@/types/UserData";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useCallback, useContext, useMemo, useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import styled, { useTheme } from "styled-components";
import { KeyedMutator } from "swr";
import { GetOffersForUserQueryResult } from "../generated/graphql";
import useConvertPrices from "../hooks/useConvertPrices";
import ModalAcceptOffer from "../modals/ModalAcceptOffer";
import ModalEditOffer from "../modals/ModalEditOffer";
import { OfferBatchSelectContext } from "../providers/BatchSelectProvider";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { IOfferData, OfferData, OfferEdition } from "../types/OfferData";
import formatPrice from "../utils/formatPrice";
import { getPaymentFromContractAddress } from "../utils/getPaymentFromContractAddress";
import { isSameAddress } from "../utils/isSameAddress";
import { Button } from "./common/Button";
import { Popup } from "./common/Popup";
import { Text } from "./common/Text";
import { TokenAsset } from "./common/TokenAsset";
import Countdown from "./Countdown";
import FlatLoader from "./FlatLoader";
import { useItem } from "./ProductDetail/ProductDetailProvider";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

export type OfferListProps = {
    refreshOffers:
        | KeyedMutator<GetOffersForUserQueryResult>
        | (() => Promise<void>);
    offers?: IOfferData[];
    isNftPage?: boolean;
    hideInitiator?: boolean;
    isValidating: boolean;
    profileData?: UserData;
};

export default function OfferList({
    refreshOffers,
    offers,
    isNftPage,
    hideInitiator,
    isValidating,
    profileData,
}: OfferListProps) {
    const [showAcceptOffer, setShowAcceptOffer] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<IOfferData | null>(null);
    const [selectedEdition, setSelectedEdition] = useState<OfferEdition | null>(
        null
    );
    const { token } = useItem();

    if (isValidating && !offers) {
        return <FlatLoader size={48} style={{ margin: "auto" }} />;
    }

    return !offers ? (
        <Text textAlign="center" variant="body1">
            There aren&apos;t active offers{" "}
        </Text>
    ) : (
        <TableContainer>
            {offers?.length ? (
                <Table>
                    <thead>
                        <Row>
                            {!isNftPage && <TableHeader>NFT</TableHeader>}
                            {token?.collection?.type != "EXTERNAL" ? (
                                <TableHeader>Edition</TableHeader>
                            ) : null}
                            {!hideInitiator && <TableHeader>From</TableHeader>}

                            <TableHeader>Value</TableHeader>
                            {!isNftPage && (
                                <TableHeader>Highest Offer</TableHeader>
                            )}
                            <TableHeader>Expiration</TableHeader>
                            <TableHeader>Status</TableHeader>
                        </Row>
                    </thead>
                    <tbody>
                        {offers.map((offer) => (
                            <Offer
                                key={offer.offerId}
                                refreshOffers={refreshOffers}
                                offerData={offer}
                                isNftPage={isNftPage}
                                hideInitiator={hideInitiator}
                                profileData={profileData}
                                onAccept={(selectedEdition) => {
                                    setSelectedOffer(offer);
                                    setSelectedEdition(selectedEdition);
                                    setShowAcceptOffer(true);
                                }}
                            />
                        ))}
                    </tbody>
                </Table>
            ) : (
                <FallbackInfo>No offers yet.</FallbackInfo>
            )}
            <ModalAcceptOffer
                isOpen={showAcceptOffer}
                setOpen={setShowAcceptOffer}
                refreshOffers={refreshOffers}
                offer={selectedOffer}
                edition={selectedEdition}
            />
        </TableContainer>
    );
}

interface OfferProps {
    refreshOffers:
        | KeyedMutator<GetOffersForUserQueryResult>
        | (() => Promise<void>);
    offerData: IOfferData;
    onAccept?: (edition: OfferEdition) => void;
    isNftPage?: boolean;
    hideInitiator?: boolean;
    profileData?: UserData;
}

const Offer = ({
    refreshOffers,
    offerData,
    onAccept,
    isNftPage,
    hideInitiator,
    profileData,
}: OfferProps) => {
    const { token } = useItem();
    const theme = useTheme();
    const { isSelecting, selectedItems, selectItem, deselectItem } = useContext(
        OfferBatchSelectContext
    );
    const offer = useMemo(() => new OfferData(offerData), [offerData]);
    const { user: userData } = useUserData();
    const offerConverted = useConvertPrices(
        [new BigNumber(offer.price)],
        getPaymentFromContractAddress(offer.addressVIP180)
    );
    const highestConverted = useConvertPrices(
        [new BigNumber(offer.highestOffer?.price)],
        getPaymentFromContractAddress(offer.highestOffer.addressVIP180)
    );

    const offerConvertedCurrency = useMemo(
        () =>
            getPaymentFromContractAddress(offer.addressVIP180) === "WoV"
                ? "vVET"
                : "WoV",
        [offer.addressVIP180]
    );

    // TODO: This can be improved by fetching only the editions for the current
    // token in the backend.
    const filteredEditions = useMemo(() => {
        let baseEditions: OfferEdition[] = [];
        if (token?.id)
            baseEditions =
                offer?.editions?.filter((e) => e.tokenId === token.id) ?? [];
        else if (userData?.address === profileData?.address)
            baseEditions = offer?.editions ?? [];

        return baseEditions.filter((e) => !e.stakingContractAddress);
    }, [offer.editions, profileData?.address, token?.id, userData?.address]);

    const isSelected = selectedItems.has(offer.offerId);

    const onSelect = () => {
        if (isSelected) deselectItem(offer.offerId);
        else selectItem(offer);
    };

    const isGenesisCollection =
        offer.collection?.name == "Genesis" ||
        offer.collection?.name == "Genesis Special";

    const isHighestOffer = useMemo(() => {
        if (
            offerConverted &&
            highestConverted &&
            offerConverted[0]?.rawPrices &&
            highestConverted[0]?.rawPrices
        ) {
            return offerConverted[0]?.rawPrices?.USD.gte(
                highestConverted[0]?.rawPrices?.USD
            )
                ? true
                : false;
        }
    }, [highestConverted, offerConverted]);

    return (
        <Row>
            {!isNftPage && (
                <Cell>
                    {isSelecting ? (
                        <BatchSelectContainer
                            isSelected={isSelected}
                            onClick={onSelect}
                        >
                            <TokenAsset asset={offer.asset} />
                        </BatchSelectContainer>
                    ) : (
                        <Link href={offer.href} passHref>
                            <a>
                                <TokenAsset asset={offer.asset} />
                            </a>
                        </Link>
                    )}
                </Cell>
            )}
            {token?.collection?.type != "EXTERNAL" ? (
                <Cell>
                    <Link href={offer.href}>
                        <a>
                            {offer.editionId && !isGenesisCollection
                                ? `#${parseInt(offer.editionId.slice(-5))}`
                                : offer.editionId && isGenesisCollection
                                ? offer.token?.name
                                : offer.tokenId
                                ? "Global"
                                : "Collection"}
                            {offer.token?.rank && (
                                <Text variant="caption2">
                                    Rank: #{offer.token?.rank}
                                </Text>
                            )}
                        </a>
                    </Link>
                </Cell>
            ) : null}

            {!hideInitiator && (
                <Cell>
                    <Link href={`/profile/${offer.bidderAddress}`}>
                        <a>{offer.bidderName?.substring(0, 11)}</a>
                    </Link>
                </Cell>
            )}

            <Cell>
                {offer.formattedPrice}
                {!isNftPage && (
                    <GoPrimitiveDot
                        color={
                            isHighestOffer
                                ? theme.colors.success
                                : theme.colors.error
                        }
                        size={14}
                        style={{ marginLeft: 6 }}
                    />
                )}
                <Text variant="caption3" color={theme.colors.accent}>
                    (≃
                    {offerConverted &&
                        offerConverted[0]?.formattedPrices[
                            offerConvertedCurrency
                        ]}{" "}
                    {offerConvertedCurrency})
                </Text>
            </Cell>
            {!isNftPage && (
                <Cell>
                    {formatPrice(offer.highestOffer?.price)}{" "}
                    {getPaymentFromContractAddress(
                        offer.highestOffer?.addressVIP180
                    )}
                </Cell>
            )}
            <Cell style={{ width: "96px" }}>
                <Countdown date={offer.endTime} />
            </Cell>
            <Cell>
                <OfferAcceptButton
                    {...{
                        offer: offerData,
                        editions: filteredEditions,
                        refreshOffers,
                        onAccept,
                        isGenesisCollection,
                    }}
                />
            </Cell>
        </Row>
    );
};

export type OfferAcceptButtonProps = {
    offer: IOfferData;
    editions: OfferEdition[];
    refreshOffers:
        | KeyedMutator<GetOffersForUserQueryResult>
        | (() => Promise<void>);
    onAccept?: (edition: OfferEdition) => void;
    disabled?: boolean;
    isGenesisCollection: boolean;
};

export function OfferAcceptButton({
    offer,
    editions,
    onAccept,
    refreshOffers,
    disabled,
    isGenesisCollection,
}: OfferAcceptButtonProps) {
    const { user: userData } = useUserData();

    const [isOpen, setIsOpen] = useState(false);
    if (offer.status !== "ACTIVE") {
        return <span>{offer.status.toLowerCase()}</span>;
    }

    if (userData?.blacklisted) {
        return (
            <StyledButton small disabled error>
                Blacklisted
            </StyledButton>
        );
    }

    if (isSameAddress(userData?.address, offer.bidderAddress)) {
        return (
            <>
                <StyledButton small onClick={() => setIsOpen(true)}>
                    Edit
                </StyledButton>
                <ModalEditOffer
                    refreshOffers={refreshOffers}
                    offer={offer}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </>
        );
    }

    if ((editions?.length ?? 0) > 1) {
        return (
            <EditionSelectPopup
                editions={editions}
                isCollectionOffer={!offer.token}
                onAccept={onAccept}
                isGenesisCollection={isGenesisCollection}
            />
        );
    }

    if (editions?.length || disabled) {
        return (
            <StyledButton
                small
                onClick={() => onAccept?.(editions[0])}
                disabled={disabled}
            >
                {disabled ? "Error" : "Accept"}
            </StyledButton>
        );
    }

    if (offer.editions?.length > 0 && offer.editions[0].stakingContractAddress)
        return <span>staked</span>;

    return <span>active</span>;
}

interface EditionSelectPopupProps {
    editions: OfferEdition[];
    isCollectionOffer?: boolean;
    onAccept?: (edition: OfferEdition) => void;
    isGenesisCollection: boolean;
}

function EditionSelectPopup({
    editions,
    isCollectionOffer,
    onAccept,
    isGenesisCollection,
}: EditionSelectPopupProps) {
    const [showPopup, setShowPopup] = useState(false);

    const title = isCollectionOffer ? "Choose an NFT" : "Choose an Edition";

    const getLabel: (e: OfferEdition) => string = useCallback(
        (e) =>
            isCollectionOffer && !isGenesisCollection
                ? `Rank ${e.rank}`
                : isCollectionOffer && isGenesisCollection
                ? e.tokenName
                : `Edition #${Number(e.editionId.slice(-5))}`,
        [isCollectionOffer, isGenesisCollection]
    );

    const editionOptions = useMemo(
        () => editions.map((e) => ({ label: getLabel(e), value: e })),
        [editions, getLabel]
    );

    return (
        <Popup
            interactive
            visible={showPopup}
            onClickOutside={() => setShowPopup(false)}
            content={
                <OptionContainer>
                    <EditionTitle>{title}</EditionTitle>
                    {editionOptions!.map((o) => (
                        <EditionOption
                            key={o.value.editionId}
                            onClick={() => {
                                setShowPopup(false);
                                onAccept?.(o.value);
                            }}
                        >
                            {isCollectionOffer && (
                                <>
                                    <TokenAsset
                                        sizePx={48}
                                        asset={o.value.asset}
                                    />
                                    <Spacer />
                                </>
                            )}
                            {o.label}
                        </EditionOption>
                    ))}
                </OptionContainer>
            }
        >
            <StyledButton small outline onClick={() => setShowPopup(true)}>
                Select
            </StyledButton>
        </Popup>
    );
}

const StyledButton = styled(Button)`
    width: 96px;
`;

const OptionContainer = styled.div`
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 256px;
    overflow-y: auto;
    color: ${neutrals[3]};

    ${dark`
        color: ${neutrals[4]};
    `}
`;

const EditionItem = styled.div`
    white-space: nowrap;
    border-radius: 8px;
    padding-block: 12px;
    padding-left: 24px;
    padding-right: 32px;
`;

const EditionTitle = styled(EditionItem)`
    ${typography.body2}
    padding-top: 16px;
    border-radius: 0;
    border-bottom: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const EditionOption = styled(EditionItem)`
    cursor: pointer;
    white-space: nowrap;
    border-radius: 8px;
    padding-block: 8px;
    padding-inline: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    & img {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 4px;
    }

    &:hover {
        background-color: ${neutrals[6]};

        ${dark`
            background-color: ${neutrals[3]};
        `}
    }
`;

const Spacer = styled.div`
    flex-grow: 1;
`;

const TableContainer = styled.div`
    display: flex;

    ${dark`
        color: ${neutrals[2]};

        &::-webkit-scrollbar-thumb {
            background-color: ${neutrals[3]};

            &:hover, &:active {
                background-color: ${neutrals[4]};
            }
        }

        &::-webkit-scrollbar-corner {
            color: ${neutrals[8]};
        }
    `}
`;

const Table = styled.table`
    border-collapse: separate;
    border-spacing: 16px 8px;
    min-width: max-content;
`;

const TableHeader = styled.th`
    text-align: start;
    color: ${neutrals[5]};
    ${typography.hairline2}
`;

const Row = styled.tr`
    & > :last-child {
        text-align: center;
    }
`;

const Cell = styled.td`
    ${typography.caption1}
    height: 36px;
    vertical-align: middle;
    color: ${neutrals[3]};
    a {
        display: block;
        width: fit-content;
    }

    ${dark`
        color: ${neutrals[4]};
    `}
`;

const FallbackInfo = styled.p`
    text-align: center;
    margin: auto;
    padding: 8px;
    ${typography.body2}
    color: ${neutrals[4]};
`;

const BatchSelectContainer = styled.div<{ isSelected?: boolean }>`
    opacity: ${(props) => (props.isSelected ? 1 : 0.5)};
    transition: opacity 200ms ease-in-out;
    cursor: pointer;
    width: fit-content;
    border-radius: 8px;
    height: fit-content;
    outline-offset: 1px;
    outline: ${(props) =>
        props.isSelected ? `2px solid ${neutrals[4]}` : null};

    :hover {
        opacity: ${(props) => (props.isSelected ? 1 : 0.75)};
    }

    ${dark`
        outline-color: ${neutrals[5]}
    `}
`;
