import { useUserData } from "@/hooks/useUserData";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { IOfferData } from "../../types/OfferData";
import { isSameAddress } from "../../utils/isSameAddress";
import { Button } from "../common/Button";
import { Popup } from "../common/Popup";
import Link from "../Link";
import { useItem } from "./ProductDetailProvider";

export interface OfferButtonProps {
    onGlobalOffer: () => void;
    onEditionOffer: () => void;
    canPerformPurchase?: boolean;
}

const ProductDetailOfferButton = (props: OfferButtonProps) => {
    const { user } = useUserData();

    const [visible, setVisible] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const {
        token: { activeOffers, editions },
        selectedEdition,
    } = useItem();

    const { user: userData } = useUserData();

    const isOwner =
        user && selectedEdition
            ? isSameAddress(user.address, selectedEdition.owner.address)
            : false;

    const ownOffers = useMemo(
        () =>
            activeOffers?.filter((o: IOfferData) =>
                isSameAddress(o.bidderAddress, userData?.address)
            ),
        [activeOffers, userData?.address]
    );

    const hasEditionOffer = useMemo(
        () =>
            ownOffers?.some(
                (o: IOfferData) =>
                    o.editionId && o.editionId === selectedEdition?.id
            ),
        [ownOffers, selectedEdition?.id]
    );

    const hasGlobalOffer = useMemo(
        () => ownOffers?.some((o: IOfferData) => o.tokenId && !o.editionId),
        [ownOffers]
    );

    const offerButton = user ? (
        <Button
            outline
            disabled={!props.canPerformPurchase}
            onClick={() => {
                props.onEditionOffer();
                setVisible(false);
            }}
        >
            {hasEditionOffer ? "Update" : "Create"} Offer
        </Button>
    ) : (
        <Link href="/login" passHref>
            <Button as="a" outline>
                {hasEditionOffer ? "Update" : "Create"} Offer
            </Button>
        </Link>
    );

    const globalOfferButton = user ? (
        <Button
            outline
            onClick={() => {
                props.onGlobalOffer();
                setVisible(false);
            }}
        >
            {hasGlobalOffer ? "Update" : "Create"} Global Offer
        </Button>
    ) : (
        <Link href="/login" passHref>
            <Button as="a" outline>
                {hasGlobalOffer ? "Update" : "Create"} Global Offer
            </Button>
        </Link>
    );

    if (isOwner) return null;

    if (editions.length === 1) return offerButton; // single edition token

    return (
        <Popup
            interactive
            maxWidth="100%"
            visible={visible}
            onClickOutside={() => setVisible(false)}
            content={
                <OfferButtonContainer>
                    {globalOfferButton}
                    {offerButton}
                </OfferButtonContainer>
            }
        >
            {user ? (
                <Button
                    outline
                    ref={buttonRef}
                    onClick={() => setVisible(!visible)}
                >
                    Offer
                </Button>
            ) : (
                <Link href="/login" passHref>
                    <Button as="a" outline ref={buttonRef as any}>
                        Offer
                    </Button>
                </Link>
            )}
        </Popup>
    );
};

const OfferButtonContainer = styled.div`
    display: flex;
    padding: 8px;
    gap: 8px;
    flex-direction: column;
`;

export default ProductDetailOfferButton;
