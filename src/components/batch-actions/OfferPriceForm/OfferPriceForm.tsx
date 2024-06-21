import { yupResolver } from "@hookform/resolvers/yup";
import BigNumber from "bignumber.js";
import _ from "lodash";
import {
    ElementType,
    InputHTMLAttributes,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { BsLightningChargeFill } from "react-icons/bs";
import styled from "styled-components";
import * as yup from "yup";
import useConvertPrices from "../../../hooks/useConvertPrices";
import { OfferBatchSelectContext } from "../../../providers/BatchSelectProvider";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import formatPrice from "../../../utils/formatPrice";
import CircleButton from "../../CircleButton";
import { Button } from "../../common/Button";
import { Text } from "../../common/Text";
import { TokenAsset } from "../../common/TokenAsset";
import { Input } from "../../FormInputs/Input";
import Icon from "../../Icon";
import InfoPopup from "../../InfoPopup";
import Link from "../../Link";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

interface FormValues {
    prices: Record<string, string>;
}

type SupportedCurrency = "VET" | "WoV" | "vVET";

export type OfferPriceFormProps = {
    onSubmit: (prices: Record<string, string>) => Promise<void>;
    TokenNameDecoration?: ElementType<{ token: any }>;
    /**
     * If the value is a string the same currency will be used for every item
     * in the list.
     */
    currency: SupportedCurrency | ((token: any) => SupportedCurrency);
    /**
     * Used in conjunction with global currency for setting a maximum price.
     */
    balanceWei?: BigNumber;
    getDefaultPrice?: (token: any) => BigNumber | undefined;
};

export function OfferPriceForm({
    currency,
    balanceWei,
    TokenNameDecoration,
    getDefaultPrice,
    ...props
}: OfferPriceFormProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { selectedItems, deselectItem } = useContext(OfferBatchSelectContext);

    const priceValidationSchema = useMemo(() => {
        let base = yup
            .number()
            .typeError("Must be a number")
            .min(1, "Must be at least 1");

        if (balanceWei && typeof currency === "string") {
            base = base.max(
                balanceWei.dividedBy(1e18).toNumber(),
                `The price must be less than or equal to \${max} ${currency}`
            );
        }

        return base;
    }, [balanceWei, currency]);

    const validationSchema = useMemo(
        () =>
            yup.object({
                prices: yup.object(
                    selectedItems.map(() => priceValidationSchema).toObject()
                ),
            }),
        [selectedItems, priceValidationSchema]
    );

    const defaultPrices = useMemo(
        () =>
            selectedItems.entrySeq().reduce((acc, [id, token]) => {
                const defaultPrice = getDefaultPrice?.(token);

                acc[id] = defaultPrice
                    ? formatPrice(defaultPrice).replace(/\./g, "")
                    : undefined;

                return acc;
            }, {} as { [k: string]: string | undefined }),
        [getDefaultPrice, selectedItems]
    );

    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        formState: { errors },
        clearErrors,
        watch,
    } = useForm<FormValues>({
        defaultValues: { prices: defaultPrices },
        resolver: yupResolver(validationSchema),
        reValidateMode: "onChange",
    });

    const onAutofill = () => {
        const { prices } = getValues();
        const referenceValue = prices[selectedItems.first()!.offerId];
        let updated = prices;
        if (Object.values(prices).every((v) => v)) {
            updated = _.mapValues(prices, () => "");
            updated[selectedItems.first()!.offerId] = referenceValue;
        } else if (referenceValue) {
            updated = _.mapValues(prices, (p) => p || referenceValue);
        }
        setValue("prices", updated);
        clearErrors();
    };

    const { prices } = watch();
    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            setHasError(false);
            await props?.onSubmit(data.prices);
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <TableContainer>
                <Table>
                    <thead>
                        <Row>
                            <TableHeader></TableHeader>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>
                                Price
                                <InfoPopup>
                                    Click the bolt to copy the first row price
                                    to all rows. Click again to reset the
                                    column.
                                </InfoPopup>
                                <AutofillIcon onClick={onAutofill} />
                            </TableHeader>
                        </Row>
                    </thead>
                    <tbody>
                        {selectedItems.valueSeq().map((offer) => (
                            <Item
                                key={offer.offerId}
                                offer={offer}
                                errors={errors}
                                currency={
                                    typeof currency === "string"
                                        ? currency
                                        : currency(offer)
                                }
                                price={prices[offer.offerId]}
                                tokenNameDecoration={
                                    TokenNameDecoration && (
                                        <TokenNameDecoration token={offer} />
                                    )
                                }
                                inputProps={register(
                                    `prices.${offer.offerId}`,
                                    {
                                        shouldUnregister: true,
                                    }
                                )}
                                deselectSelf={() => deselectItem(offer.offerId)}
                            />
                        ))}
                    </tbody>
                </Table>
            </TableContainer>

            <Button type="submit" loader={isLoading}>
                {hasError ? "Retry" : "Confirm"}
            </Button>
        </Form>
    );
}

interface ItemProps {
    offer: any;
    inputProps: InputHTMLAttributes<HTMLInputElement>;
    currency: SupportedCurrency;
    deselectSelf?: () => void;
    tokenNameDecoration?: ReactNode;
    errors?: any;
    price: string;
}

function Item({
    offer,
    inputProps,
    currency,
    deselectSelf,
    tokenNameDecoration,
    errors,
    price,
}: ItemProps) {
    const href = useMemo(
        () =>
            offer.token
                ? `/token/${offer.smartContractAddress}/${offer.tokenId}`
                : `/collection/${offer.smartContractAddress}`,
        [offer.token, offer.smartContractAddress, offer.tokenId]
    );

    const otherCurrency = useMemo(
        () => (["VET", "vVET"].includes(currency) ? "WoV" : "VET"),
        [currency]
    );

    const convertedPrices = useConvertPrices(
        [new BigNumber(price)],
        currency,
        false
    );

    return (
        <Row key={offer.offerId}>
            <Cell>
                <Link href={href}>
                    <a>
                        <TokenAsset asset={offer.asset} sizePx={72} />
                    </a>
                </Link>
            </Cell>
            <Cell>
                <Link href={href}>
                    <a>{offer.token?.name ?? offer.collection.name}</a>
                </Link>
                {tokenNameDecoration}
                {!!offer.token?.rank && (
                    <DimText>
                        Rank: <strong>{offer.token.rank}</strong>
                    </DimText>
                )}
            </Cell>

            <Cell>
                <Input
                    errors={errors}
                    rightDecoration={<InputLabel>{currency}</InputLabel>}
                    inputProps={{
                        type: "number",
                        step: "0.01",
                        ...inputProps,
                    }}
                />

                {price && (
                    <Text textAlign="right" variant="caption2">
                        ={" "}
                        {convertedPrices &&
                            convertedPrices[0]?.formattedPrices[
                                otherCurrency
                            ]}{" "}
                        {otherCurrency}
                    </Text>
                )}
            </Cell>

            <Cell>
                <CircleButton outline small onClick={deselectSelf}>
                    <Icon icon="close" />
                </CircleButton>
            </Cell>
        </Row>
    );
}

const TableContainer = styled.div`
    overflow-x: auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Table = styled.table`
    border-spacing: 8px;
    border-collapse: separate;
    white-space: nowrap;
`;

const TableHeader = styled.th`
    ${typography.hairline1}
    vertical-align: middle;
    color: ${neutrals[3]};

    ${dark`
        color: ${neutrals[5]};
    `}
`;

const Row = styled.tr`
    > :not(:first-child) {
        padding-inline-start: 16px;
    }
`;

const Cell = styled.td<{ centered?: boolean }>`
    ${typography.body2}
    vertical-align: top;
    color: ${neutrals[2]};

    :nth-child(3) {
        width: 192px;
        min-width: 128px;
    }

    :last-child {
        text-align: right;
    }

    ${dark`
        color: ${neutrals[6]};
    `}
`;

const InputLabel = styled.div`
    ${typography.caption1}
    color: ${neutrals[4]};
    margin-left: 4px;
`;

const DimText = styled.p`
    ${typography.caption2}
    color: ${neutrals[4]};
`;

const AutofillIcon = styled(BsLightningChargeFill)`
    float: right;
    cursor: pointer;
`;
