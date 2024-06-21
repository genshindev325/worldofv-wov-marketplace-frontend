import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { BusinessLeaderboard } from "@/components/business/BusinessLeaderboard";
import { Button } from "@/components/common/Button";
import { Text } from "@/components/common/Text";
import useGraphQL from "@/hooks/useGraphQL";
import { getCollectionStats } from "@/utils/getCollectionStats";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useState } from "react";
import { TbScan, TbTicket, TbTicketOff, TbUsers } from "react-icons/tb";
import styled from "styled-components";
import useSWR from "swr";
import type { AbiItem } from "web3-utils";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import { Box } from "../common/Box";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { WhatsappButton } from "../common/WhatsappButton";
import { AdminChart } from "./AdminChart";
import { CounterCard } from "./CounterCard";
import { EventsDisplayer } from "./EventsDisplayer";

const { containerLarge } = common;
const { dark } = mixins;

const cooldownAbi = [
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
] as AbiItem[];

const pointsAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
] as AbiItem[];

export type BusinessAdminPageContentProps = {
    slug: string;
    pointsContractAddress: string;
    pointsCollectionId: string;
    vouchersContractAddress: string;
    vouchersCollectionId?: string;
    logoUrlLight?: string;
    logoUrlDark?: string;
    bannerUrlMobile: string;
    bannerUrlDesktop: string;
    businessAddress: string;
};

export const BusinessAdminPageContent: FC<BusinessAdminPageContentProps> = ({
    slug,
    pointsContractAddress,
    pointsCollectionId,
    vouchersContractAddress,
    vouchersCollectionId,
    logoUrlLight,
    logoUrlDark,
    bannerUrlMobile,
    bannerUrlDesktop,
    businessAddress,
}) => {
    const blockchain = useBlockchain();
    const router = useRouter();
    const { sdk } = useGraphQL();

    const [pointStats, setPointStats] = useState<any>();
    const [voucherStats, setVoucherStats] = useState<any>();
    const [pointsContract, setPointsContract] = useState<any>();
    const [cooldownContract, setCooldownContract] = useState<any>();
    const [ownerBalance, setOwnerBalance] = useState(0);
    const [latestClaimedPoints, setLatestClaimedPoints] = useState<any[]>([]);
    const [latestClaimedVouchers, setLatestClaimedVouchers] = useState<any[]>(
        []
    );

    const { data: pointsLastTransfers } = useSWR(
        [
            {
                smartContractAddress: pointsContractAddress,
                page: 1,
                perPage: 5,
            },
            "POINTS_LAST_TRANSFERS",
        ],
        (args) => sdk.getLastTransfersForCollection(args)
    );

    const { data: vouchersLastTransfers } = useSWR(
        [
            {
                smartContractAddress: vouchersContractAddress,
                page: 1,
                perPage: 5,
            },
            "VOUCHERS_LAST_TRANSFERS",
        ],
        (args) => sdk.getLastTransfersForCollection(args)
    );

    const options = useMemo(
        () => ({
            filter: { to: businessAddress },
            fromBlock: "earliest",
            toBlock: "latest",
        }),
        [businessAddress]
    );

    useEffect(() => {
        getCollectionStats(pointsCollectionId)
            .then((res) => {
                setPointStats(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [pointsCollectionId]);

    useEffect(() => {
        getCollectionStats(vouchersCollectionId!)
            .then((res) => {
                setVoucherStats(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [vouchersCollectionId]);

    useEffect(() => {
        blockchain.web3Service
            .getContractByABI(cooldownAbi, vouchersContractAddress)
            .then(setCooldownContract)
            .catch(console.log);
    }, [blockchain.web3Service, vouchersContractAddress]);

    useEffect(() => {
        blockchain.web3Service
            .getContractByABI(pointsAbi, pointsContractAddress)
            .then(setPointsContract)
            .catch(console.log);
    }, [blockchain.web3Service, pointsContractAddress]);

    useEffect(() => {
        if (cooldownContract != null) {
            cooldownContract.methods
                .balanceOf(businessAddress!)
                .call()
                .then(setOwnerBalance);
        }
    }, [businessAddress, cooldownContract]);

    useEffect(() => {
        if (pointsContract != null) {
            pointsContract
                .getPastEvents("Transfer", {
                    // filter: { from: smartContractAddress },
                    fromBlock: "earliest",
                    toBlock: "latest",
                })
                .then(setLatestClaimedPoints)
                .catch(console.log);
        }
    }, [pointsContract, options, pointsContractAddress]);

    useEffect(() => {
        if (cooldownContract != null) {
            cooldownContract
                .getPastEvents("Transfer", options)
                .then(setLatestClaimedVouchers)
                .catch(console.log);
        }
    }, [cooldownContract, options]);

    const data = useMemo(() => {
        const arr = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ].reduce<{ name: string; tickets: number; vouchers: number }[]>(
            (acc, month) => [
                ...acc,
                {
                    name: month,
                    tickets: 0,
                    vouchers: 0,
                },
            ],
            []
        );

        latestClaimedPoints.forEach((e) => {
            const date = new Date(e.meta.blockTimestamp * 1000);
            const month = date.getMonth(); // in [0, 11]
            arr[month].tickets += 1;
        });

        latestClaimedVouchers.forEach((e) => {
            const date = new Date(e.meta.blockTimestamp * 1000);
            const month = date.getMonth(); // in [0, 11]
            arr[month].vouchers += 1;
        });

        return arr;
    }, [latestClaimedPoints, latestClaimedVouchers]);

    return (
        <section>
            <Banner imgMobile={bannerUrlMobile} imgDesktop={bannerUrlDesktop}>
                {logoUrlLight != null && logoUrlDark != null && (
                    <Box display={{ _: "none", t: "block" }} height="100%">
                        <Flex
                            alignItems="center"
                            justifyContent="flex-end"
                            height="100%"
                            position="relative"
                        >
                            <Box py={2} px={5} bg="white">
                                <BusinessLogo
                                    imgLight={logoUrlLight}
                                    imgDark={logoUrlDark}
                                    width={464}
                                    height={127}
                                    bg="white"
                                />
                            </Box>
                        </Flex>
                    </Box>
                )}
            </Banner>

            <Container>
                <Spacer y size={4} />
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    flexWrap="wrap"
                >
                    <CounterCard
                        Icon={TbUsers}
                        text="Unique customers"
                        count={pointStats?.ownersCount || 0}
                        flex={1}
                        flexBasis={240}
                        m={2}
                    />
                    <CounterCard
                        Icon={TbScan}
                        text="Points claimed"
                        count={pointStats?.itemsCount || 0}
                        flex={1}
                        flexBasis={240}
                        m={2}
                    />
                    <CounterCard
                        Icon={TbTicket}
                        text="Vouchers claimed"
                        count={voucherStats?.itemsCount || 0}
                        flex={1}
                        flexBasis={240}
                        m={2}
                    />
                    <CounterCard
                        Icon={TbTicketOff}
                        text="Vouchers used"
                        count={ownerBalance || 0}
                        flex={1}
                        flexBasis={240}
                        m={2}
                    />
                </Flex>

                <Spacer y size={5} />
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    mt={{ _: 0, t: 5 }}
                    mb={6}
                >
                    <div style={{ width: "100%" }}>
                        <Text textAlign="center">Count of claims</Text>
                        <AdminChart data={data} />
                    </div>
                </Flex>
                <Spacer y size={5} />

                <Flex
                    alignItems="flex-start"
                    justifyContent="center"
                    flexWrap="wrap"
                >
                    <EventsDisplayer
                        Icon={TbTicket}
                        title="Claimed points"
                        users={
                            pointsLastTransfers?.getLastTransfersForCollection
                                .users
                        }
                        m={2}
                        flexBasis={400}
                    />
                    <EventsDisplayer
                        Icon={TbTicket}
                        title="Claimed vouchers"
                        users={
                            vouchersLastTransfers?.getLastTransfersForCollection
                                .users
                        }
                        m={2}
                        flexBasis={400}
                    />
                    <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box m={2}>
                            <BusinessLeaderboard
                                smartContractAddress={pointsContractAddress}
                                initialTab="monthly"
                                showMoreButton={false}
                            />
                            <Spacer y size={4} />
                            <Button
                                fullWidth
                                onClick={() => {
                                    router.push(
                                        `/business/leaderboard/${slug}`
                                    );
                                }}
                            >
                                Go to Leaderboard
                            </Button>
                        </Box>
                    </Flex>
                </Flex>
            </Container>

            <WhatsappButton />
        </section>
    );
};

const Container = styled.div`
    ${containerLarge}
`;

const BusinessLogo = styled(Box)<{
    imgLight: string;
    imgDark: string;
}>`
    background-image: url(${(props) => props.imgLight});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    ${(props) => dark`
        background-image: url(${props.imgDark});
    `}
`;

const Banner = styled(Box)<{ imgMobile: string; imgDesktop: string }>`
    height: 120px;
    background-image: url(${(props) => props.imgMobile});
    background-position: top;
    background-repeat: no-repeat;
    background-size: cover;
    @media screen and (min-width: ${({ theme }) => theme.breakpoints.t}) {
        margin: 0 auto;
        max-width: 1400px;
        height: 300px;
        background-image: url(${(props) => props.imgDesktop});
        background-position: bottom center;
    }
`;
