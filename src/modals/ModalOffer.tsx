import InfoPopup from "@/components/InfoPopup";
import { useUserData } from "@/hooks/useUserData";
import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useState } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import styled, { useTheme } from "styled-components";
import * as yup from "yup";
import { useBalance } from "../components/BalanceProvider";
import { Box } from "../components/common/Box";
import { Button } from "../components/common/Button";
import { CurrencySwitch } from "../components/common/CurrencySwitch";
import { Flex } from "../components/common/Flex";
import { Text } from "../components/common/Text";
import { useConnex } from "../components/ConnexProvider";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import { OptionItemProps, Select } from "../components/FormInputs/Select";
import Icon from "../components/Icon";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import useConvertPrices from "../hooks/useConvertPrices";
import { useCollection } from "../providers/CollectionProvider";
import variables from "../styles/_variables";
import { OfferCurrency, OFFER_CURRENCIES } from "../types/Currencies";
import { OfferType } from "../types/OfferData";
import formatNumber from "../utils/formatNumber";
import formatPrice from "../utils/formatPrice";
import { getPaymentFromContractAddress } from "../utils/getPaymentFromContractAddress";
import AnimatedModal, { AnimatedModalProps } from "./AnimatedModal";

const { typography } = variables;

export interface ModalOfferProps
    extends Pick<AnimatedModalProps, "isOpen" | "setIsOpen" | "zIndex"> {
    offerType: OfferType;
}

type FormData = {
    edition: OptionItemProps;
    amount: string[];
};

interface OfferToMake {
    id: number;
    amount: string;
}

export default function ModalOffer({
    offerType,
    ...modalProps
}: ModalOfferProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const { balance, refreshBalance } = useBalance();
    const { createOffer, checkTransaction } = useConnex();
    const { user: userData } = useUserData();
    const [formValues, setFormValues] = React.useState<FormData>();
    const [offersToMake, setOffersToMake] = useState<OfferToMake[]>([
        { id: 0, amount: "0" },
    ]);
    const [selectedCurrency, setSelectedCurrency] = useState<OfferCurrency>(
        OFFER_CURRENCIES[0]
    );

    const {
        token,
        selectedEdition: initialEdition,
        mutateOffers: mutateTokenOffers,
    } = useItem();

    const { collection } = useCollection() as any;
    const prices = formValues?.amount?.map((price) => new BigNumber(price));
    const convertedPrices = useConvertPrices(
        prices ?? [new BigNumber(0)],
        selectedCurrency,
        false
    );

    const theme = useTheme();

    const otherCurrency = React.useMemo(() => {
        return selectedCurrency === "vVET" ? "WoV" : "VET";
    }, [selectedCurrency]);

    const validationSchema = React.useMemo(() => {
        // Minimum offers are temporarily disabled

        // validationSchema.fields.amount = validationSchema.fields.amount.min(
        //     collection?.minimumOffer && type === "collection"
        //         ? Number(collection.minimumOffer)
        //         : 0,
        //     `The minimum offer for this ${type} is ${
        //         collection?.minimumOffer ?? 1
        //     } vVET`
        // );

        const amountSchema = yup
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
            });

        return yup.object().shape({
            edition: yup.mixed().notRequired(),
            amount: yup.array().of(amountSchema),
        });
    }, [balance, selectedCurrency]);

    const editionOptions = useMemo(() => {
        if (!userData?.address || !token?.editions) return [];

        return token.editions
            .filter((e) => e.owner.address !== userData.address)
            .map((e) => {
                const label = `Edition #${e.editionNumber}`;

                const info = e.price
                    ? `(${e.formattedPrice} ${e.payment})`
                    : "(Not on Sale)";

                return { label: `${label} ${info}`, value: e.id };
            });
    }, [token?.editions, userData?.address]);

    const previousOffer = useMemo(() => {
        if (token) {
            return token
                .getActiveOffersInitiatedBy(userData?.address)
                ?.find((o) =>
                    offerType === "EDITION"
                        ? o.editionId === formValues?.edition?.value
                        : offerType === "TOKEN"
                        ? o.tokenId && !o.editionId
                        : !o.tokenId && !o.editionId
                );
        }
    }, [token, offerType, userData?.address, formValues?.edition?.value]);

    useEffect(() => {
        refreshBalance()
            ?.then(() => setIsLoading(false))
            .catch(setError);
    }, [refreshBalance]);

    const onSubmit = async ({ edition, amount }: FormData) => {
        try {
            if (!formValues) return false;

            if (balance === undefined) {
                await refreshBalance();
                return;
            }

            const offerData = Object.entries(formValues.amount).map(
                ([id, amount]) => {
                    const wei = new BigNumber(amount).multipliedBy(10 ** 18);

                    return {
                        smartContractAddress:
                            token?.smartContractAddress ||
                            collection!.smartContractAddress!,
                        tokenId: token?.id,
                        editionId:
                            offerType === "EDITION"
                                ? edition!.value
                                : undefined,
                        amount: wei,
                        currency: selectedCurrency,
                        previousOfferId: previousOffer?.offerId,
                    };
                }
            );

            const tx = await createOffer(...offerData);

            await checkTransaction({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: "NewBuyOffer",
                toast: { enabled: true, success: "Offer created!" },
            });

            await mutateTokenOffers?.();

            modalProps.setIsOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setError(error);
        }
    };

    const defaultValues = useMemo(() => {
        const edition =
            editionOptions.find((e) => e.value === initialEdition?.id) ||
            editionOptions?.[0];

        if (offerType === "EDITION" && !edition) {
            return undefined;
        }

        return {
            edition,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offerType, JSON.stringify(editionOptions), initialEdition?.id]);

    if (!defaultValues) {
        return null;
    }

    return (
        <AnimatedModal
            small
            title={`${previousOffer ? "Update" : "Make an"} offer`}
            info={
                offerType === "COLLECTION" ? (
                    <>
                        Place an offer for any token from{" "}
                        <strong>{collection.name}</strong> collection. This
                        offer can be accepted by any{" "}
                        <strong>{collection.name}</strong> holder.
                    </>
                ) : offerType === "TOKEN" ? (
                    "Make an offer to all the editions."
                ) : (
                    "Make an offer to a specific edition."
                )
            }
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
                    defaultValues,
                }}
                render={({
                    formState: { isValid, isSubmitting },
                    watch,
                    getValues,
                    setValue,
                    clearErrors,
                    trigger,
                }) => {
                    watch(setFormValues as any);
                    const onAutofill = () => {
                        const { amount } = getValues();
                        let value = [];
                        if (amount.every((element) => element === amount[0])) {
                            value = amount.map((element, idx) =>
                                idx === 0 ? element : ""
                            );
                        } else {
                            value = amount.map(() => amount[0]);
                        }
                        setValue("amount", value);
                        trigger("amount");
                        clearErrors();
                    };
                    return (
                        <Flex flexDirection="column" columnGap={3}>
                            {offerType === "COLLECTION" &&
                                collection.stats?.highestCollectionOffer && (
                                    <Box
                                        backgroundColor={theme.colors.muted}
                                        height={40}
                                    >
                                        <Text
                                            textAlign="center"
                                            variant="bodyBold2"
                                            mt={10}
                                        >
                                            Highest Collection Offer:{" "}
                                            {formatNumber(
                                                formatPrice(
                                                    collection.stats
                                                        .highestCollectionOffer
                                                        .price
                                                )
                                            )}{" "}
                                            {getPaymentFromContractAddress(
                                                collection.stats
                                                    .highestCollectionOffer
                                                    .addressVIP180
                                            )}
                                        </Text>
                                    </Box>
                                )}
                            <Flex
                                alignItems="center"
                                flexWrap="wrap"
                                rowGap={2}
                            >
                                <Text>Offer with:</Text>
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

                            {offerType === "EDITION" &&
                                editionOptions.length > 1 && (
                                    <Select
                                        label="Edition"
                                        inputProps={{
                                            name: "edition",
                                            options: editionOptions,
                                        }}
                                    />
                                )}

                            {offerType === "COLLECTION" ? (
                                <Flex
                                    position="relative"
                                    flexDirection="column"
                                    columnGap={3}
                                >
                                    <Box
                                        position="absolute"
                                        left={6}
                                        top={2}
                                        zIndex={1}
                                    >
                                        <InfoPopup>
                                            Click the bolt to copy the first row
                                            price to all rows. Click again to
                                            reset the column.
                                        </InfoPopup>
                                    </Box>
                                    <AutofillIcon onClick={onAutofill} />
                                    {offersToMake.map((offerToMake, index) => (
                                        <Box
                                            key={`${index}_${offerToMake.id}`}
                                            position="relative"
                                        >
                                            <Input
                                                label={`Price #${index + 1}`}
                                                inputProps={{
                                                    name: `amount[${offerToMake.id}]`,
                                                    type: "number",
                                                    step: "any",
                                                    value: formValues?.amount
                                                        ? formValues.amount[
                                                              index
                                                          ]
                                                        : undefined,
                                                }}
                                                rightDecoration={
                                                    offerToMake.id > 0 && (
                                                        <SmallButton
                                                            outline
                                                            onClick={() =>
                                                                setOffersToMake(
                                                                    (
                                                                        current: any
                                                                    ) =>
                                                                        current.filter(
                                                                            (
                                                                                element: any
                                                                            ) => {
                                                                                return (
                                                                                    element.id !==
                                                                                    offerToMake.id
                                                                                );
                                                                            }
                                                                        )
                                                                )
                                                            }
                                                        >
                                                            <Icon icon="close" />
                                                        </SmallButton>
                                                    )
                                                }
                                            />
                                            {prices &&
                                                prices[index] &&
                                                !!prices[index].toNumber() && (
                                                    <Box
                                                        position="absolute"
                                                        right={40}
                                                        top={36}
                                                    >
                                                        <Text
                                                            key={index}
                                                            textAlign="end"
                                                            color={
                                                                theme.colors
                                                                    .accent
                                                            }
                                                        >
                                                            ≃
                                                            {convertedPrices &&
                                                                convertedPrices[
                                                                    index
                                                                ]
                                                                    ?.formattedPrices[
                                                                    otherCurrency
                                                                ]}{" "}
                                                            {otherCurrency}
                                                        </Text>
                                                    </Box>
                                                )}
                                        </Box>
                                    ))}
                                </Flex>
                            ) : (
                                <>
                                    <Input
                                        label="Price"
                                        inputProps={{
                                            name: "amount[0]",
                                            type: "number",
                                            step: "any",
                                        }}
                                    />

                                    {prices && !!prices[0].toNumber() && (
                                        <Text
                                            textAlign="end"
                                            color={theme.colors.accent}
                                        >
                                            ≃
                                            {convertedPrices &&
                                                convertedPrices[0]
                                                    ?.formattedPrices[
                                                    otherCurrency
                                                ]}{" "}
                                            {otherCurrency}
                                        </Text>
                                    )}
                                </>
                            )}

                            {offerType === "COLLECTION" && (
                                <Button
                                    small
                                    outline
                                    onClick={() =>
                                        setOffersToMake([
                                            ...offersToMake,
                                            {
                                                id: offersToMake.length,
                                                amount: "0",
                                            },
                                        ])
                                    }
                                    disabled={offersToMake.length === 10}
                                >
                                    <Icon icon="plus" />
                                    Add another offer
                                </Button>
                            )}

                            <Button
                                type="submit"
                                loader={isLoading || isSubmitting}
                                disabled={!isValid || isSubmitting || isLoading}
                                fullWidth
                            >
                                {error
                                    ? "Retry"
                                    : previousOffer
                                    ? "Update offer"
                                    : "Make an offer"}
                            </Button>
                        </Flex>
                    );
                }}
            />
        </AnimatedModal>
    );
}

const SmallButton = styled(Button)`
    ${typography.hairline2}
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 0;
    font-size: 8px;
    text-transform: uppercase;
`;

const AutofillIcon = styled(BsLightningChargeFill)`
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: -2px;
    z-index: 1;
`;
