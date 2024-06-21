import BigNumber from "bignumber.js";
import React from "react";
import styled from "styled-components";
import variables from "../../styles/_variables";
import { Currency } from "../../types/Currencies";
import formatPrice from "../../utils/formatPrice";
import { useBalance } from "../BalanceProvider";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Loader from "../Loader";

const {
    colors: { neutrals, red },
    typography: { body2 },
} = variables;

interface ReceiptProps {
    error: Error | null;
    isLoading: boolean;
    currency: Currency;
    price: BigNumber;
    newBalance: BigNumber;
    isSwap: boolean;
}

interface ColProps {
    isNegative?: boolean;
}

const Receipt: React.FC<ReceiptProps> = ({
    error,
    isLoading,
    currency,
    price,
    newBalance,
    isSwap,
}) => {
    const { balanceFormatted } = useBalance();

    return (
        <Flex columnGap={2} flexDirection="column">
            <Flex>
                <Col>Your balance</Col>
                <Col>
                    {balanceFormatted![currency]} {currency}
                </Col>
            </Flex>
            {!error && (
                <>
                    <Flex flexDirection="column">
                        <Flex>
                            <Col>Amount to pay</Col>
                            {!isLoading ? (
                                <Col>
                                    {formatPrice(price, true, currency)}{" "}
                                    {currency}
                                </Col>
                            ) : (
                                <Col>
                                    <Loader />
                                </Col>
                            )}
                        </Flex>
                        {isSwap && (
                            <Text variant="caption3" color="accent">
                                * Input is estimated
                            </Text>
                        )}
                    </Flex>
                    <Divider />
                    <Flex>
                        <Col>New balance</Col>
                        {!isLoading ? (
                            <Col isNegative={newBalance?.isNegative()}>
                                {formatPrice(newBalance, true, currency)}{" "}
                                {currency}
                            </Col>
                        ) : (
                            <Col>
                                <Loader />
                            </Col>
                        )}
                    </Flex>
                </>
            )}
        </Flex>
    );
};

const Col = styled.div<ColProps>`
    ${body2};

    &:first-child {
        color: ${neutrals[4]};
    }

    &:nth-child(2) {
        margin-left: auto;
        padding-left: 20px;
        font-weight: 500;
        color: ${(props) => (props.isNegative ? `${red}` : `unset`)};
    }
`;

export default Receipt;
