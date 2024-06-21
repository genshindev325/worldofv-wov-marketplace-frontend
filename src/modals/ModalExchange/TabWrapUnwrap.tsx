import BigNumber from "bignumber.js";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { Balance, useBalance } from "../../components/BalanceProvider";
import CircleButton from "../../components/CircleButton";
import { Button } from "../../components/common/Button";
import { Flex } from "../../components/common/Flex";
import { useConnex } from "../../components/ConnexProvider";
import Form from "../../components/FormInputs/Form";
import { Input } from "../../components/FormInputs/Input";
import Icon from "../../components/Icon";
import { AnimatedModalProps } from "../AnimatedModal";
import { SmallButton } from "./SmallButton";

interface FormData {
    amount: string;
    exchangedAmount: string;
}

const validationSchema = yup.object().shape({
    amount: yup.number().typeError("").positive().required(),
});

export default function TabWrapUnwrap({
    setIsOpen,
}: Pick<AnimatedModalProps, "setIsOpen">) {
    const { balance, error: balanceError, refreshBalance } = useBalance();

    const [loading, setLoading] = useState(true);
    const [txError, setTxError] = useState<any>(null);
    const [{ from, to }, setDirection] = useState<{
        from: keyof Balance;
        to: keyof Balance;
    }>({ from: "VET", to: "vVET" });

    const {
        exchangeVETForVVET,
        exchangeVVETForVET,
        checkTransactionOnBlockchain,
    } = useConnex();

    const balanceString = useMemo(
        () =>
            _.mapValues(balance, (v) => {
                if (!v) {
                    return "--";
                } else {
                    return v.div(1e18).toFormat(2, BigNumber.ROUND_FLOOR, {
                        groupSize: 3,
                        groupSeparator: ".",
                        decimalSeparator: ",",
                    });
                }
            }),
        [balance]
    );

    const maxAmount = useMemo(
        () =>
            balance?.[from]
                ?.div(1e18)
                ?.decimalPlaces(2, BigNumber.ROUND_FLOOR)
                ?.toNumber(),
        [balance, from]
    );

    const swapDirection = () => setDirection({ from: to, to: from });

    const onSubmit = async ({ amount }: FormData) => {
        try {
            setTxError(null);

            const exchange =
                from === "VET" ? exchangeVETForVVET : exchangeVVETForVET;

            const wei = new BigNumber(amount).multipliedBy(10 ** 18);
            const tx = await exchange(wei);

            await checkTransactionOnBlockchain({
                txID: tx.txid,
                txOrigin: tx.signer,
                eventName: from === "VET" ? "Deposit" : "Withdrawal",
                toast: { enabled: true, success: "Exchange completed!" },
            });

            await refreshBalance();

            setIsOpen(false);
        } catch (error: any) {
            console.warn(error?.message || error);
            setTxError(error);
        }
    };

    useEffect(
        () => {
            refreshBalance()?.then(() => setLoading(false));
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useMemo(() => {
        validationSchema.fields.amount = validationSchema.fields.amount.test({
            name: "maxAmount",
            message: "The typed amount is more than your balance",
            exclusive: true,
            test: (value) => {
                if (!value) return true;
                if (!maxAmount || maxAmount <= 0) return false;
                else return value <= maxAmount;
            },
        });
    }, [maxAmount]);

    return (
        <Form<FormData>
            {...{ onSubmit, validationSchema }}
            render={({
                formState: { isValid, isSubmitting },
                watch,
                trigger,
                setValue,
            }) => {
                const exchangedAmount = watch("amount");

                const onSelectMax = () => {
                    setValue("amount", maxAmount!.toString());
                    trigger();
                };

                return (
                    <Flex flexDirection="column" columnGap={3}>
                        <Input
                            label={from}
                            rightLabel={`${balanceString[from]} ${from}`}
                            inputProps={{
                                name: "amount",
                                type: "number",
                                placeholder: "Amount",
                                step: "0.01",
                            }}
                            rightDecoration={
                                parseFloat(exchangedAmount) !== maxAmount && (
                                    <SmallButton outline onClick={onSelectMax}>
                                        max
                                    </SmallButton>
                                )
                            }
                        />

                        <CircleButton
                            onClick={() => {
                                trigger();
                                swapDirection();
                            }}
                            type="button"
                            style={{ alignSelf: "center" }}
                        >
                            <Icon icon="sort" />
                        </CircleButton>

                        <Input
                            label={to}
                            rightLabel={`${balanceString[to]} ${to}`}
                            inputProps={{
                                name: "exchangedAmount",
                                type: "number",
                                placeholder: "Amount",
                                disabled: true,
                                value: exchangedAmount,
                            }}
                        />

                        <Button
                            type="submit"
                            loader={isSubmitting || loading}
                            disabled={
                                balanceError ||
                                loading ||
                                isSubmitting ||
                                !isValid
                            }
                            fullWidth
                        >
                            {txError
                                ? "Retry"
                                : balanceError
                                ? "Could not fetch balance."
                                : `Exchange ${from} for ${to}`}
                        </Button>
                    </Flex>
                );
            }}
        />
    );
}
