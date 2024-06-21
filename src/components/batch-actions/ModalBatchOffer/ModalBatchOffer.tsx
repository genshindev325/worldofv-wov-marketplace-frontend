import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import _ from "lodash";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import Web3 from "web3";
import { CollectionFragment } from "../../../generated/graphql";
import { QueryGetPreviousOffers } from "../../../graphql/get-previous-offers.query";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import { OfferCurrency, OFFER_CURRENCIES } from "../../../types/Currencies";
import formatPrice from "../../../utils/formatPrice";
import { useBalance } from "../../BalanceProvider";
import { CurrencySwitch } from "../../common/CurrencySwitch";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import { useConnex } from "../../ConnexProvider";
import FlatLoader from "../../FlatLoader";
import InfoPopup from "../../InfoPopup";
import { TokenPriceForm } from "../TokenPriceForm";

export function ModalBatchOffer({ setIsOpen }: ModalContentProps) {
    const userAddress = useRecoilValue(userAddressSelector);
    const { createOffer, checkTransaction } = useConnex();
    const { balance, refreshBalance, error: balanceError } = useBalance();
    const { selectedItems, setSelecting } = useContext(TokenBatchSelectContext);

    const [lastTokensSize, setLastTokensSize] = useState(0);
    const [uri, setUri] = useState<any[] | null>(null);
    const [isLoadingBalance, setLoadingBalance] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState<OfferCurrency>(
        OFFER_CURRENCIES[0]
    );

    const tokens = useMemo(
        () => selectedItems.valueSeq().toArray(),
        [selectedItems]
    );

    const collections: CollectionFragment[] = useMemo(
        () =>
            _.uniqBy(
                tokens.map((t) => t.collection || { type: "MARKETPLACE" }),
                (c) => {
                    if (c?.type === "MARKETPLACE") {
                        return process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
                    }
                    return Web3.utils.toChecksumAddress(c.smartContractAddress);
                }
            ),
        [tokens]
    );

    if (collections.length > 1) {
        throw new Error("Multiple collections for the selected set of items");
    }

    const collection = collections[0];

    const editionIds = useMemo(
        () => selectedItems.valueSeq().map((token) => token.tokenId),
        [selectedItems]
    );

    const { client } = useGraphQL();

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data, error: offerError } = useSWR(uri, fetcher);

    const offers = useMemo(
        () =>
            new Map<string, Record<string, string>>(
                data?.getOffersForUser?.offers?.map((o: any) => [
                    o.editionId,
                    o,
                ])
            ),
        [data]
    );

    useEffect(
        () => {
            if (!selectedItems.size || collection == null) {
                setIsOpen(false);
                return;
            }

            // We don't want to refetch the data if no new tokens were selected.
            if (userAddress && selectedItems.size > lastTokensSize) {
                const uri = [
                    QueryGetPreviousOffers,
                    {
                        userAddress,
                        smartContractAddress:
                            collection?.type === "MARKETPLACE"
                                ? process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
                                : collection.smartContractAddress,
                        editionIds,
                    },
                ];

                setLastTokensSize(selectedItems.size);
                setUri(uri);
            }
        },
        [selectedItems.size, collection] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useEffect(
        () => {
            refreshBalance().then(() => setLoadingBalance(false));
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const onSubmit = async (prices: Record<string, string>) => {
        const offerData = Object.entries(prices).map(([id, price]) => {
            const token = selectedItems.get(id)!;
            const previousOffer = offers.get(id);

            return {
                tokenId: id,
                editionId: token.editions?.[0].editionId,
                smartContractAddress: token.smartContractAddress,
                previousOfferId: previousOffer?.offerId,
                amount: new BigNumber(price).multipliedBy(10 ** 18),
                currency: selectedCurrency,
            };
        });

        const txinfo = await createOffer(...offerData);

        await checkTransaction({
            txID: txinfo!.txid,
            txOrigin: txinfo!.signer,
            eventName: "NewBuyOffer",
            clauseIndex: txinfo!.clauseCount - 1,
            toast: { enabled: true, success: "Offers created!" },
        });

        setSelecting(false);
        setIsOpen(false);
    };

    if (offerError || balanceError) {
        return (
            <Text variant="body1" textAlign="center">
                An error occured.
            </Text>
        );
    }

    if (!data || isLoadingBalance) {
        return (
            <Flex justifyContent="center">
                <FlatLoader size={48} />
            </Flex>
        );
    }

    return (
        <Flex flexDirection="column" columnGap={5}>
            <Flex alignItems="center" flexWrap="wrap" rowGap={2}>
                <Text>Offer with:</Text>
                <CurrencySwitch
                    currencies={OFFER_CURRENCIES}
                    selectedCurrency={selectedCurrency}
                    onClick={(currency) => {
                        setSelectedCurrency(currency as OfferCurrency);
                    }}
                />
            </Flex>
            {balance?.[selectedCurrency] != null && (
                <Text variant="body2" color="accent">
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
            <TokenPriceForm
                onSubmit={onSubmit}
                currency={selectedCurrency}
                balanceWei={balance?.[selectedCurrency]}
                TokenNameDecoration={({ token }) =>
                    offers.has(token.tokenId) ? (
                        <InfoPopup>
                            You already have an active offer for this item for
                            the value of{" "}
                            {formatPrice(offers.get(token.tokenId)!.price)}{" "}
                            {offers.get(token.tokenId)!.currency}.
                        </InfoPopup>
                    ) : null
                }
            />
        </Flex>
    );
}
