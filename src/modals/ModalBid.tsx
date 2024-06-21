import BigNumber from "bignumber.js";
import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import { useAuction } from "../components/Auction/AuctionProvider";
import { useBalance } from "../components/BalanceProvider";
import { Alert } from "../components/common/Alert";
import { Button } from "../components/common/Button";
import { Flex } from "../components/common/Flex";
import Form from "../components/FormInputs/Form";
import { Input } from "../components/FormInputs/Input";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import formatPrice from "../utils/formatPrice";
import AnimatedModal from "./AnimatedModal";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { body2 },
} = variables;

interface ModalBidProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    onBid: (values: FormData) => void;
}

type FormData = {
    price: string;
};

const validationSchema = yup.object().shape({
    price: yup.number().positive().required(),
});

const ModalBid: React.FC<ModalBidProps> = ({ isOpen, setIsOpen, onBid }) => {
    const { auction, token } = useAuction();
    const { balance, balanceFormatted } = useBalance();

    const userBalance = React.useMemo(() => {
        const payment = auction?.payment;
        return new BigNumber((payment != null && balance?.[payment]) || 0);
    }, [auction?.payment, balance]);

    const userBalanceFormatted = React.useMemo(() => {
        const payment = auction?.payment;
        return (payment != null && balanceFormatted?.[payment]) || "0";
    }, [auction?.payment, balanceFormatted]);

    const minimumBidValue = React.useMemo(
        () =>
            Number(
                auction?.minimumBid
                    ? auction.minimumBid.dividedBy(10 ** 18).toFormat(2, {
                          groupSeparator: "",
                          decimalSeparator: ".",
                      })
                    : 1
            ),
        [auction?.minimumBid]
    );

    const schema = React.useMemo(() => {
        validationSchema.fields.price =
            validationSchema.fields.price.min(minimumBidValue);

        return validationSchema;
    }, [minimumBidValue]);

    if (!auction || !token) {
        return null;
    }

    return (
        <AnimatedModal
            small
            title="Place a bid"
            info={
                <>
                    You are about to place a bid for{" "}
                    <strong>{token.name}</strong>
                </>
            }
            {...{ isOpen, setIsOpen }}
        >
            <Form<FormData>
                resetOnSubmit
                {...{ onSubmit: onBid, validationSchema: schema }}
                render={({ formState: { isValid, isSubmitting }, watch }) => {
                    const price = watch("price") || "0";

                    const priceAsWei = new BigNumber(price).multipliedBy(
                        10 ** 18
                    );

                    const newBalance = userBalance.minus(priceAsWei);

                    return (
                        <Flex flexDirection="column" columnGap={3}>
                            <Input
                                label="Price"
                                inputProps={{
                                    name: "price",
                                    type: "text",
                                    placeholder: `You must bid at least ${auction.formattedMinimumBid} ${auction.payment}`,
                                    defaultValue: minimumBidValue,
                                }}
                            />
                            <Table>
                                <Row>
                                    <Col>You will pay</Col>
                                    <Col>
                                        {formatPrice(price, false)}{" "}
                                        {auction.payment}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>Your balance</Col>
                                    <Col>
                                        {userBalanceFormatted} {auction.payment}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>New balance</Col>
                                    <Col>
                                        {formatPrice(newBalance)}{" "}
                                        {auction.payment}
                                    </Col>
                                </Row>
                            </Table>
                            <Alert text="Once a bid is placed, it cannot be withdrawn." />
                            <Button
                                type="submit"
                                disabled={
                                    !isValid ||
                                    isSubmitting ||
                                    !newBalance ||
                                    newBalance < new BigNumber(0)
                                }
                                fullWidth
                            >
                                Place a bid
                            </Button>
                        </Flex>
                    );
                }}
            />
        </AnimatedModal>
    );
};

const Table = styled.div`
    padding-top: 8px;
`;

const Row = styled.div`
    display: flex;
    padding-top: 12px;

    &:first-child {
        padding-top: 0;
    }

    &:nth-last-child(2) {
        padding: 12px 0 12px;
        border-bottom: 1px solid ${neutrals[6]};

        ${dark`
            border-color: ${neutrals[3]};
        `}
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

export default ModalBid;
