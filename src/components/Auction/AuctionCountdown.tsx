import moment from "moment";
import React from "react";
import styled from "styled-components";
import variables from "../../styles/_variables";
import { useAuction } from "./AuctionProvider";

const {
    colors: { neutrals },
    typography: { bodyBold1, captionBold1, hairline2 },
} = variables;

// TODO: Refactor using react-countdown component
const AuctionCountdown: React.FC = () => {
    const { auction, countdown } = useAuction();

    if (!auction || !countdown) {
        return null;
    }

    return (
        <CountdownContainer>
            <CountdownLabel>
                {auction.ended ? "Ended at" : "Ends in"}
            </CountdownLabel>

            {auction.ended ? (
                <Countdown>
                    <CountdownValue>
                        {moment(
                            auction.updatedEndDate || auction.endDate
                        ).format("LLL")}
                    </CountdownValue>
                </Countdown>
            ) : (
                <Countdown>
                    {countdown.days ? (
                        <CountdownValue>
                            <CountdownNumber>{countdown.days}</CountdownNumber>d
                        </CountdownValue>
                    ) : null}

                    <CountdownValue>
                        <CountdownNumber>{countdown.hours}</CountdownNumber>h
                    </CountdownValue>

                    <CountdownValue>
                        <CountdownNumber>
                            {countdown.minutes.toString().padStart(2, "0")}
                        </CountdownNumber>
                        m
                    </CountdownValue>

                    <CountdownValue>
                        <CountdownNumber>
                            {countdown.seconds.toString().padStart(2, "0")}
                        </CountdownNumber>
                        s
                    </CountdownValue>
                </Countdown>
            )}
        </CountdownContainer>
    );
};

const CountdownContainer = styled.div``;

const CountdownLabel = styled.div`
    ${hairline2};
    color: ${neutrals[5]};
    margin-bottom: 4px;
`;

const Countdown = styled.div`
    display: flex;

    > *:not(:first-child) {
        margin-left: 8px;
    }
`;

const CountdownValue = styled.div`
    display: flex;
    align-items: flex-end;
    ${captionBold1};
`;

const CountdownNumber = styled.div`
    ${bodyBold1};
`;

export default AuctionCountdown;
