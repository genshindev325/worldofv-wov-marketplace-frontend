import { useBlockchain } from "@/blockchain/BlockchainProvider";
import CollectionSelect from "@/components/CollectionSelect";
import { Alert } from "@/components/common/Alert";
import { Box } from "@/components/common/Box";
import { Button } from "@/components/common/Button";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import ModalDelegate from "@/modals/ModalDelegate";
import { userAddressSelector } from "@/store/selectors";
import { theme } from "@/styles/theme";
import { ICollectionData } from "@/types/CollectionData";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

export const dateOptions: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
};

interface AddressInfo {
    address: string;
    name?: string;
}

const DashboardDelegation = () => {
    const userAddress = useRecoilValue(userAddressSelector);
    const blockchain = useBlockchain();

    const [addressInfo, setAddressInfo] = useState<AddressInfo>();
    const [selectedTimeframe, setSelectedTimeframe] = useState({
        daysDuration: 10,
        text: "10D",
        extendedText: "10 days",
    });
    const [delegationInfo, setDelegationInfo] = useState<Record<string, any>>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const checkDelegation = async () => {
            const delegationInfo =
                await blockchain.delegationService?.getDelegationInfo();
            setDelegationInfo(delegationInfo);
        };
        checkDelegation();
    }, [blockchain.delegationService, userAddress]);

    const onSelectCollection = (collection: ICollectionData | null) => {
        setAddressInfo({
            address: collection!.stakingContractAddresses![0],
            name: collection?.name,
        });
    };

    const onDelegate = async () => {
        setIsModalOpen(true);
    };

    const timeframes = [
        { daysDuration: 10, text: "10D", extendedText: "10 days" },
        { daysDuration: 30, text: "1M", extendedText: "1 month" },
        { daysDuration: 90, text: "3M", extendedText: "3 months" },
        { daysDuration: 180, text: "6M", extendedText: "6 months" },
        { daysDuration: 365, text: "12M", extendedText: "1 year" },
    ];

    return (
        <Box mx={2} my={4}>
            <Text variant="bodyBold1" as="h3">
                Genesis Delegation
            </Text>
            {delegationInfo?.distributionEndTime <
            Math.floor(new Date().getTime() / 1000) ? (
                <>
                    <Text color="accent" mt={1}>
                        Delegate the $WoV tokens generated by your Genesis
                        Cards. Select a collection from below and choose the
                        number of days you&apos;d like to delegate for.
                    </Text>
                    <Text color="accent" mb={3}>
                        A 3% fee burn will be applied to the $WoV delegated.
                    </Text>
                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        rowGap={{ _: 0, t: 5 }}
                        flexWrap="wrap"
                    >
                        <StyledCollectionSelect
                            onSelectCollection={onSelectCollection}
                            needsStakingAddress
                            removeGenesisCollections
                        />
                        <Flex
                            alignItems="center"
                            rowGap={{ _: 0, a: 4 }}
                            mb={{ _: 4, a: 0 }}
                            flexGrow={1}
                            justifyContent={{ _: "center", a: "flex-start" }}
                        >
                            <Text display={{ _: "none", m: "unset" }}>
                                Duration:
                            </Text>
                            <Flex
                                justifyContent={{
                                    _: "center",
                                    a: "flex-start",
                                }}
                            >
                                {timeframes.map((timeframe) => (
                                    <StyledButton
                                        key={timeframe.daysDuration}
                                        onClick={() =>
                                            setSelectedTimeframe(timeframe)
                                        }
                                        outline={
                                            selectedTimeframe.daysDuration ===
                                            timeframe.daysDuration
                                                ? false
                                                : true
                                        }
                                    >
                                        {timeframe.text}
                                    </StyledButton>
                                ))}
                            </Flex>
                        </Flex>
                        <StyledDelegate
                            onClick={onDelegate}
                            disabled={!addressInfo}
                        >
                            Delegate
                        </StyledDelegate>
                    </Flex>
                </>
            ) : (
                <Alert
                    variant="info"
                    title="$WoV delegation is active"
                    text={`Delegation ends on ${new Date(
                        delegationInfo?.distributionEndTime * 1000
                    ).toLocaleDateString(undefined, dateOptions)}`}
                />
            )}
            <ModalDelegate
                addressInfo={addressInfo}
                timeframe={selectedTimeframe}
                isOpen={isModalOpen}
                setIsOpen={setIsModalOpen}
            />
        </Box>
    );
};

export default DashboardDelegation;

const StyledButton = styled(Button)`
    border-radius: 0 !important;
    padding: 0 10px;
    :first-child {
        border-radius: 15px 0 0 15px !important;
    }
    :last-child {
        border-radius: 0 15px 15px 0 !important;
    }
    @media screen and (min-width: ${theme.breakpoints.s}) {
        padding: 0 24px;
    }
`;

const StyledCollectionSelect = styled(CollectionSelect)`
    width: 100%;
    margin-bottom: 16px;
    @media screen and (min-width: ${theme.breakpoints.t}) {
        width: unset;
        margin-bottom: 0;
        flex-grow: 1;
    }
`;

const StyledDelegate = styled(Button)`
    width: 100%;
    @media screen and (min-width: ${theme.breakpoints.a}) {
        width: unset;
    }
`;
