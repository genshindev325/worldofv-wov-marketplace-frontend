import useGraphQL from "@/hooks/useGraphQL";
import { userAddressSelector } from "@/store/selectors";
import BigNumber from "bignumber.js";
import React, { useCallback } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import {
    QueryGetGenesisBySet,
    QueryGetGenesisTotal,
    QueryGetMissingTokens,
    QueryGetStakingRewards,
} from "../../graphql/get-dashboard-info.graphql";
import { useConnex } from "../ConnexProvider";

export interface SetCount {
    total: number | string;
    owned: number | string;
}

interface GenesisCount {
    whale: SetCount;
    africa: SetCount;
    flower: SetCount;
    olympic: SetCount;
    moon: SetCount;
    worldCup: SetCount;
}
export interface Media {
    url: string;
}

export interface MissingToken {
    name: string;
    country: string;
    media: Media[];
    collectionName: string;
    collectionThumbnail: string;
    collectionCustomUrl: string;
}

interface MetaData {
    total: number;
    hasMore: boolean;
}

interface MissingTokensBySet {
    tokens: MissingToken[] | null;
    meta: MetaData | null;
}

export interface MissingTokens {
    whale: MissingTokensBySet | null;
    africa: MissingTokensBySet | null;
    flower: MissingTokensBySet | null;
    olympic: MissingTokensBySet | null;
    moon: MissingTokensBySet | null;
    worldCup: MissingTokensBySet | null;
}

interface DashBardContextProps {
    genesisCountBySet: GenesisCount;
    totalGenesis: number;
    totalGenSpecial: number;
    earnedWoV: BigNumber;
    dailyRewards: BigNumber;
    missingTokens: MissingTokens;
    selected: any; //TODO fix
    setSelected: (any: any) => void; //TODO fix
    page: number;
    setPage: (page: number) => void;
}

const DashboardContext = React.createContext<DashBardContextProps>({} as any);

const DashboardProvider: React.FC<React.PropsWithChildren<any>> = ({
    children,
}) => {
    const userAddress = useRecoilValue(userAddressSelector);
    const { getUserStakingInfo } = useConnex();

    const fetchEarnedWei = useCallback(
        async (contractAddresses: string[], userAddress: string) => {
            const stakingInfo = await Promise.all(
                contractAddresses.map((address) =>
                    getUserStakingInfo(address, userAddress)
                )
            );
            return stakingInfo.reduce(
                (earned, info) => earned.plus(info.earned),
                new BigNumber(0)
            );
        },
        [getUserStakingInfo]
    );

    const { client } = useGraphQL();

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data: earnedWei } = useSWR(
        [
            [
                "0x8639b5F52F0093789F2E0F5BD2d6b9F58e8b0EFB",
                "0xFAbcE34bb0b1174f1e0127d69bb705C60c35e587",
            ],
            userAddress,
            "STAKING_EARNED",
        ],
        fetchEarnedWei,
        { refreshInterval: 10000 }
    );

    const { data: genesisCountRes } = useSWR(
        [
            QueryGetGenesisBySet,
            {
                ownerAddress: userAddress,
            },
        ],
        fetcher
    );

    const { data: genesisTotalRes } = useSWR(
        [
            QueryGetGenesisTotal,
            {
                ownerAddress: userAddress,
                smartContractAddress:
                    process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS,
            },
        ],
        fetcher
    );

    const { data: genSpecialTotalRes } = useSWR(
        [
            QueryGetGenesisTotal,
            {
                ownerAddress: userAddress,
                smartContractAddress:
                    process.env.NEXT_PUBLIC_GENESIS_SPECIAL_CONTRACT_ADDRESS,
            },
        ],
        fetcher
    );

    const { data: stakingRewardsGenesisRes } = useSWR(
        [
            QueryGetStakingRewards,
            {
                ownerAddress: userAddress,
                smartContractAddress:
                    "0x93Ae8aab337E58A6978E166f8132F59652cA6C56",
            },
        ],
        fetcher
    );

    const { data: stakingRewardsGenSpecialRes } = useSWR(
        [
            QueryGetStakingRewards,
            {
                ownerAddress: userAddress,
                smartContractAddress:
                    "0x9aaB6e4e017964ec7C0F092d431c314F0CAF6B4B",
            },
        ],
        fetcher
    );

    const formattedGenesisCount = React.useMemo(() => {
        const formattedGenesisCount = {
            whale: { total: 200, owned: 0 },
            africa: { total: 54, owned: 0 },
            flower: { total: 36, owned: 0 },
            olympic: { total: 22, owned: 0 },
            moon: { total: 3, owned: 0 },
            worldCup: { total: 8, owned: 0 },
        };
        if (genesisCountRes && genesisCountRes.getGenesisCountBySet) {
            genesisCountRes.getGenesisCountBySet.forEach(
                (count: { set: string; count: number }) => {
                    const key =
                        count.set.charAt(0).toLowerCase() +
                        count.set.slice(1).replaceAll(" ", "");
                    formattedGenesisCount[key as keyof GenesisCount].owned =
                        count.count;
                }
            );
        }
        return formattedGenesisCount;
    }, [genesisCountRes]);

    const earnedWoV = React.useMemo(() => {
        if (earnedWei) return new BigNumber(earnedWei!);
        return new BigNumber(0);
    }, [earnedWei]);

    const dailyRewards = React.useMemo(() => {
        let dailyRewards = new BigNumber(0);
        if (
            stakingRewardsGenesisRes &&
            stakingRewardsGenesisRes.getGenerationRateForUser
        ) {
            dailyRewards = dailyRewards.plus(
                new BigNumber(stakingRewardsGenesisRes.getGenerationRateForUser)
            );
        }
        if (
            stakingRewardsGenSpecialRes &&
            stakingRewardsGenSpecialRes.getGenerationRateForUser
        ) {
            dailyRewards = dailyRewards.plus(
                new BigNumber(
                    stakingRewardsGenSpecialRes.getGenerationRateForUser
                )
            );
        }
        return dailyRewards;
    }, [stakingRewardsGenesisRes, stakingRewardsGenSpecialRes]);

    const [selected, setSelected] = React.useState({
        selectedSet: "",
        page: 1,
    });
    const [page, setPage] = React.useState(1);
    const { data: missingTokensRes } = useSWR(
        selected.selectedSet
            ? [
                  QueryGetMissingTokens,
                  {
                      ownerAddress: userAddress,
                      set: selected.selectedSet,
                      pagination: { page: selected.page, perPage: 6 },
                  },
              ]
            : null,
        fetcher
    );

    const formattedSet = React.useMemo(
        () =>
            (selected.selectedSet.charAt(0).toLowerCase() +
                selected.selectedSet
                    .slice(1)
                    .replaceAll(" ", "")) as keyof MissingTokens,
        [selected.selectedSet]
    );

    const missingTokens = React.useMemo(
        () => ({
            whale: null,
            africa: null,
            flower: null,
            olympic: null,
            moon: null,
            worldCup: null,
        }),
        []
    );

    React.useEffect(() => {
        if (missingTokensRes) {
            missingTokens[formattedSet] = missingTokensRes.getMissingTokens;
            setSelected({ selectedSet: "", page: 1 });
        }
    }, [formattedSet, missingTokensRes, missingTokens, selected]);

    return (
        <DashboardContext.Provider
            value={{
                genesisCountBySet: formattedGenesisCount,
                totalGenesis: genesisTotalRes
                    ? genesisTotalRes.getOwnedCountByCollection
                    : 0,
                totalGenSpecial: genSpecialTotalRes
                    ? genSpecialTotalRes.getOwnedCountByCollection
                    : 0,
                earnedWoV,
                dailyRewards,
                missingTokens,
                selected,
                setSelected,
                page,
                setPage,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashBoard = () => React.useContext(DashboardContext);

export default DashboardProvider;
