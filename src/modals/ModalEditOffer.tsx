import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { KeyedMutator } from "swr";
import * as yup from "yup";
import { useBalance } from "../components/BalanceProvider";
import { Button } from "../components/common/Button";
import { CurrencySwitch } from "../components/common/CurrencySwitch";
import { Flex } from "../components/common/Flex";
import { Text } from "../components/common/Text";
import { useConnex } from "../components/ConnexProvider";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import Icon from "../components/Icon";
import { GetOffersForUserQueryResult } from "../generated/graphql";
import useConvertPrices from "../hooks/useConvertPrices";
import { OfferCurrency, OFFER_CURRENCIES } from "../types/Currencies";
import { IOfferData } from "../types/OfferData";
import formatPrice from "../utils/formatPrice";
import { getPaymentFromContractAddress } from "../utils/getPaymentFromContractAddress";
import AnimatedModal, { AnimatedModalProps } from "./AnimatedModal";

export type OfferType = "edition" | "token" | "collection";

export interface ModalOfferProps
    extends Pick<AnimatedModalProps, "isOpen" | "setIsOpen" | "zIndex"> {
    offer: IOfferData;
    refreshOffers:
        | KeyedMutator<GetOffersForUserQueryResult>
        | (() => Promise<void>);
}

type FormData = {
    amount: string;
};
// currency: OptionItemProps;

export default function ModalEditOffer({
    offer,
    refreshOffers,
    ...modalProps
}: ModalOfferProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const { balance, refreshBalance } = useBalance();
    const { createOffer, cancelOffer, checkTransaction } = useConnex();
    const [formValues, setFormValues] = React.useState<FormData>();

    const [selectedCurrency, setSelectedCurrency] = useState<OfferCurrency>(
        OFFER_CURRENCIES[0]
    );

    const convertedPrices = useConvertPrices(
        [new BigNumber(formValues?.amount ?? 0)],
        selectedCurrency,
        false
    );

    const otherCurrency = React.useMemo(() => {
        return selectedCurrency === "vVET" ? "WoV" : "VET";
    }, [selectedCurrency]);

    const validationSchema = React.useMemo(() => {
        return yup.object().shape({
            amount: yup
                .number()
                .positive()
                .required()
                .test({
                    name: "maxAmount",
                    message: "The typed amount is more than your balance",
                    exclusive: true,
                    test: function (value) {
                        if (value) {
                            const maxAmount = balance?.[selectedCurrency]
                                ?.div(1e18)
                                .toNumber();

                            if (!maxAmount || maxAmount <= 0) {
                                return false;
                            }

                            return value <= maxAmount;
                        }

                        return true;
                    },
                }),
        });
    }, [balance, selectedCurrency]);

    useEffect(() => {
        refreshBalance()
            ?.then(() => setIsLoading(false))
            .catch(setError);
    }, [refreshBalance]);

    const onCancel = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const tx = await cancelOffer({
                smartContractAddress: offer.smartContractAddress,
                tokenId: offer.tokenId,
                editionId: offer.editionId,
                offerId: offer.offerId,
            });

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                toast: { enabled: true, success: "Offer canceled!" },
            });

            await refreshOffers();
        } catch (error: any) {
            console.warn(error.message || error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async ({ amount }: FormData) => {
        try {
            if (!formValues) return false;

            if (balance === undefined) {
                await refreshBalance();
                return;
            }
            setIsLoading(true);
            setError(null);

            const wei = new BigNumber(amount).multipliedBy(10 ** 18);
            const offerData = [
                {
                    smartContractAddress: offer.smartContractAddress,
                    tokenId: offer.tokenId,
                    editionId: offer.editionId,
                    previousOfferId: offer.offerId,
                    currency: selectedCurrency,
                    amount: wei,
                },
            ];
            const tx = await createOffer(...offerData);

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "NewBuyOffer",
                toast: { enabled: true, success: "Offer updated!" },
            });

            await refreshOffers();
        } catch (error: any) {
            console.warn(error.message || error);
            setError(error);
        } finally {
            setIsLoading(false);
            modalProps.setIsOpen(false);
        }
    };

    return (
        <AnimatedModal
            small
            title={`Edit offer`}
            helpTitle={"Click to learn more about offers"}
            helpContent={
                <>
                    {selectedCurrency === "vVET" && (
                        <>
                            To make an Offer you need to wrap your VET into vVET
                            which is a VIP-180 token with equivalent value to
                            VET (1:1).
                            <br />
                            <br />
                            To get vVET go to your wallet <Icon icon="wallet" />
                            <br />
                            <br />
                        </>
                    )}
                    Making an offer with {selectedCurrency} you&apos;re
                    approving the contract to take your funds when it gets
                    accepted.
                    <br />
                    <br />
                    If your offer gets accepted you will see the NFT
                    automatically in your profile, under the Collected Tab.
                    <br />
                    <br />
                    Offers will automatically be cancelled after 7 days. You can
                    also cancel them from your Profile under the Offers Tab, or
                    on the NFT page.
                </>
            }
            {...modalProps}
        >
            <Form<FormData>
                {...{
                    onSubmit,
                    validationSchema: validationSchema,
                }}
                render={({ formState: { isValid, isSubmitting }, watch }) => {
                    watch(setFormValues as any);
                    return (
                        <Flex flexDirection="column" columnGap={3}>
                            <Flex alignItems="center" mb={4}>
                                <Text mr={3}>Offer with:</Text>
                                <CurrencySwitch
                                    currencies={OFFER_CURRENCIES}
                                    selectedCurrency={selectedCurrency}
                                    onClick={(currency) => {
                                        setSelectedCurrency(
                                            currency as OfferCurrency
                                        );
                                    }}
                                />
                            </Flex>
                            {balance?.[selectedCurrency] != null && (
                                <Text variant="body2" mb={2}>
                                    Current Balance:{" "}
                                    <strong>
                                        {formatPrice(balance[selectedCurrency])}
                                    </strong>{" "}
                                    {selectedCurrency}
                                </Text>
                            )}

                            <Text variant="body2" mb={2}>
                                Current Offer:{" "}
                                <strong>{formatPrice(offer.price)}</strong>{" "}
                                {getPaymentFromContractAddress(
                                    offer.addressVIP180
                                )}
                            </Text>

                            <Input
                                label="Price"
                                inputProps={{
                                    name: "amount",
                                    type: "number",
                                }}
                            />
                            {!!formValues?.amount && (
                                <Text textAlign="right" variant="caption2">
                                    ={" "}
                                    {convertedPrices &&
                                        convertedPrices[0]?.formattedPrices[
                                            otherCurrency
                                        ]}{" "}
                                    {otherCurrency}
                                </Text>
                            )}
                            <Button
                                type="submit"
                                loader={isLoading || isSubmitting}
                                disabled={!isValid || isSubmitting || isLoading}
                            >
                                {error ? "Retry" : "Update Offer"}
                            </Button>
                            <Button
                                error
                                loader={isLoading || isSubmitting}
                                onClick={onCancel}
                            >
                                {error ? "Retry" : "Cancel Offer"}
                            </Button>
                        </Flex>
                    );
                }}
            />
        </AnimatedModal>
    );
}
