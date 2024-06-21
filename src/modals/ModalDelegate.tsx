import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { Box } from "@/components/common/Box";
import { Button } from "@/components/common/Button";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import { dateOptions } from "@/components/Dashboard/InfoTop/DashboardDelegation";
import React, { useMemo, useState } from "react";
import AnimatedModal, { AnimatedModalProps } from "./AnimatedModal";

interface ModalDelegateProps extends AnimatedModalProps {
    addressInfo: any;
    timeframe: Record<string, any>;
}

const ModalDelegate: React.FC<ModalDelegateProps> = ({
    isOpen,
    setIsOpen,
    ...props
}) => {
    return (
        <AnimatedModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Delegation"
            info="Please review the details of the delegation you wish to make and click confirm to finalize the process."
        >
            <ModalContent setIsOpen={setIsOpen} {...props} />
        </AnimatedModal>
    );
};

const ModalContent = ({
    setIsOpen,
    addressInfo,
    timeframe,
}: Pick<ModalDelegateProps, "setIsOpen" | "addressInfo" | "timeframe">) => {
    const blockchain = useBlockchain();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const endDate = useMemo(() => {
        const unixTimestamp = Math.round(new Date().getTime() / 1000);
        const secondsDuration = timeframe.daysDuration * 60 * 60 * 24;
        const endDate = unixTimestamp + secondsDuration;
        return new Date(endDate * 1000).toLocaleDateString(
            undefined,
            dateOptions
        );
    }, [timeframe.daysDuration]);

    const onConfirm = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const clauses = await blockchain.delegationService!.delegateStaking(
                {
                    addresses: [addressInfo.address],
                    // this is an hardcode value as we permit single delegation for all your staking for now
                    ratesPercentages: [100],
                    daysDuration: timeframe.daysDuration,
                }
            );
            await blockchain.transactionService!.runTxOnBlockchain({
                clauses,
                comment: `Delegating for ${timeframe.daysDuration} days to ${addressInfo.address} `,
            });
            setIsOpen(false);
        } catch (error: any) {
            console.warn(error.message || error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Flex flexDirection="column" columnGap={4}>
            <Flex flexDirection="column" columnGap={1}>
                <Flex rowGap={4}>
                    <Text variant="body2" color="accent">
                        Collection:
                    </Text>
                    <Box>
                        <Text variant="bodyBold2">{addressInfo.name}</Text>
                        {/* <Text variant="bodyBold2">{addressInfo.address}</Text> */}
                    </Box>
                </Flex>
                <Flex rowGap={4}>
                    <Text variant="body2" color="accent" mr="27px">
                        Length:
                    </Text>
                    <Flex flexWrap="wrap">
                        <Text variant="bodyBold2" whiteSpace="nowrap" mr={3}>
                            {timeframe.extendedText}
                        </Text>
                        <Text variant="body2" color="accent">
                            ({endDate})
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Button loader={isLoading} onClick={onConfirm}>
                {error ? "Retry" : "Confirm"}
            </Button>
            <Box>
                <Text variant="caption2" color="accent">
                    * Delegated Genesis/Special cannot be undelegated
                </Text>
                <Text variant="caption2" color="accent">
                    * Staked Genesis/Special cannot be unstaked
                </Text>
            </Box>
        </Flex>
    );
};

export default ModalDelegate;
