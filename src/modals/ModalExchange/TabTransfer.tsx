import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { useBalance } from "@/components/BalanceProvider";
import { Alert } from "@/components/common/Alert";
import { Box } from "@/components/common/Box";
import { Button } from "@/components/common/Button";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import { Input } from "@/components/FormInputs/Input";
import { Select } from "@/components/FormInputs/Select";
import SearchResultModal from "@/components/Header/GlobalSerachBar/SearchResultModal";
import useGraphQL from "@/hooks/useGraphQL";
import { PurchaseCurrency, PURCHASE_CURRENCIES } from "@/types/Currencies";
import { yupResolver } from "@hookform/resolvers/yup";
import BigNumber from "bignumber.js";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Web3 from "web3";
import * as yup from "yup";
import { AnimatedModalProps } from "../AnimatedModal";
import { SmallButton } from "./SmallButton";

interface FormData {
    recipientAddress: string;
    amount: string;
}

export default function TabTransfer({
    setIsOpen,
}: Pick<AnimatedModalProps, "setIsOpen">) {
    const {
        balance,
        refreshBalance,
        isValidating: isValidatingBalance,
    } = useBalance();

    useEffect(() => {
        refreshBalance();
    }, [refreshBalance]);

    // This is not part of the form data because we need to know the selected
    // currency to be able to validate the amount max value.
    const [currency, setCurrency] = useState<PurchaseCurrency>(
        PURCHASE_CURRENCIES[0]
    );

    const currentBalance = useMemo(
        () =>
            balance?.[currency]
                ?.div(1e18)
                ?.decimalPlaces(2, BigNumber.ROUND_FLOOR)
                ?.toNumber(),
        [balance, currency]
    );

    const validationSchema = useMemo(
        () =>
            yup.object().shape({
                amount: yup
                    .number()
                    .positive("Must be a positive integer.")
                    .required("Required")
                    .test({
                        message: "The typed amount is more than your balance",
                        test: (value) => {
                            if (!value) return true;
                            if (!currentBalance || currentBalance <= 0)
                                return false;
                            else return value <= currentBalance;
                        },
                    }),

                recipientAddress: yup
                    .string()
                    .required()
                    .test({
                        message:
                            "Given address is not a valid VeChain address.",
                        test: (value) =>
                            value ? Web3.utils.isAddress(value) : false,
                    }),
            }),
        [currentBalance]
    );

    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            recipientAddress: "",
            amount: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const recipientAddress = watch("recipientAddress");

    // Search cannot be executed on inputs less than 3 characters in length.
    const shouldSearch = useMemo(
        () =>
            recipientAddress.length >= 3 &&
            !Web3.utils.isAddress(recipientAddress),
        [recipientAddress]
    );

    const { sdk } = useGraphQL();

    const { data, isValidating: isValidatingUsers } = useSWR(
        shouldSearch ? [recipientAddress, "SEARCH_USERS_BY_STRING"] : null,
        (text) => sdk.SearchUsersByString({ text, limit: 3 }),
        { revalidateOnFocus: false }
    );

    const { exchangeService, transactionService } = useBlockchain();

    const onTransfer = async ({ recipientAddress, amount }: FormData) => {
        const clauses = await exchangeService!.transfer({
            currency,
            recipientAddress,
            amountWei: new BigNumber(amount).multipliedBy(1e18),
        });

        await transactionService!.runTxOnBlockchain({
            clauses,
            comment: `Send ${amount} ${currency} to ${recipientAddress}`,
        });

        await refreshBalance();

        setIsOpen(false);
    };

    return (
        <form onSubmit={handleSubmit(onTransfer)}>
            <Flex flexDirection="column" columnGap={4}>
                <Box position="relative" height="100%">
                    <Input
                        label="recipient"
                        errors={errors}
                        inputProps={{
                            ...register("recipientAddress"),
                            placeholder:
                                "Search profile or enter a VeChain address",
                        }}
                    />
                    <SearchResultModal
                        isOpen={Boolean(data || isValidatingUsers)}
                        isLoading={!data && isValidatingUsers}
                        searchResult={
                            data?.searchByString ?? {
                                collections: null,
                                tokens: null,
                                users: null,
                            }
                        }
                        searchText={recipientAddress}
                        setValue={(address) =>
                            setValue("recipientAddress", address)
                        }
                        setIsSearchBarOpen={() => null}
                    />
                </Box>

                <Select
                    label="currency"
                    inputProps={{
                        name: "currency",
                        value: { label: currency, value: currency },
                        onChange: (c) => setCurrency(c.value),
                        options: PURCHASE_CURRENCIES.map((currency) => ({
                            label: currency,
                            value: currency,
                        })),
                    }}
                />

                {typeof currentBalance === "number" && (
                    <p>
                        <Text
                            display="inline-block"
                            color="accent"
                            variant="body2"
                        >
                            Your balance:
                        </Text>
                        <Text
                            display="inline-block"
                            color="text"
                            variant="bodyBold2"
                            style={{ float: "right" }}
                        >
                            {currentBalance} {currency}
                        </Text>
                    </p>
                )}

                <Input
                    label="amount"
                    errors={errors}
                    inputProps={{
                        type: "number",
                        step: "0.01",
                        ...register("amount"),
                    }}
                    rightDecoration={
                        <SmallButton
                            outline
                            disabled={!currentBalance}
                            onClick={() =>
                                setValue("amount", currentBalance!.toString())
                            }
                        >
                            max
                        </SmallButton>
                    }
                />

                <Alert
                    title="This action cannot be undone"
                    text="Please ensure that the recipient is a VeChain address"
                />

                <Button
                    type="submit"
                    loader={isSubmitting}
                    disabled={isValidatingBalance}
                >
                    Transfer
                </Button>
            </Flex>
        </form>
    );
}
