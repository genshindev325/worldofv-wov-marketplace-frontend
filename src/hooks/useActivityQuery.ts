import useGraphQL from "@/hooks/useGraphQL";
import {
    Context,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import useSWR from "swr";
import { Event } from "../components/History/SingleEvent";
import { QueryGetCollectionActivity } from "../graphql/get-collection-activity.graphql";
import { QueryGetUserActivity } from "../graphql/get-user-activity.graphql";

const useActivityQuery = (route: string, context: Context<any>) => {
    const [timeStamp, setTimeStamp] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);

    const currentContext = useContext(context);
    const page = currentContext.page;
    const setPage = currentContext.setPage;

    const address =
        currentContext.collection?.smartContractAddress ??
        currentContext.user?.address;
    let query = useMemo(() => {
        switch (route) {
            case "profile":
                return QueryGetUserActivity;
            case "collection":
                return QueryGetCollectionActivity;
            default:
                return null;
        }
    }, [route]);

    const { client } = useGraphQL();

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data, isValidating } = useSWR(
        [
            query,
            {
                address,
                page,
                perPage: 10,
                dateTime: timeStamp,
            },
        ],
        fetcher
    );

    const hasMore = useMemo(
        () =>
            data?.getUserActivity?.hasMore ??
            data?.getCollectionActivity?.hasMore ??
            false,
        [data]
    );

    useEffect(() => {
        if (page === 2 && events?.length > 0) {
            setTimeStamp(events[0].dateTime);
        }
    }, [events, page]);

    useEffect(() => {
        if (data?.getUserActivity || data?.getCollectionActivity) {
            const response = data.getUserActivity ?? data.getCollectionActivity;
            const eventsTemp = response.events;
            if (page === 1) {
                setEvents(eventsTemp);
            } else {
                setEvents([...events, ...eventsTemp]);
            }
        }
    }, [data]);

    return {
        events,
        hasMore,
        page,
        setPage,
        isValidating,
        address,
    };
};

export default useActivityQuery;
