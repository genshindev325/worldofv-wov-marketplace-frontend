import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { Flex } from "@/components/common/Flex";
import { useContext, useEffect, useMemo } from "react";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import formatPrice from "../../../utils/formatPrice";
import { getPaymentFromContractAddress } from "../../../utils/getPaymentFromContractAddress";
import InfoPopup from "../../InfoPopup";
import { useRefresh } from "../../RefreshContext";
import { TransferTokenForm } from "../TransferTokenForm";

export function ModalBatchTransfer({ setIsOpen }: ModalContentProps) {
    const { selectedItems, setSelecting } = useContext(TokenBatchSelectContext);

    const blockchain = useBlockchain();

    const refresh = useRefresh("profile-tab", "collection-tab");

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const onSubmit = async (to: Record<string, string>) => {
        const transfers = Object.entries(to).map(([id, to]) => {
            const token = selectedItems.get(id)!;

            return {
                from: token.editions[0].ownerAddress,
                to: to,
                tokenId: token.editions[0].editionId,
                smartContractAddress: token.smartContractAddress,
            };
        });
        const clauses = await blockchain.nftService!.transfer(transfers);
        await blockchain.transactionService!.runTransaction({
            clauses,
            comment: "Transfering NFTs",
        });
        await refresh();

        setSelecting(false);
        setIsOpen(false);
    };

    return (
        <Flex flexDirection="column">
            <TransferTokenForm
                onSubmit={onSubmit}
                TokenNameDecoration={PreviousListingInfo}
                getDefaultAddress={(token) => token.editions[0].ownerAddress}
            />
        </Flex>
    );
}

function PreviousListingInfo({ token }: { token: any }) {
    const edition = token.editions[0];

    const price = useMemo(
        () => formatPrice(edition.salePrice),
        [edition.salePrice]
    );

    const payment = useMemo(
        () => getPaymentFromContractAddress(edition.saleAddressVIP180),
        [edition.saleAddressVIP180]
    );

    if (token.editionsOnSale === 0) return null;

    return (
        <InfoPopup>
            You already have an active listing for this item for the value of{" "}
            {price} {payment}.
        </InfoPopup>
    );
}
