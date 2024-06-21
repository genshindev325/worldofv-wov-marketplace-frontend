import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserOfferType } from "../../../generated/graphql";
import { useQueryGetOffersForUser } from "../../../hooks/useQueryGetOffersForUser";
import {
    ModalContentProps,
    OfferBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { useProfile } from "../../../providers/ProfileProvider";
import variables from "../../../styles/_variables";
import { OfferData } from "../../../types/OfferData";
import CircleButton from "../../CircleButton";
import { Button } from "../../common/Button";
import { TokenAsset } from "../../common/TokenAsset";
import { useConnex } from "../../ConnexProvider";
import Icon from "../../Icon";

const { colors, typography } = variables;
const { neutrals } = colors;

export function ModalBatchCancelOffer({ setIsOpen }: ModalContentProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const { cancelOffer, checkTransaction } = useConnex();
    const { user } = useProfile();
    const [_, refreshOutgoingOffers] = useQueryGetOffersForUser(
        user.address,
        UserOfferType.Received,
        { page: 1, perPage: 20 }
    );

    const { selectedItems, setSelecting, deselectItem, submitLabel } =
        useContext(OfferBatchSelectContext);

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const onSubmit = async () => {
        try {
            setLoading(true);
            setHasError(false);

            const clauses = selectedItems.valueSeq().map((o) => ({
                smartContractAddress: o.smartContractAddress,
                tokenId: o.tokenId,
                editionId: o.editionId,
                offerId: o.offerId,
            }));

            const tx = await cancelOffer(...clauses.toArray());

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "CloseBuyOffer",
                clauseIndex: tx.clauseCount - 1,
                TIMEOUT: tx.clauseCount * 2000 + 30000,
                toast: {
                    enabled: true,
                    success: "Your offers have been canceled!",
                },
            });

            await refreshOutgoingOffers();

            setSelecting(false);
            setIsOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <List>
                {selectedItems.valueSeq().map((o) => (
                    <Item
                        key={o.offerId}
                        deselectSelf={() => deselectItem(o.offerId)}
                        offer={o}
                    />
                ))}
            </List>
            <ConfirmButton onClick={onSubmit} loader={isLoading}>
                {hasError ? "Retry" : submitLabel}
            </ConfirmButton>
        </>
    );
}

interface ItemProps {
    offer: OfferData;
    deselectSelf?: () => void;
}

function Item({ deselectSelf, offer }: ItemProps) {
    return (
        <ItemContainer>
            <Link href={offer.href}>
                <a>
                    <TokenAsset asset={offer.asset} />
                </a>
            </Link>
            <ItemInfoContainer>
                <Link href={offer.href}>
                    <a>
                        {offer.token
                            ? offer.token.name
                            : offer.collection!.name}
                    </a>
                </Link>
                <DimText>
                    {offer.editionId
                        ? offer.collection
                            ? null
                            : `Edition #${parseInt(offer.editionId.slice(-5))}`
                        : offer.token
                        ? "Global"
                        : "Collection"}
                </DimText>
            </ItemInfoContainer>
            <CircleButton outline small onClick={deselectSelf}>
                <Icon icon="close" />
            </CircleButton>
        </ItemContainer>
    );
}

const ConfirmButton = styled(Button)`
    width: 100%;
    margin-top: 16px;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ItemContainer = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`;

const ItemInfoContainer = styled.div`
    ${typography.body2}
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    overflow: hidden;
`;

const DimText = styled.p`
    ${typography.caption2}
    color: ${neutrals[4]};
`;
