import { Box } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import SearchResultModal from "@/components/Header/GlobalSerachBar/SearchResultModal";
import useGraphQL from "@/hooks/useGraphQL";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import {
    ElementType,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import { BsLightningChargeFill } from "react-icons/bs";
import styled from "styled-components";
import useSWR from "swr";
import Web3 from "web3";
import * as yup from "yup";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import CircleButton from "../../CircleButton";
import { Alert } from "../../common/Alert";
import { Button } from "../../common/Button";
import { TokenAsset } from "../../common/TokenAsset";
import { Input } from "../../FormInputs/Input";
import Icon from "../../Icon";
import InfoPopup from "../../InfoPopup";
import Link from "../../Link";

interface FormValues {
    to: Record<string, string>;
}

export type TransferTokenFormProps = {
    onSubmit: (to: Record<string, string>) => Promise<void>;
    TokenNameDecoration?: ElementType<{ token: any }>;
    getDefaultAddress?: (token: any) => string | undefined;
};

export function TransferTokenForm({
    TokenNameDecoration,
    getDefaultAddress,
    ...props
}: TransferTokenFormProps) {
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { selectedItems, deselectItem } = useContext(TokenBatchSelectContext);

    const addressValidationSchema = useMemo(() => {
        let base = yup
            .string()
            .required()
            .test(
                "isValidAddress",
                "Given address is not a valid VeChain address.",
                (value) => (value ? Web3.utils.isAddress(value) : false)
            );
        return base;
    }, []);

    const validationSchema = useMemo(
        () =>
            yup.object({
                to: yup.object(
                    selectedItems.map(() => addressValidationSchema).toObject()
                ),
            }),
        [selectedItems, addressValidationSchema]
    );

    const defaultAddresses = useMemo(
        () =>
            selectedItems.entrySeq().reduce((acc, [id, token]) => {
                const defaultAddress = getDefaultAddress?.(token);

                acc[id] = undefined;

                return acc;
            }, {} as { [k: string]: string | undefined }),
        [getDefaultAddress, selectedItems]
    );

    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        formState: { errors, isValid, isSubmitting },
        clearErrors,
        watch,
        reset,
    } = useForm<FormValues>({
        defaultValues: { to: defaultAddresses },
        resolver: yupResolver(validationSchema),
        reValidateMode: "onChange",
    });

    const onAutofill = () => {
        const { to } = getValues();
        const referenceValue = to[selectedItems.first()!.tokenId];
        let updated = to;

        if (Object.values(to).every((v) => v)) {
            updated = _.mapValues(to, () => "");
            updated[selectedItems.first()!.tokenId] = referenceValue;
        } else if (referenceValue) {
            updated = _.mapValues(to, (p) => p || referenceValue);
        }

        setValue("to", updated);
        clearErrors();
    };

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            setHasError(false);
            await props?.onSubmit(data.to);
        } catch (error: any) {
            console.warn(error.message || error);
            setHasError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection="column" columnGap={3} position="relative">
                <Flex
                    position="absolute"
                    top={5}
                    right={3}
                    alignItems="baseline"
                    rowGap={1}
                    zIndex={1}
                >
                    <InfoPopup>
                        Click the bolt to copy the first row address to all
                        rows. Click again to reset the column.
                    </InfoPopup>
                    <AutofillIcon onClick={onAutofill} />
                </Flex>

                {selectedItems.valueSeq().map((token) => (
                    <Item
                        key={token.tokenId}
                        token={token}
                        errors={errors}
                        tokenNameDecoration={
                            TokenNameDecoration && (
                                <TokenNameDecoration token={token} />
                            )
                        }
                        inputProps={{
                            register,
                            watch,
                            setValue,
                            reset,
                            isValid,
                            errors,
                        }}
                        deselectSelf={() => deselectItem(token.tokenId)}
                    />
                ))}

                <Alert
                    title="Action cannot be undone"
                    text="Please ensure that the recipient addresses are VeChain only"
                    style={{ marginTop: 10 }}
                />

                <Button type="submit" loader={isLoading || isSubmitting}>
                    {hasError ? "Retry" : "Confirm"}
                </Button>
            </Flex>
        </form>
    );
}

interface ItemProps {
    token: any;
    inputProps: any;
    deselectSelf?: () => void;
    tokenNameDecoration?: ReactNode;
    errors?: any;
}

function Item({
    token,
    inputProps,
    deselectSelf,
    tokenNameDecoration,
    errors,
}: ItemProps) {
    const { sdk } = useGraphQL();

    const href = useMemo(
        () => `/token/${token.smartContractAddress}/${token.tokenId}`,
        [token.tokenId, token.smartContractAddress]
    );

    const [isFocus, setIsFocus] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    const { watch, setValue, register, reset, isValid } = inputProps;

    useEffect(() => {
        const subscription = watch((value: any) =>
            setShouldFetch(
                value.to[token.tokenId]?.trim().length > 2 &&
                    !isValid &&
                    isFocus
            )
        );
        setShouldFetch(
            watch().to[token.tokenId]?.trim().length > 2 && isFocus && !isValid
        );
        return () => subscription.unsubscribe();
    }, [isFocus, isValid, token.tokenId, watch]);

    const { data, isValidating } = useSWR(
        shouldFetch
            ? [watch().to[token.tokenId]?.trim(), "SEARCH_USERS_BY_STRING"]
            : null,
        (text) => sdk.SearchUsersByString({ text, limit: 3 })
    );

    const setValues = (address: string) =>
        setValue(`to.${token.tokenId}`, address ?? "", {
            shouldUnregister: true,
        });

    const truncateTokenName = (
        stringToTruncate: string,
        stringLength: number,
        isPFP: boolean
    ) => {
        if (stringToTruncate.length < stringLength) return stringToTruncate;

        const tokenIdRegex = "#.*[0-9]";
        const tokenId = isPFP ? stringToTruncate.match(tokenIdRegex) : null;

        const truncatedString = stringToTruncate.slice(0, stringLength - 1);

        return isPFP
            ? truncatedString.replace(tokenIdRegex, "") + "... " + tokenId
            : truncatedString;
    };

    return (
        <Flex key={token.tokenId} columnGap={3} rowGap={3} alignItems="end">
            <Link href={href}>
                <a>
                    <TokenAsset asset={token.assets[0]} sizePx={72} />
                </a>
            </Link>
            <Box flexGrow={1} width="100%" position="relative">
                <Flex alignItems="center" rowGap={1}>
                    <Link href={href}>
                        <a>
                            <Text variant="captionBold1">
                                {truncateTokenName(
                                    token.name,
                                    12,
                                    token.collection?.type === "EXTERNAL"
                                )}
                            </Text>
                        </a>
                    </Link>
                    {tokenNameDecoration}
                    {!!token.rank && (
                        <Text
                            variant="caption2"
                            color="neutral"
                            display={{ _: "none", p: "unset" }}
                        >
                            Rank: <strong>{token.rank}</strong>
                        </Text>
                    )}
                </Flex>
                <Input
                    inputProps={{
                        name: `to.${token.tokenId}`,
                        placeholder:
                            "Search profile or enter a VeChain address",
                        type: "text",
                        step: "0.01",
                    }}
                    register={register}
                    setIsFocus={setIsFocus}
                    buttonIcon={shouldFetch ? "close" : undefined}
                    onButtonClick={reset}
                    errors={errors}
                />

                <SearchResultModal
                    isOpen={shouldFetch}
                    isLoading={isValidating}
                    searchResult={
                        data?.searchByString ?? {
                            collections: null,
                            tokens: null,
                            users: null,
                        }
                    }
                    searchText={watch().to[token.tokenId]?.trim()}
                    setValue={setValues}
                    setIsSearchBarOpen={() => null}
                />
                <StyledCircleButton small onClick={deselectSelf}>
                    <Icon icon="close" />
                </StyledCircleButton>
            </Box>
        </Flex>
    );
}

const AutofillIcon = styled(BsLightningChargeFill)`
    float: right;
    cursor: pointer;
    @media only screen and (min-width: ${({ theme }) => theme.breakpoints.s}) {
        top: 20px;
    }
`;

const StyledCircleButton = styled(CircleButton)`
    position: absolute;
    height: 30px !important;
    width: 30px !important;
    z-index: 2;
    top: -10px;
    left: -100px;
    background-color: ${({ theme }) => theme.colors.background};
    border: ${({ theme }) => `1px solid ${theme.colors.accent}`};
    .icon {
        color: ${({ theme }) => theme.colors.accent};
    }
    &:hover {
        background-color: ${({ theme }) => theme.colors.muted};
    }
`;
