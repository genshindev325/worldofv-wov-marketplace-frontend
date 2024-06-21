import useGraphQL from "@/hooks/useGraphQL";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import Link from "../Link";
import UserAvatar from "../UserAvatar";

export type BusinessLeaderboardProps = {
    smartContractAddress: string;
    initialTab?: "overall" | "monthly";
    showMoreButton?: boolean;
};

export function BusinessLeaderboard({
    smartContractAddress,
    initialTab = "overall",
    showMoreButton = true,
}: BusinessLeaderboardProps) {
    const { sdk } = useGraphQL();

    const [page, setPage] = useState(1);
    const [users, setUsers] = useState<any>();
    const [overall, setOverall] = useState(initialTab === "overall");

    const beginOfMonth = useMemo(() => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    }, []);

    // Temporary - we start the check overall and this month from sunday
    // IMPORTANT need to be changed at the beginning of next month
    const fromDate = useMemo(() => {
        if (
            smartContractAddress ===
            "0xC40BC08aF312ca03592a54F96fB34c10bd10Cb37"
        ) {
            return new Date("2023-03-11").toISOString();
        }
        return overall ? null : beginOfMonth;
    }, [beginOfMonth, overall, smartContractAddress]);
    const { data } = useSWR(
        [
            {
                smartContractAddress,
                page,
                perPage: showMoreButton ? 10 : 5,
                fromDate,
            },
            "RECEPIENT_COUNT",
        ],
        (args) => sdk.getRecepientCountForCollection(args)
    );

    useEffect(() => {
        if (data?.getRecepientCountForCollection.users) {
            const tempUsers = data?.getRecepientCountForCollection.users;
            if (page === 1) setUsers(tempUsers);
            else {
                setUsers([...users, ...tempUsers]);
            }
        }
    }, [data, page]);

    return (
        <Flex flexDirection="column" columnGap={4}>
            <Flex justifyContent="center" alignItems="center" rowGap={3}>
                <Text variant="captionBold1">View Points By:</Text>
                <Flex>
                    <StyledButton
                        outline={!overall}
                        onClick={() => {
                            setPage(1);
                            setOverall(true);
                        }}
                    >
                        Overall
                    </StyledButton>
                    <StyledButton
                        outline={overall}
                        onClick={() => {
                            setPage(1);
                            setOverall(false);
                        }}
                    >
                        Monthly
                    </StyledButton>
                </Flex>
            </Flex>
            {users?.length > 0 ? (
                <Box m="0 auto" width={{ _: "90%", a: 500 }}>
                    <Box display={{ _: "none", a: "flex" }}>
                        <Text mr={6} variant="captionBold1">
                            Rank
                        </Text>
                        <Text flexGrow={1} variant="captionBold1">
                            Name
                        </Text>
                        <Text mr={3} variant="captionBold1">
                            Points
                        </Text>
                    </Box>
                    {users?.map((user: any, idx: number) => (
                        <>
                            <Flex
                                key={idx}
                                alignItems="center"
                                columnGap={4}
                                mb={2}
                            >
                                <Text
                                    display={{ _: "none", a: "unset" }}
                                    ml={3}
                                    mr={6}
                                >
                                    {idx + 1}
                                </Text>
                                <Link
                                    href={`/profile/${
                                        user.user?.customUrl ??
                                        user.user?.address
                                    }`}
                                    passHref
                                >
                                    <Flex
                                        alignItems="center"
                                        rowGap={3}
                                        justifyContent="start"
                                        flexGrow={1}
                                    >
                                        <UserAvatar
                                            src={
                                                user.user?.profileImageUrl ?? ""
                                            }
                                            altText="user thumbnail"
                                            verifiedLevel={
                                                user.user?.verifiedLevel ||
                                                undefined
                                            }
                                            verified={user.user?.verified}
                                            size={48}
                                            verifiedSize={18}
                                        />
                                        <Text>{user.user?.name}</Text>
                                    </Flex>
                                </Link>
                                <Flex
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    mr={3}
                                >
                                    <Text>{user.count}</Text>
                                    <Text display={{ _: "unset", a: "none" }}>
                                        points
                                    </Text>
                                </Flex>
                            </Flex>
                            <Divider />
                        </>
                    ))}
                </Box>
            ) : (
                <Text textAlign="center" variant="body1" mt={4}>
                    No points was yet claimed in the current timeframe
                </Text>
            )}
            {showMoreButton &&
                data?.getRecepientCountForCollection.hasMore &&
                users?.length < 50 && (
                    <StyledLoadMore onClick={() => setPage(page + 1)} outline>
                        Load More
                    </StyledLoadMore>
                )}
        </Flex>
    );
}

const StyledButton = styled(Button)`
    border-radius: 0 !important;
    :first-child {
        border-radius: 15px 0 0 15px !important;
    }
    :last-child {
        border-radius: 0 15px 15px 0 !important;
    }
`;

const StyledLoadMore = styled(Button)`
    width: 300px;
    margin: 30px auto;
`;
