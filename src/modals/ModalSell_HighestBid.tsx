import { Box } from "@/components/common/Box";
import { Text } from "@/components/common/Text";
import Checkbox from "@/components/FormInputs/Checkbox";
import { useUserData } from "@/hooks/useUserData";
import { AuctionCurrency } from "@/types/Currencies";
import { yupResolver } from "@hookform/resolvers/yup";
import BigNumber from "bignumber.js";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import { Button } from "../components/common/Button";
import { Flex } from "../components/common/Flex";
import { Spacer } from "../components/common/Spacer";
import { Input } from "../components/FormInputs/Input";
import { OptionItemProps, Select } from "../components/FormInputs/Select";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import useConvertPrices from "../hooks/useConvertPrices";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { isSameAddress } from "../utils/isSameAddress";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { body2 },
} = variables;

interface ModalSell_HighestBidProps {
    visible: boolean;
    onAuction: (values: FormData) => void | Promise<void>;
}

type FormData = {
    reservePrice: string;
    currency: OptionItemProps<AuctionCurrency>;
    duration: OptionItemProps;
    isFreeShipping?: boolean | null;
};

const validationSchema = yup.object().shape({
    reservePrice: yup
        .number()
        .positive()
        .required()
        .typeError("Must be a number."),
    currency: yup.mixed().required(),
    duration: yup.mixed().required(),
});

// TODO: use CurrencySwitch instead of input field
const ModalSell_HighestBid: React.FC<ModalSell_HighestBidProps> = ({
    visible,
    onAuction,
}) => {
    const { user } = useUserData();
    const { token } = useItem();

    const isPhygital = !!token.attributes?.find(
        (a) => a.trait_type === "nfcChip" || a.trait_type === "NFC-Chip"
    );

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isDirty },
        watch,
    } = useForm<FormData>({
        defaultValues: {
            currency: { label: "VET", value: "VET" },
            isFreeShipping: isPhygital ? false : null,
        },
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    });

    const { reservePrice, currency, duration } = watch();

    const priceAfterFee = React.useMemo(() => {
        const price = new BigNumber(reservePrice);

        const royalty = token.royalty;
        const fee = currency.value === "VET" ? 3 : 0;

        const priceAfterRoyalty = isSameAddress(
            token.creator.address,
            user?.address
        )
            ? price
            : price.minus(price.multipliedBy(royalty / 100));

        return priceAfterRoyalty.minus(
            priceAfterRoyalty.multipliedBy(fee / 100)
        );
    }, [
        currency,
        reservePrice,
        token.creator.address,
        token.royalty,
        user?.address,
    ]);

    const convertedPrices = useConvertPrices(
        [new BigNumber(reservePrice)],
        currency.value,
        false
    );

    const convertedAfterFee = useConvertPrices(
        [new BigNumber(priceAfterFee)],
        currency.value,
        false
    );

    const otherCurrency = React.useMemo(
        () => (currency.value === "VET" ? "WoV" : "VET"),
        [currency.value]
    );

    const [amount, unit] = duration ? duration.value.split("_") : [,];

    if (!visible) return null;

    return (
        <form onSubmit={handleSubmit((values) => onAuction(values))}>
            <Flex flexDirection="column" columnGap={3}>
                <Box position="relative">
                    <Input
                        label="Reserve Price"
                        errors={errors}
                        inputProps={{
                            ...register("reservePrice"),
                            type: "number",
                            placeholder: "e.g. 10.000",
                        }}
                    />

                    {!errors.reservePrice &&
                    convertedPrices &&
                    parseInt(convertedPrices[0]?.formattedPrices.USD ?? "0") >
                        0 &&
                    isDirty ? (
                        <Box position="absolute" right={2} top={36}>
                            <Text>
                                ={" "}
                                {
                                    convertedPrices[0]?.formattedPrices[
                                        otherCurrency
                                    ]
                                }{" "}
                                {otherCurrency}
                            </Text>
                        </Box>
                    ) : null}
                </Box>

                <Select
                    label="Currency"
                    control={control}
                    errors={errors}
                    inputProps={{
                        name: "currency",
                        options: [
                            { label: "VET", value: "VET" },
                            { label: "WoV", value: "WoV" },
                        ],
                    }}
                />

                <Select
                    label="Duration"
                    control={control}
                    errors={errors}
                    inputProps={{
                        name: "duration",
                        maxMenuHeight: 200,
                        options: [
                            { label: "1 hour", value: "1_HOUR" },
                            { label: "2 hours", value: "2_HOURS" },
                            { label: "6 hours", value: "6_HOURS" },
                            {
                                label: "12 hours",
                                value: "12_HOURS",
                            },
                            {
                                label: "24 hours",
                                value: "24_HOURS",
                            },
                            { label: "2 days", value: "2_DAYS" },
                            { label: "4 days", value: "4_DAYS" },
                            { label: "7 days", value: "7_DAYS" },
                        ],
                    }}
                />

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
            </Flex>

            <Table>
                <Row>
                    <Col>Marketplace Fee</Col>
                    <Col>
                        {currency?.value == undefined ||
                        currency?.value === "VET" ? (
                            3
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

                {token.creator.address !== user?.address && token.royalty ? (
                    <Row>
                        <Col>Royalty</Col>
                        <Col>{token.royalty}%</Col>
                    </Row>
                ) : null}

                <Row>
                    <Col>Ends on</Col>
                    <Col>
                        {duration?.value
                            ? moment(moment.now())
                                  .add(amount, unit)
                                  .format("LLL")
                            : "…"}
                    </Col>
                </Row>

                {!errors.reservePrice &&
                convertedAfterFee &&
                parseInt(convertedAfterFee[0]?.formattedPrices.USD ?? "0") >
                    0 &&
                isDirty ? (
                    <Row>
                        <Col>You will receive</Col>
                        <Col>
                            <CalculatedPriceContainer>
                                <span>
                                    {
                                        convertedAfterFee[0]?.formattedPrices[
                                            currency.value
                                        ]
                                    }{" "}
                                    {currency.value}
                                </span>

                                {
                                    <>
                                        <small>
                                            ≈{" "}
                                            {
                                                convertedAfterFee[0]
                                                    ?.formattedPrices[
                                                    otherCurrency
                                                ]
                                            }{" "}
                                            {otherCurrency}
                                        </small>
                                        <small>
                                            ≈ $
                                            {
                                                convertedAfterFee[0]
                                                    ?.formattedPrices.USD
                                            }
                                        </small>
                                    </>
                                }
                            </CalculatedPriceContainer>
                        </Col>
                    </Row>
                ) : null}
            </Table>
            <Spacer y size={4} />
            <Button
                type="submit"
                loader={isSubmitting}
                disabled={!isValid || isSubmitting}
                fullWidth
            >
                Sell
            </Button>
        </form>
    );
};

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

const FeeStroke = styled.span`
    color: ${neutrals[4]};
`;

export default ModalSell_HighestBid;
