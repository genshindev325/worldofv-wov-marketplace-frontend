import _ from "lodash";
import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import AuctionHistoryItem from "./AuctionHistoryItem";
import { useAuction } from "./AuctionProvider";

const { dark, media } = mixins;
const {
    colors: { neutrals },
} = variables;

const AuctionHistory = () => {
    const { auction } = useAuction();

    const ref = React.useRef();

    const [showTopShadow, setShowTopShadow] = React.useState(false);
    const [showBottomShadow, setShowBottomShadow] = React.useState(false);

    const handleScroll = React.useCallback(
        (target: HTMLElement) => {
            const scrollY = target.scrollTop;
            const elementHeight = target.clientHeight;
            const scrollHeight = target.scrollHeight;

            if (scrollY + elementHeight < scrollHeight - 10) {
                if (!showBottomShadow) {
                    setShowBottomShadow(true);
                }
            } else if (showBottomShadow) {
                setShowBottomShadow(false);
            }

            if (scrollY > 0) {
                if (!showTopShadow) {
                    setShowTopShadow(true);
                }
            } else if (showTopShadow) {
                setShowTopShadow(false);
            }
        },
        [showBottomShadow, showTopShadow]
    );

    const scrollEvent = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLElement;
        handleScroll(target);
    };

    React.useEffect(() => {
        if (ref.current) {
            handleScroll(ref.current);
        }
    }, [handleScroll]);

    return (
        <Wrapper {...{ showTopShadow, showBottomShadow }}>
            <Container onScroll={scrollEvent} ref={ref as any}>
                {auction?.history?.length ? (
                    // For some reason, in some cases we get dup entries
                    // for the same txID. So we filter them out
                    _.uniqBy(auction.history, (item) => item.txID).map(
                        (item: any, i: number) => (
                            <AuctionHistoryItem
                                key={item.id + "_" + i}
                                {...{ auction, item }}
                            />
                        )
                    )
                ) : (
                    <NoBidsText>
                        No bids have been placed on this auction yet!
                    </NoBidsText>
                )}
            </Container>
        </Wrapper>
    );
};

const NoBidsText = styled.div`
    text-align: center;
`;

const Wrapper = styled.div<{
    showTopShadow: boolean;
    showBottomShadow: boolean;
}>`
    position: relative;
    display: flex;
    height: 100%;
    overflow-y: hidden;

    &::before,
    &::after {
        content: "";
        pointer-events: none;
        position: absolute;
        height: 30%;
        width: 100%;
        z-index: 1;
        opacity: 0;
        transition: all 0.2s;
    }

    &::before {
        top: 0;
        opacity: ${({ showTopShadow }) => (showTopShadow ? 1 : 0)};
        background: linear-gradient(
            180deg,
            ${neutrals[8]} 5%,
            ${neutrals[8]}00 100%
        );

        ${dark`
            background: linear-gradient(180deg, ${neutrals[1]} 5%, ${neutrals[1]}00 100%);
            `}
    }

    &::after {
        bottom: 0;
        opacity: ${({ showBottomShadow }) => (showBottomShadow ? 1 : 0)};
        background: linear-gradient(
            180deg,
            ${neutrals[8]}00 0%,
            ${neutrals[8]} 95%
        );

        ${dark`
            background: linear-gradient(180deg, ${neutrals[1]}00 0%, ${neutrals[1]} 95%);
        `}
    }

    ${media.t`
       min-height: 400px;
    `}
`;

const Container = styled.div`
    overflow-y: auto;
    padding-top: 16px;
    width: 100%;

    ${media.t`
        max-height: 400px;
    `}
`;

export default AuctionHistory;
