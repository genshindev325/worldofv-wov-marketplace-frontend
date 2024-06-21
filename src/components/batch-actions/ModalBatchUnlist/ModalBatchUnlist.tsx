import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { useRefresh } from "@/components/RefreshContext";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import variables from "../../../styles/_variables";
import formatPrice from "../../../utils/formatPrice";
import { getPaymentFromContractAddress } from "../../../utils/getPaymentFromContractAddress";
import CircleButton from "../../CircleButton";
import { Button } from "../../common/Button";
import { TokenAsset } from "../../common/TokenAsset";
import FittedParagraph from "../../FittedParagraph";
import Icon from "../../Icon";

const { colors, typography } = variables;
const { neutrals } = colors;

export function ModalBatchUnlist({ setIsOpen }: ModalContentProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { saleService, transactionService } = useBlockchain();
    const refresh = useRefresh("profile-tab", "collection-tab");

    const { selectedItems, setSelecting, deselectItem, submitLabel } =
        useContext(TokenBatchSelectContext);

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const onSubmit = async () => {
        try {
            setLoading(true);
            setHasError(false);

            const clauses: Connex.VM.Clause[] = [];

            for (const item of selectedItems.valueSeq().toArray()) {
                clauses.push(
                    await saleService!.cancel({
                        smartContractAddress: item.smartContractAddress,
                        tokenId: item.tokenId,
                        saleId: item.editions[0].saleId,
                    })
                );
            }

            await transactionService!.runTransaction({
                clauses,
                comment: `Cancel sale.`,
                eventNames: ["cancel", "cancelNonCustodial"],
                eventCount: clauses.length,
            });

            await refresh();

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
                {selectedItems.valueSeq().map((t) => (
                    <Item
                        key={t.id}
                        deselectSelf={() => deselectItem(t.tokenId)}
                        token={t}
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
    token: any;
    deselectSelf?: () => void;
}

function Item({ token, deselectSelf }: ItemProps) {
    const href = useMemo(
        () => `/token/${token.smartContractAddress}/${token.tokenId}`,
        [token.tokenId, token.smartContractAddress]
    );

    return (
        <ItemContainer>
            <Link href={href}>
                <a>
                    <TokenAsset asset={token.assets[0]} sizePx={72} />
                </a>
            </Link>
            <ItemInfoContainer>
                <Link href={href}>
                    <a>
                        <FittedParagraph
                            fittyOptions={{ minSize: 12, maxSize: 16 }}
                        >
                            {token.name}
                        </FittedParagraph>
                    </a>
                </Link>
                {token.editionsCount === 1 ? (
                    <DimText>
                        Selling Price:{" "}
                        <strong>
                            {formatPrice(token.editions[0].salePrice)}{" "}
                            {getPaymentFromContractAddress(
                                token.editions[0].saleAddressVIP180
                            )}
                        </strong>
                    </DimText>
                ) : (
                    <DimText>
                        Editions on Sale:{" "}
                        <strong>{token.editions.length}</strong>
                    </DimText>
                )}
                {!!token.rank && (
                    <DimText>
                        Rank: <strong>{token.rank}</strong>
                    </DimText>
                )}
            </ItemInfoContainer>
            <CircleButton outline small onClick={deselectSelf}>
                <Icon icon="close" />
            </CircleButton>
        </ItemContainer>
    );
}

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
`;

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

const ErrorMessage = styled.p`
    ${typography.body1}
    text-align: center;
    padding: 8px;
`;
