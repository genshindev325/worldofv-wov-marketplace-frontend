import { Alert } from "@/components/common/Alert";
import { Box } from "@/components/common/Box";
import { Delayed } from "@/components/common/Delayed";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import Checkbox from "@/components/FormInputs/Checkbox";
import { Input } from "@/components/FormInputs/Input";
import SwitchField from "@/components/FormInputs/SwitchField";
import usePriceConversion from "@/hooks/usePriceConversion";
import { useUserData } from "@/hooks/useUserData";
import { yupResolver } from "@hookform/resolvers/yup";
import BigNumber from "bignumber.js";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { Button } from "../components/common/Button";
import { OptionItemProps, Select } from "../components/FormInputs/Select";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { SaleCurrency } from "../types/Currencies";
import clearFormattedNumber from "../utils/clearFormattedNumber";
import formatNumber from "../utils/formatNumber";
import formatPrice from "../utils/formatPrice";
import { getPaymentFromContractAddress } from "../utils/getPaymentFromContractAddress";
import { isSameAddress } from "../utils/isSameAddress";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { body2 },
} = variables;

const MAX_EDITIONS_TO_SELL = 50;

const CURRENCY_OPTS: { label: string; value: SaleCurrency }[] = [
    { label: "VET", value: "VET" },
    { label: "WoV", value: "WoV" },
];

interface ModalSell_FixedPriceProps {
    visible: boolean;
    onSell: (values: FormData) => void | Promise<void>;
}

type FormData = {
    price: number;
    currency: OptionItemProps<SaleCurrency>;
    sellMultiple: boolean;
    editionsCount?: number;
    selectedEditionID?: OptionItemProps;
    isFreeShipping?: boolean | null;
};

const validationSchema = yup.object().shape({
    price: yup.number().positive().required(),
    currency: yup.mixed().required(),
    sellMultiple: yup.boolean().optional(),
    editionsCount: yup
        .number()
        .positive()
        .nullable(true)
        .transform((v) => (v === "" || Number.isNaN(v) ? null : v))
        .max(MAX_EDITIONS_TO_SELL)
        .when("sellMultiple", {
            is: true,
            then: yup.number().nullable(true).required(),
        }),
    selectedEditionID: yup
        .object()
        .nullable(true)
        .when("sellMultiple", {
            is: false,
            then: yup
                .object()
                .shape({
                    label: yup.string(),
                    value: yup.string(),
                })
                .required(),
        }),
});

const ModalSell_FixedPrice: React.FC<ModalSell_FixedPriceProps> = ({
    onSell,
    visible,
}) => {
    const { user } = useUserData();
    const priceConversion = usePriceConversion();

    const { token, selectedEdition, collectionStats } = useItem();

    const editionsOwnedNotOnSale = React.useMemo(
        () => token.getEditionsNotOnSaleOwnedBy(user?.address),
        [token, user?.address]
    );

    const defaultCurrency = useMemo(
        () =>
            CURRENCY_OPTS.find((o) => o.value === selectedEdition.payment) ||
            CURRENCY_OPTS[0],
        [selectedEdition.payment]
    );

    const defaultPrice = useMemo(
        () =>
            selectedEdition.price
                ? new BigNumber(selectedEdition.price)
                      .dividedBy(1e18)
                      .toNumber()
                : undefined,
        [selectedEdition.price]
    );

    const isPhygital = !!token.attributes?.find(
        (a) => a.trait_type === "nfcChip" || a.trait_type === "NFC-Chip"
    );

    const calculatePrices = useCallback(
        (priceInput, currency, isAfterTaxes) => {
            let prices;

            if (priceInput) {
                let price = new BigNumber(priceInput);

                if (isAfterTaxes) {
                    const royalty = token.royalty;
                    const fee = currency === "VET" ? 3 : 0;
                    // calculate royalties
                    price = isSameAddress(token.creator.address, user?.address)
                        ? price
                        : price.minus(price.multipliedBy(royalty / 100));
                    // claculate fees
                    price = price.minus(price.multipliedBy(fee / 100));
                }

                if (priceConversion) {
                    const priceToUSD = price.multipliedBy(
                        priceConversion[currency as "VET" | "WoV"]
                    );
                    const priceToVET = priceToUSD.dividedBy(
                        priceConversion["VET"]
                    );
                    const priceToWoV = priceToUSD.dividedBy(
                        priceConversion["WoV"]
                    );
                    prices = {
                        VET: formatPrice(priceToVET, false),
                        WoV: formatPrice(priceToWoV, false),
                        USD: formatPrice(priceToUSD, false),
                    };
                }

                return prices;
            }
        },
        [priceConversion, token.creator.address, token.royalty, user?.address]
    );

    const tokenPrices: Record<string, string>[] | undefined = useMemo(
        () =>
            collectionStats?.floorPrices?.reduce((prices: any, item: any) => {
                const address = item.addressVIP180;
                const payment = getPaymentFromContractAddress(
                    address
                ) as SaleCurrency;
                const rate = priceConversion?.[payment];
                const price = formatNumber(formatPrice(item.price));
                const priceUSD = rate
                    ? new BigNumber(item.price).div(1e18).times(rate).toFixed(2)
                    : null;
                return [...prices, { payment, price, priceUSD }];
            }, []),
        [collectionStats?.floorPrices, priceConversion]
    );

    const getSellingPricePercentage = useCallback(
        (priceInput: number, currency: SaleCurrency) => {
            if (!tokenPrices) return false;

            const price = new BigNumber(priceInput);

            const tokenPrice = tokenPrices.find((obj) => {
                return obj.payment == currency;
            });

            if (!tokenPrice) return false;

            const tokenPriceFormatted = tokenPrice.price.match(/[kKM]/g)
                ? clearFormattedNumber(tokenPrice.price)
                : tokenPrice.price;

            const percentageFromPrice =
                ((Number(tokenPriceFormatted) - Number(price)) /
                    Number(tokenPriceFormatted)) *
                100;

            return percentageFromPrice;
        },
        [tokenPrices]
    );

    const {
        watch,
        handleSubmit,
        reset,
        register,
        control,
        setError,
        formState: { errors, isSubmitting, isValid },
    } = useForm<FormData>({
        defaultValues: {
            currency: defaultCurrency,
            price: defaultPrice,
            isFreeShipping: isPhygital ? false : null,
        },
        mode: "all",
        reValidateMode: "onChange",
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = useCallback(
        async (values: FormData) => {
            if (values.sellMultiple) {
                values.selectedEditionID = undefined;

                values.editionsCount = Math.max(
                    Math.min(values.editionsCount || 0, MAX_EDITIONS_TO_SELL),
                    1
                );
            } else {
                if (!values.selectedEditionID?.value) {
                    values.selectedEditionID = selectedEdition as any;
                }

                const editionData = token.editions.find(
                    (edition) =>
                        edition.editionNumber ===
                        values.selectedEditionID?.value
                );

                if (editionData && values.selectedEditionID) {
                    values.selectedEditionID.value = editionData.id;
                }

                values.editionsCount = 1;
            }

            await onSell(values);

            reset();
        },
        [onSell, reset, selectedEdition, token.editions]
    );

    const isMVACollection =
        token.collection?.name == "Mad Ⓥ-Apes - Phoenix" ||
        token.collection?.name == "Mad Ⓥ-Apes Elementals" ||
        token.collection?.name == "Mad Ⓥ-Apes - Fusion" ||
        token.collection?.name == "Mad Ⓥ-Apes";

    const { currency, price, sellMultiple } = watch();

    const pricesBeforeTaxes = useMemo(
        () => calculatePrices(price, currency?.value, false),
        [calculatePrices, currency?.value, price]
    );

    const pricesAfterTaxes = useMemo(
        () => calculatePrices(price, currency?.value, true),
        [calculatePrices, currency?.value, price]
    );

    const isSellingPriceLowerThanFloor = useMemo(() => {
        if (!priceConversion || !tokenPrices) return false;

        const bnPrice = new BigNumber(price);
        const floorPrice = tokenPrices[0]["priceUSD"];
        const pricePercentage = getSellingPricePercentage(
            Number(bnPrice),
            currency?.value
        );

        const priceToUSD = Number(
            formatPrice(
                bnPrice.multipliedBy(priceConversion[currency?.value]),
                false
            ).replace(",", ".")
        );

        const floorPriceFormatted = Number(
            formatPrice(floorPrice, false).replace(",", ".")
        );

        return pricePercentage >= 20 && priceToUSD < floorPriceFormatted
            ? true
            : false;
    }, [
        currency?.value,
        getSellingPricePercentage,
        price,
        priceConversion,
        tokenPrices,
    ]);

    const otherCurrency = currency.value === "VET" ? "WoV" : "VET";

    if (!visible) return null;

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection="column" columnGap={3}>
                {token.editionsCount > 1 &&
                !sellMultiple &&
                selectedEdition &&
                !selectedEdition?.saleId ? (
                    <Select
                        label="Select Edition"
                        control={control}
                        register={register}
                        errors={errors}
                        setError={setError}
                        inputProps={{
                            name: "selectedEditionID",
                            placeholder: "Select one or more category",
                            options: user?.address
                                ? editionsOwnedNotOnSale.map((edition) => ({
                                      label: edition.editionNumber,
                                      value: edition.id,
                                  }))
                                : [],
                            defaultValue: {
                                label: selectedEdition.editionNumber,
                                value: selectedEdition.id,
                            },
                        }}
                    />
                ) : null}

                <Box position="relative">
                    <Input
                        label="Price"
                        control={control}
                        register={register}
                        errors={errors}
                        setError={setError}
                        inputProps={{
                            name: "price",
                            type: "number",
                            placeholder: "e.g. 10.000",
                        }}
                    />

                    {!errors.price && pricesBeforeTaxes ? (
                        <Box position="absolute" right={2} top={36}>
                            <Text>
                                = {pricesBeforeTaxes[otherCurrency]}{" "}
                                {otherCurrency}
                            </Text>
                        </Box>
                    ) : null}
                </Box>

                <Select
                    label="Currency"
                    control={control}
                    register={register}
                    errors={errors}
                    setError={setError}
                    inputProps={{
                        name: "currency",
                        options: CURRENCY_OPTS,
                        isDisabled: !!selectedEdition.saleId,
                    }}
                />

                {token.editionsCount > 1 &&
                editionsOwnedNotOnSale.length > 1 &&
                !selectedEdition?.saleId ? (
                    <SellMultipleContainer>
                        <SwitchField
                            label="Sell multiple editions"
                            control={control}
                            register={register}
                            errors={errors}
                            setError={setError}
                            description={`Enable this option to select how many editions you want to sell at the same time. (Max ${MAX_EDITIONS_TO_SELL})`}
                            inputProps={{
                                name: "sellMultiple",
                            }}
                        />

                        {sellMultiple && (
                            <Input
                                label="Edition count"
                                control={control}
                                register={register}
                                errors={errors}
                                setError={setError}
                                inputProps={{
                                    type: "number",
                                    name: "editionsCount",
                                    placeholder:
                                        "Enter the number of editions to sell",
                                }}
                            />
                        )}
                    </SellMultipleContainer>
                ) : null}

                {isPhygital && (
                    <Flex rowGap={3} alignItems="center">
                        <Text variant="captionBold2" color="neutral">
                            SHIPPING INCLUDED?
                        </Text>
                        <Checkbox
                            register={register}
                            inputProps={{
                                name: "isFreeShipping",
                            }}
                        />
                    </Flex>
                )}

                {_.isEmpty(errors) && isSellingPriceLowerThanFloor && (
                    <Delayed wait={500} deps={[price]}>
                        <Alert
                            variant="error"
                            title="WARNING"
                            text={`Price selected is way below the floor
                                        price of ${tokenPrices![0]["price"]}
                                        ${tokenPrices![0]["payment"]}`}
                            center
                            noIcon
                        />
                    </Delayed>
                )}
            </Flex>

            <Table>
                <Row>
                    <Col>Marketplace Fee</Col>
                    <Col>
                        {currency?.value == undefined ||
                        currency?.value === "VET" ? (
                            isMVACollection ? (
                                1.5
                            ) : (
                                3
                            )
                        ) : (
                            <>
                                <FeeStroke>
                                    <s>3</s>
                                </FeeStroke>{" "}
                                0
                            </>
                        )}
                        %
                    </Col>
                </Row>

                {isMVACollection && currency?.value === "VET" && (
                    <Row>
                        <Col>Mad ⓥ-Apes DAO</Col>
                        <Col>1.5%</Col>
                    </Row>
                )}

                {token.creator.address !== user?.address && token.royalty ? (
                    <Row>
                        <Col>Royalty</Col>
                        <Col>{token.royalty}%</Col>
                    </Row>
                ) : null}

                {!errors.price && pricesAfterTaxes ? (
                    <Row>
                        <Col>You will receive</Col>
                        <Col>
                            <CalculatedPriceContainer>
                                <span>
                                    {pricesAfterTaxes[currency.value]}{" "}
                                    {currency.value}
                                </span>
                                <small>
                                    ≈ {pricesAfterTaxes[otherCurrency]}{" "}
                                    {otherCurrency}
                                </small>
                                <small>≈ ${pricesAfterTaxes["USD"]}</small>
                            </CalculatedPriceContainer>
                        </Col>
                    </Row>
                ) : null}
            </Table>

            <Buttons>
                <Button
                    type="submit"
                    loader={isSubmitting}
                    disabled={!isValid || isSubmitting || price == defaultPrice}
                >
                    Confirm
                </Button>
            </Buttons>
        </form>
    );
};

const SellMultipleContainer = styled.div`
    margin-bottom: 0;
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const Table = styled.div`
    margin-bottom: 0;
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const Row = styled.div`
    display: flex;
    align-items: flex-start;
    padding-top: 12px;

    &:first-child {
        padding-top: 0;
    }
`;

const Col = styled.div`
    ${body2};

    &:first-child {
        color: ${neutrals[4]};
    }

    &:nth-child(2) {
        margin-left: auto;
        padding-left: 20px;
        font-weight: 500;
    }
`;

const CalculatedPriceContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: right;
    justify-content: flex-end;

    small {
        color: ${neutrals[4]};
    }
`;

const Buttons = styled.div`
    margin-top: 32px;

    ${Button} {
        width: 100%;
    }
`;

const FeeStroke = styled.span`
    color: ${neutrals[4]};
`;

export default ModalSell_FixedPrice;
