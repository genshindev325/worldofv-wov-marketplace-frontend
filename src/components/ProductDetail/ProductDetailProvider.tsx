import useGraphQL from "@/hooks/useGraphQL";
import usePriceConversion from "@/hooks/usePriceConversion";
import { userAddressSelector } from "@/store/selectors";
import React, { useCallback } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { GetCollectionStatsQueryResult } from "../../generated/graphql";
import { QueryGetEditions } from "../../graphql/get-editions.graphql";
import { QueryGetOffersForToken } from "../../graphql/get-offers.graphql";
import { QueryGetTokenActivity } from "../../graphql/get-token-activity.graphql";
import { QueryGetToken } from "../../graphql/get-token.graphql";
import { EditionData } from "../../types/EditionData";
import { TokenData } from "../../types/TokenData";
import { isSameAddress } from "../../utils/isSameAddress";
import { Event } from "../History/SingleEvent";

interface ProductDetailContextProps {
    token: TokenData;
    selectedEdition: EditionData;
    setSelectedEdition: React.Dispatch<React.SetStateAction<EditionData>>;
    mutateToken: Function;
    mutateEditions: Function;
    mutateOffers: Function;
    collectionStats: GetCollectionStatsQueryResult["stats"];
    events: any;
}

const ProductDetailContext = React.createContext<ProductDetailContextProps>(
    {} as any
);

const ProductDetailProvider: React.FC<React.PropsWithChildren<any>> = ({
    children,
    initialTokenData,
    initialEditionsData,
    initialEdition,
    collectionStats,
}) => {
    const userAddress = useRecoilValue(userAddressSelector);
    const tokenId = initialTokenData?.token.tokenId;
    const smartContractAddress = initialTokenData?.token?.smartContractAddress;
    const priceConversion = usePriceConversion();

    const [selectedEdition, setSelectedEdition] = React.useState<
        EditionData | undefined
    >();

    const [timeStamp, setTimeStamp] = React.useState<string | null>(null);
    const [events, setEvents] = React.useState<Event[]>([]);
    const [page, setPage] = React.useState(1);

    const { client } = useGraphQL();

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data: tokenRes, mutate: mutateToken } = useSWR(
        tokenId && smartContractAddress
            ? [QueryGetToken, { tokenId, smartContractAddress }]
            : null,
        fetcher,
        { fallbackData: initialTokenData }
    );

    const { data: editionsRes, mutate: mutateEditions } = useSWR(
        tokenId && smartContractAddress
            ? [QueryGetEditions, { tokenId, smartContractAddress }]
            : null,
        fetcher,
        { fallbackData: initialEditionsData }
    );

    const { data: offersRes, mutate: mutateOffers } = useSWR(
        tokenId && smartContractAddress
            ? [
                  QueryGetOffersForToken,
                  {
                      tokenId,
                      smartContractAddress,
                      acceptorAddress: userAddress,
                  },
              ]
            : null,
        fetcher
    );

    const tokenData = React.useMemo(
        () =>
            tokenRes?.token
                ? new TokenData({
                      tokenData: tokenRes?.token,
                      editionsData: editionsRes?.editions?.items,
                      offersData: offersRes?.getOffersForToken,
                  })
                : null,
        [tokenRes, editionsRes, offersRes]
    );

    const { data: eventsRes, isValidating } = useSWR(
        selectedEdition && smartContractAddress
            ? [
                  QueryGetTokenActivity,
                  {
                      address: smartContractAddress,
                      tokenId: selectedEdition.id,
                      page,
                      perPage: 10,
                      dateTime: timeStamp,
                  },
              ]
            : null,
        fetcher
    );

    const hasMore = React.useMemo(
        () => eventsRes?.getTokenActivity?.hasMore ?? false,
        [eventsRes]
    );

    React.useEffect(() => {
        if (page === 2) setTimeStamp(events[0].dateTime);
    }, [events, page]);

    React.useEffect(() => {
        if (eventsRes?.getTokenActivity) {
            const eventsTemp = eventsRes?.getTokenActivity?.events;
            if (page === 1) {
                setEvents(eventsTemp);
            } else {
                setEvents([...events, ...eventsTemp]);
            }
        }
    }, [eventsRes]);

    React.useEffect(() => {
        if (tokenData && priceConversion) {
            const ownedEdition = tokenData.editions.find((el) =>
                isSameAddress(el.owner.address, userAddress)
            );
            if (selectedEdition) {
                setSelectedEdition(
                    (prev) =>
                        tokenData.editions.find((el) => el.id === prev?.id) ||
                        tokenData.editions?.[0] ||
                        prev
                );
            } else {
                if (initialEdition) {
                    setSelectedEdition(
                        tokenData.editions.find(
                            (el) => el.id === initialEdition
                        )
                    );
                } else if (ownedEdition) {
                    setSelectedEdition(ownedEdition);
                } else if (tokenData.getFloorPriceEdition(priceConversion)) {
                    setSelectedEdition(
                        tokenData.getFloorPriceEdition(priceConversion)
                    );
                } else {
                    setSelectedEdition(undefined);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenData, priceConversion]);

    return (
        <ProductDetailContext.Provider
            value={
                {
                    token: tokenData,
                    selectedEdition,
                    setSelectedEdition,
                    mutateToken,
                    mutateEditions,
                    mutateOffers,
                    collectionStats,
                    events: {
                        data: events,
                        meta: {
                            hasMore,
                            page,
                            setPage,
                            isValidating,
                        },
                    },
                } as any
            }
        >
            {children}
        </ProductDetailContext.Provider>
    );
};

export const useItem = () => React.useContext(ProductDetailContext);

export default ProductDetailProvider;
