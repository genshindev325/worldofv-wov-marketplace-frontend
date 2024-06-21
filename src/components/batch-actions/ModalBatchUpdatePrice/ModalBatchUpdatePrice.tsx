import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import { useContext, useEffect } from "react";
import { useRecoilValue } from "recoil";
import ZERO_ADDRESS from "../../../constants/zeroAddress";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { useRefresh } from "../../RefreshContext";
import { TokenPriceForm } from "../TokenPriceForm";

export function ModalBatchUpdatePrice({ setIsOpen }: ModalContentProps) {
    const userAddress = useRecoilValue(userAddressSelector);
    const { selectedItems, setSelecting } = useContext(TokenBatchSelectContext);
    const { saleService, transactionService } = useBlockchain();

    const refresh = useRefresh("profile-tab");

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const onSubmit = async (prices: Record<string, string>) => {
        const editions = Object.entries(prices).map(([id, price]) => {
            const token = selectedItems.get(id)!;
            const edition = token.editions[0];

            return {
                smartContractAddress: token.smartContractAddress,
                tokenId: edition.editionId,
                previousSaleId: edition.saleId,
                sellerAddress: userAddress!,
                addressVIP180: edition.saleAddressVIP180 || ZERO_ADDRESS,
                priceWei: new BigNumber(price).multipliedBy(1e18),
            };
        });

        const clauses = await saleService!.sell(...editions);

        await transactionService!.runTransaction({
            clauses,
            comment: `Sell ${editions.length} NFT(s)`,
            eventNames: ["listingNonCustodial"],
            eventCount: editions.length,
        });

        await refresh();

        setSelecting(false);
        setIsOpen(false);
    };

    return (
        <TokenPriceForm
            onSubmit={onSubmit}
            currency={(token) => token.editions[0].payment}
            getDefaultPrice={(token) => token.editions[0].salePrice}
        />
    );
}
