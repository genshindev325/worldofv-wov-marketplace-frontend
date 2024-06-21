import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import { useContext, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { Flex } from "../../../components/common/Flex";
import InfoPopup from "../../../components/InfoPopup";
import { useRefresh } from "../../../components/RefreshContext";
import ZERO_ADDRESS from "../../../constants/zeroAddress";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { SaleCurrency, SALE_CURRENCIES } from "../../../types/Currencies";
import formatPrice from "../../../utils/formatPrice";
import { getPaymentFromContractAddress } from "../../../utils/getPaymentFromContractAddress";
import { CurrencySwitch } from "../../common/CurrencySwitch";
import { Text } from "../../common/Text";
import { TokenPriceForm } from "../TokenPriceForm";

const VIP180_ADDRESSES: Record<SaleCurrency, string> = {
    VET: ZERO_ADDRESS,
    WoV: process.env.NEXT_PUBLIC_WOV_GOVERNANCE_TOKEN_CONTRACT_ADDRESS!,
};

export function ModalBatchSale({ setIsOpen }: ModalContentProps) {
    const userAddress = useRecoilValue(userAddressSelector);
    const { selectedItems, setSelecting } = useContext(TokenBatchSelectContext);
    const { saleService, transactionService } = useBlockchain();

    const refresh = useRefresh("profile-tab", "collection-tab");

    const [selectedCurrency, setSelectedCurrency] = useState<SaleCurrency>(
        SALE_CURRENCIES[0]
    );

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const onSubmit = async (prices: Record<string, string>) => {
        const editions = Object.entries(prices).map(([id, price]) => {
            const token = selectedItems.get(id)!;

            return {
                smartContractAddress: token.smartContractAddress,
                tokenId: token.editions[0].editionId,
                previousSaleId: token.editions[0].saleId,
                sellerAddress: userAddress!,
                addressVIP180: VIP180_ADDRESSES[selectedCurrency],
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
        <Flex flexDirection="column" columnGap={3}>
            <Flex alignItems="center" flexWrap="wrap" rowGap={2}>
                <Text>Sell currency:</Text>
                <CurrencySwitch
                    currencies={SALE_CURRENCIES}
                    selectedCurrency={selectedCurrency}
                    onClick={(currency) => {
                        setSelectedCurrency(currency as SaleCurrency);
                    }}
                />
            </Flex>
            <TokenPriceForm
                onSubmit={onSubmit}
                currency={selectedCurrency}
                TokenNameDecoration={PreviousListingInfo}
                getDefaultPrice={(token) => token.editions[0].salePrice}
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
