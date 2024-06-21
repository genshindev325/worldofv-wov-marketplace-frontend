import { useBlockchain } from "@/blockchain/BlockchainProvider";
import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useState } from "react";
import { useBalance } from "../components/BalanceProvider";
import NFTCard from "../components/BuyModal/NFTCard";
import Receipt from "../components/BuyModal/Receipt";
import { Button } from "../components/common/Button";
import { CurrencySwitch } from "../components/common/CurrencySwitch";
import { Flex } from "../components/common/Flex";
import { Text } from "../components/common/Text";
import { useItem } from "../components/ProductDetail/ProductDetailProvider";
import { PurchaseCurrency, PURCHASE_CURRENCIES } from "../types/Currencies";
import { EditionData } from "../types/EditionData";
import AnimatedModal from "./AnimatedModal";

interface ModalBuyProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedCurrency: PurchaseCurrency;
    setSelectedCurrency: (currency: PurchaseCurrency) => void;
    onBuy: (edition: EditionData) => void;
}

const ModalBuy: React.FC<ModalBuyProps> = ({
    isOpen,
    setIsOpen,
    selectedCurrency,
    setSelectedCurrency,
    onBuy,
}) => {
    const { balance } = useBalance();
    const { token, selectedEdition } = useItem();
    const { exchangeService } = useBlockchain();

    const [price, setPrice] = useState(new BigNumber(0));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const payment = selectedEdition?.payment;

        if (exchangeService && payment != null) {
            const getAmounts = async () => {
                try {
                    const amountIn = await exchangeService!.getAmountsIn({
                        amountOutWei: new BigNumber(selectedEdition!.price!),
                        fromCurrency: selectedCurrency,
                        toCurrency: payment,
                    });
                    setIsLoading(false);
                    setPrice(amountIn);
                    setError(null);
                } catch (error: any) {
                    setError(error);
                    console.log(error.message);
                }
            };
            if (payment !== selectedCurrency) getAmounts();
            else {
                setIsLoading(false);
                setPrice(selectedEdition.price!);
                setError(null);
            }
        }
    }, [selectedCurrency, selectedEdition, exchangeService]);

    const userBalance = useMemo(
        () => (balance ? balance[selectedCurrency] : undefined),
        [selectedCurrency, balance]
    );

    const newBalance = useMemo(
        () => (price ? userBalance?.minus(price) : undefined),
        [price, userBalance]
    );

    if (!selectedEdition) {
        return null;
    }

    return (
        <AnimatedModal small title="Buy Now" {...{ isOpen, setIsOpen }}>
            <Flex flexDirection="column" columnGap={5}>
                <NFTCard
                    token={{
                        ...token,
                        asset: token.assets[0],
                        price: selectedEdition.price,
                        currency: selectedEdition.payment,
                    }}
                    isBatch={false}
                />
                <Flex alignItems="center" flexWrap="wrap" rowGap={2}>
                    <Text>Pay with:</Text>
                    <CurrencySwitch
                        currencies={PURCHASE_CURRENCIES}
                        selectedCurrency={selectedCurrency}
                        onClick={(currency) => {
                            setIsLoading(true);
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
                    isSwap={selectedEdition?.payment !== selectedCurrency}
                />
                {/*!token.creator.verified && (
                <Alert
                    title="This creator is not verified"
                    text="Purchase this item at your own risk"
                    style={{ marginTop: 32 }}
                />
                )*/}
                <Button
                    disabled={
                        !newBalance || newBalance < new BigNumber(0) || !!error
                    }
                    fullWidth
                    onClick={() => onBuy(selectedEdition)}
                >
                    {!error
                        ? "Buy now"
                        : error.message === "ds-math-sub-underflow"
                        ? "No Liquidity"
                        : "Retry"}
                </Button>
            </Flex>
        </AnimatedModal>
    );
};

export default ModalBuy;
