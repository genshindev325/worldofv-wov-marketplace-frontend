import BigNumber from "bignumber.js";
import { useContext, useEffect, useState } from "react";
import { UserOfferType } from "../../../generated/graphql";
import { useQueryGetOffersForUser } from "../../../hooks/useQueryGetOffersForUser";
import {
    ModalContentProps,
    OfferBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { useProfile } from "../../../providers/ProfileProvider";
import { OfferCurrency, OFFER_CURRENCIES } from "../../../types/Currencies";
import formatPrice from "../../../utils/formatPrice";
import { useBalance } from "../../BalanceProvider";
import { CurrencySwitch } from "../../common/CurrencySwitch";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import { useConnex } from "../../ConnexProvider";
import { OfferPriceForm } from "../OfferPriceForm";

export function ModalBatchUpdateOffer({ setIsOpen }: ModalContentProps) {
    const { balance, refreshBalance } = useBalance();
    const { createOffer, checkTransaction } = useConnex();
    const { user } = useProfile();

    const [_, refreshOutgoingOffers] = useQueryGetOffersForUser(
        user.address,
        UserOfferType.Created,
        { page: 1, perPage: 20 }
    );

    const [selectedCurrency, setSelectedCurrency] = useState<OfferCurrency>(
        OFFER_CURRENCIES[0]
    );

    const { selectedItems } = useContext(OfferBatchSelectContext);

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    const onSubmit = async (prices: Record<string, string>) => {
        try {
            if (balance === undefined) {
                await refreshBalance();
                return;
            }

            const offerData = Object.entries(prices).map(([id, price]) => {
                const offer = selectedItems.get(id)!;
                const wei = new BigNumber(price).multipliedBy(10 ** 18);

                return {
                    smartContractAddress: offer.smartContractAddress,
                    tokenId: offer.tokenId,
                    editionId: offer.editionId,
                    previousOfferId: offer.offerId,
                    currency: selectedCurrency,
                    amount: wei,
                };
            });

            const tx = await createOffer(...offerData);

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "NewBuyOffer",
                toast: { enabled: true, success: "Offer updated!" },
            });

            await refreshOutgoingOffers();
        } catch (error: any) {
            console.warn(error.message || error);
        } finally {
            setIsOpen(false);
        }
    };

    return (
        <>
            <Flex alignItems="center" ml={3} mb={4}>
                <Text mr={3}>Offer with:</Text>
                <CurrencySwitch
                    currencies={OFFER_CURRENCIES}
                    selectedCurrency={selectedCurrency}
                    onClick={(currency) => {
                        setSelectedCurrency(currency as OfferCurrency);
                    }}
                />
            </Flex>
            {balance?.[selectedCurrency] != null && (
                <Text variant="body2" color="accent" ml={3} mb={4}>
                    Balance:{" "}
                    <strong>{formatPrice(balance[selectedCurrency])}</strong>{" "}
                    {selectedCurrency}
                    <br />
                    <Text variant="caption2">
                        Make sure you have enough {selectedCurrency} in case you
                        want multiple offers to be accepted.
                    </Text>
                </Text>
            )}
            <OfferPriceForm
                onSubmit={onSubmit}
                currency={selectedCurrency}
                balanceWei={balance?.[selectedCurrency]}
            />
        </>
    );
}
