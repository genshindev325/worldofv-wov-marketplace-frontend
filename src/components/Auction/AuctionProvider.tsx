/* eslint-disable react-hooks/exhaustive-deps */
import useGraphQL from "@/hooks/useGraphQL";
import React, { useCallback } from "react";
import { Socket } from "socket.io-client";
import useSWR from "swr";
import { QueryGetAuctionHistory } from "../../graphql/get-auction-history.graphql";
import { QueryGetAuction } from "../../graphql/get-auction.graphql";
import useCountdown, { CountdownObject } from "../../hooks/useCountDown";
import { AuctionData, IAuctionData } from "../../types/AuctionData";
import { TokenData } from "../../types/TokenData";

interface AuctionContextProps {
    auction?: AuctionData;
    token?: TokenData;
    countdown: CountdownObject;
}

const AuctionContext = React.createContext<AuctionContextProps>({} as any);

const AuctionProvider: React.FC<React.PropsWithChildren<any>> = ({
    initialAuctionData,
    initialHistoryData,
    children,
}) => {
    const { timeLeftAsJSON, start } = useCountdown();
    const { client } = useGraphQL();

    const [ws, setSocket] = React.useState<Socket | undefined>();

    const [auction, setAuction] = React.useState<IAuctionData | any>(
        initialAuctionData.auction
    );

    const [history, setHistory] = React.useState<any[]>(
        initialHistoryData.history
    );

    const fetcher = useCallback(
        (query: string, variables: any) => client.request(query, variables),
        [client]
    );

    const { data: dataAuction, mutate: mutateAuction } = useSWR(
        [
            QueryGetAuction,
            {
                auctionId: auction.auctionId,
                includeToken: true,
                includeSeller: true,
            },
        ],
        fetcher,
        { fallbackData: initialAuctionData }
    );

    const { data: dataHistory, mutate: mutateHistory } = useSWR(
        [
            QueryGetAuctionHistory,
            {
                auctionId: auction.auctionId,
                bidsOnly: auction.status !== "SETTLED",
            },
        ],
        fetcher,
        { fallbackData: initialAuctionData }
    );

    const auctionData = React.useMemo(
        () => (auction ? new AuctionData(auction, history) : undefined),
        [auction, history]
    );

    React.useEffect(() => {
        if (auction) {
            start({ endTime: auction.endTime });

            /* if (!ws) {
                const socket = SocketIO("ws://localhost:3000/auction");
                setSocket(socket);
            } */
        }
    }, [auction]);

    React.useEffect(() => {
        if (ws) {
            const updateData = () => {
                mutateAuction();
                mutateHistory();
            };

            ws.on("connect", () => {
                ws.emit("join", { auctionId: auction.id });
            });

            ws.on("newBid", updateData);
            ws.on("auctionSettled", updateData);
            ws.on("timeUpdated", updateData);
            ws.on("cancelAuction", updateData);
            ws.on("auctionEnded", updateData);
        }

        return () => {
            if (ws?.connected) {
                ws.off("newBid");
                ws.off("auctionSettled");
                ws.off("timeUpdated");
                ws.off("cancelAuction");
                ws.off("auctionEnded");

                ws.disconnect();
            }
        };
    }, [ws]);

    React.useEffect(() => {
        if (dataAuction?.auction) {
            setAuction(dataAuction.auction);
        }
    }, [dataAuction?.auction]);

    React.useEffect(() => {
        if (dataHistory?.history) {
            setHistory(dataHistory.history);
        }
    }, [dataHistory?.history]);

    return (
        <AuctionContext.Provider
            value={{
                auction: auctionData,
                token: auctionData?.token,
                countdown: timeLeftAsJSON,
            }}
        >
            {children}
        </AuctionContext.Provider>
    );
};

export const useAuction = () => React.useContext(AuctionContext);

export default AuctionProvider;
