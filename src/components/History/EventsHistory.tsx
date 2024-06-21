import React, { Context } from "react";
import styled from "styled-components";
import useActivityQuery from "../../hooks/useActivityQuery";
import FlatLoader from "../FlatLoader";
import SingleEvent from "./SingleEvent";

interface EventsHistoryProps {
    context: Context<any>;
    route: string;
}

const EventsHistory: React.FC<EventsHistoryProps> = ({ context, route }) => {
    const { events, hasMore, page, setPage, isValidating, address } =
        useActivityQuery(route, context);
    return (
        <Container>
            <TableHeader>
                <Column className="event">Event</Column>
                <Column className="token">Token</Column>
                <Column className="from-to">From/To</Column>
                <Column className="value">Value</Column>
                <Column className="time">Time</Column>
            </TableHeader>
            {events?.map((event, idx) => (
                <SingleEvent
                    event={{ ...event, address }}
                    key={`${event.dateTime}_${idx}`}
                />
            ))}

            {isValidating && (
                <LoadMore>
                    <FlatLoader size={24} />
                </LoadMore>
            )}
            {hasMore && (
                <LoadMore
                    onClick={() => {
                        setPage(page + 1);
                    }}
                >
                    Load More
                </LoadMore>
            )}
        </Container>
    );
};

const Container = styled.section`
    position: relative;
    .time {
        width: 12%;
    }
    .event,
    .from-to {
        width: 16%;
    }
    .token {
        width: 31%;
    }
    .value {
        width: 25%;
    }
    .from-to {
        text-align: center;
    }
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.a}) {
        .time {
            width: 20%;
        }
        .value,
        .from-to {
            display: none;
        }
        .event {
            width: 10%;
        }
        .token {
            width: 60%;
        }
    }
`;

const TableHeader = styled.div`
    display: flex;
    height: 30px;
    align-items: center;

    ${({ theme }) => theme.typography.hairline2}
    border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.a}) {
        display: none;
    }
`;

const Column = styled.p`
    padding-left: 10px;
    color: ${({ theme }) => theme.colors.neutral};
`;

const LoadMore = styled.div`
    cursor: pointer;
    text-align: center;
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.muted};
    border-radius: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 235px;
    margin: 20px auto;
`;

export default EventsHistory;
