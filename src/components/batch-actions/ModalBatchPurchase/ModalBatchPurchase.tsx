import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { useUserData } from "@/hooks/useUserData";
import BigNumber from "bignumber.js";
import { useContext, useEffect, useMemo, useState } from "react";
import {
    ModalContentProps,
    TokenBatchSelectContext,
} from "../../../providers/BatchSelectProvider";
import {
    PurchaseCurrency,
    PURCHASE_CURRENCIES,
    SaleCurrency,
} from "../../../types/Currencies";
import { getPaymentFromContractAddress } from "../../../utils/getPaymentFromContractAddress";
import { useBalance } from "../../BalanceProvider";
import NFTCard from "../../BuyModal/NFTCard";
import Receipt from "../../BuyModal/Receipt";
import { Button } from "../../common/Button";
import { CurrencySwitch } from "../../common/CurrencySwitch";
import { Flex } from "../../common/Flex";
import { Text } from "../../common/Text";
import { useRefresh } from "../../RefreshContext";

export function ModalBatchPurchase({ setIsOpen }: ModalContentProps) {
    const [isLoading, setLoading] = useState(true);
    const [isLoadingTx, setLoadingTx] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<PurchaseCurrency>(
        PURCHASE_CURRENCIES[0]
    );
    const [price, setPrice] = useState(new BigNumber(0));

    const { user } = useUserData();

    const refresh = useRefresh("profile-tab", "collection-tab");

    const { exchangeService, saleService, transactionService } =
        useBlockchain();

    const { refreshBalance, balance } = useBalance();

    const { selectedItems, setSelecting, deselectItem } = useContext(
        TokenBatchSelectContext
    );

    const tokens = useMemo(
        () => selectedItems.valueSeq().toArray(),
        [selectedItems]
    );

    const [isSwap, setIsSwap] = useState(false);

    const userBalance = useMemo(
        () => balance![selectedCurrency],
        [selectedCurrency, balance]
    );

    const newBalance = useMemo(
        () => (price ? userBalance?.minus(price) : undefined),
        [price, userBalance]
    );

    useEffect(() => {
        const getPrice = async () => {
            try {
                const prices = (await Promise.all(
                    tokens.map(async (t) => {
                        const payment = getPaymentFromContractAddress(
                            t.editions[0].saleAddressVIP180
                        ) as SaleCurrency;
                        setIsSwap(false);
                        const price = t.editions[0].salePrice!;

                        if (selectedCurrency !== payment) {
                            const amountIn =
                                await exchangeService!.getAmountsIn({
                                    amountOutWei: new BigNumber(price),
                                    fromCurrency: selectedCurrency,
                                    toCurrency: payment,
                                });

                            setIsSwap(true);

                            return amountIn;
                        }

                        return new Promise((res) => {
                            res(new BigNumber(price));
                        });
                    })
                )) as BigNumber[];
                const result = prices.reduce(
                    (sum: BigNumber, n: BigNumber) => sum.plus(n),
                    new BigNumber(0)
                );
                setLoading(false);
                setPrice(result);
                setError(null);
            } catch (error: any) {
                setError(error);
                setLoading(false);
            }
        };
        getPrice();
    }, [tokens, selectedCurrency, exchangeService]);

    useEffect(() => {
        if (!selectedItems.size) setIsOpen(false);
    }, [selectedItems.size, setIsOpen]);

    useEffect(() => {
        refreshBalance().then(() => setLoading(false));
    }, [refreshBalance]);

    const onSubmit = async () => {
        try {
            setLoadingTx(true);
            setError(null);

            const clauses: Connex.VM.Clause[] = [];

            await Promise.all(
                tokens.map(async (token) => {
                    const saleCurrency = getPaymentFromContractAddress(
                        token.editions[0].saleAddressVIP180
                    ) as SaleCurrency;

                    const salePrice = new BigNumber(
                        token.editions[0].salePrice
                    );

                    if (saleCurrency !== selectedCurrency) {
                        const amountInWei = await exchangeService!.getAmountsIn(
                            {
                                amountOutWei: salePrice,
                                fromCurrency: selectedCurrency,
                                toCurrency: saleCurrency,
                            }
                        );

                        const swapClauses = await exchangeService!.swap({
                            amountInWei,
                            amountOutWei: salePrice,
                            fromCurrency: selectedCurrency,
                            toCurrency: saleCurrency,
                            recipientAddress: user!.address,
                        });

                        clauses.push(...swapClauses);
                    }

                    const buyClauses = await saleService!.buy({
                        smartContractAddress: token.smartContractAddress,
                        tokenId: token.editions[0].editionId!,
                        saleId: token.editions[0].saleId!,
                        priceWei: salePrice,
                        payment: saleCurrency,
                    });

                    clauses.push(...buyClauses);
                })
            );

            await transactionService!.runTransaction({
                clauses,
                comment: `Buy ${tokens.length} NFT(s)`,
                eventNames: ["purchaseNonCustodial"],
                eventCount: tokens.length,
            });

            await refresh();

            setSelecting(false);
            setIsOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setError(error);
        } finally {
            setLoadingTx(false);
        }
    };

    return (
        <Flex flexDirection="column" columnGap={5}>
            <Flex flexDirection="column" columnGap={3}>
                {tokens.map((t) => (
                    <NFTCard
                        key={t.tokenId}
                        token={{
                            ...t,
                            asset: t.assets[0],
                            price: t.editions[0].salePrice,
                            currency: getPaymentFromContractAddress(
                                t.editions[0].saleAddressVIP180
                            ),
                        }}
                        deselectSelf={() => deselectItem(t.tokenId)}
                        isBatch={true}
                    />
                ))}
            </Flex>
            <Flex alignItems="center" flexWrap="wrap" rowGap={2}>
                <Text>Pay with:</Text>
                <CurrencySwitch
                    currencies={PURCHASE_CURRENCIES}
                    selectedCurrency={selectedCurrency}
                    onClick={(currency) => {
                        setLoading(true);
                        setSelectedCurrency(currency as PurchaseCurrency);
                    }}
                />
            </Flex>
            <Receipt
                error={error}
                isLoading={isLoading}
                currency={selectedCurrency}
                price={price}
                newBalance={newBalance!}
                isSwap={isSwap}
            />
            <Button
                onClick={onSubmit}
                loader={isLoadingTx || isLoading}
                disabled={
                    !newBalance || newBalance < new BigNumber(0) || !!error
                }
                fullWidth
            >
                {!error
                    ? "Buy now"
                    : error.message === "ds-math-sub-underflow"
                    ? "No Liquidity"
                    : "Retry"}
            </Button>
        </Flex>
    );
}
