import { FC } from "react";
import { Currency } from "../../../types/Currencies";
import { Box } from "../Box";
import { Flex } from "../Flex";

export interface CurrencySwitchProps {
    currencies: readonly Currency[];
    selectedCurrency: Currency;
    onClick?: (currency: Currency) => void;
}

export const CurrencySwitch: FC<CurrencySwitchProps> = ({
    currencies,
    selectedCurrency,
    onClick = () => {},
}) => (
    <Flex alignItems="center">
        {currencies.map((currency, index) => {
            const isFirst = index === 0;
            const isLast = index === currencies.length - 1;
            const isSelected = currency === selectedCurrency;

            return (
                <Box
                    key={currency}
                    bg={isSelected ? "primary" : "background"}
                    color={isSelected ? "white" : "text"}
                    px={{ _: 2, s: 3 }}
                    py={2}
                    border="1px solid"
                    borderColor="muted"
                    borderRight={isLast ? "1px solid muted" : "unset"}
                    borderTopLeftRadius={isFirst ? 2 : 0}
                    borderBottomLeftRadius={isFirst ? 2 : 0}
                    borderTopRightRadius={isLast ? 2 : 0}
                    borderBottomRightRadius={isLast ? 2 : 0}
                    onClick={() => {
                        onClick(currency);
                    }}
                >
                    {currency}
                </Box>
            );
        })}
    </Flex>
);
