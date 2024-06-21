import React from "react";
import styled from "styled-components";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import { MissingTokens, SetCount, useDashBoard } from "../DashBoardProvider";
import DashboardGrid from "./Grid/DashboardGrid";

const { dark } = mixins;
const {
    colors: { neutrals, white },
    typography: { captionBold1 },
    breakpoints,
} = variables;

interface CardSetProps {
    name: string;
    count: SetCount;
    set: string;
    disabled?: boolean | undefined;
}

const CardSet: React.FC<CardSetProps> = ({ name, count, set, disabled }) => {
    const { missingTokens, genesisCountBySet } = useDashBoard();
    const [isOpen, setIsOpen] = React.useState(false);

    const getPercentage = React.useCallback(() => {
        if (typeof count.owned === "number" && typeof count.total === "number")
            return parseInt(((count.owned / count.total) * 100).toFixed());
        return 0;
    }, [count]);

    const isDisabled = React.useMemo(
        () => disabled || getPercentage() > 99,
        [disabled, getPercentage]
    );

    const formattedSet = React.useMemo(
        () =>
            (set.charAt(0).toLowerCase() +
                set.slice(1).replaceAll(" ", "")) as keyof MissingTokens,
        [set]
    );

    return (
        <Container disabled={isDisabled}>
            <InnerContainer
                onClick={isDisabled ? () => null : () => setIsOpen(!isOpen)}
            >
                <LeftInfo>
                    <SetName>
                        <p>{name}</p>
                    </SetName>
                    <SetQuantity>
                        <p>
                            {count.owned > count.total
                                ? count.total
                                : count.owned}
                            /{count.total}
                        </p>
                    </SetQuantity>
                </LeftInfo>
                <BarInfo>
                    <BarContainer percentage={getPercentage()}>
                        <BarValue percentage={getPercentage()}>
                            {getPercentage() < 100 ? (
                                <BarText>{getPercentage()}%</BarText>
                            ) : (
                                <BarCompleted>Ready to claim</BarCompleted>
                            )}
                        </BarValue>
                    </BarContainer>
                    {!isDisabled && (
                        <BarMessage>
                            See which cards are missing to complete the set and
                            unlock the special card <span>⌄</span>
                        </BarMessage>
                    )}
                </BarInfo>
            </InnerContainer>
            <DashboardGrid
                isOpen={isOpen}
                set={set}
                tokens={missingTokens[formattedSet]}
                count={genesisCountBySet[formattedSet]}
            />
        </Container>
    );
};

const Container = styled.div<{
    disabled: boolean | undefined;
}>`
    ${captionBold1}
    margin:  10px;
    border: 1px solid ${neutrals[6]};

    justify-content: space-between;
    color: ${white};
    cursor: ${({ disabled }) => (disabled ? "unset" : "pointer")};
`;

const InnerContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 30px 0;
    @media only screen and (max-width: ${breakpoints.t}) {
        flex-direction: column;
    }
`;

const LeftInfo = styled.div`
    margin-left: 20px;
    display: flex;
    width: 28%;
    position: relative;
    @media only screen and (max-width: ${breakpoints.t}) {
        width: 80%;
        margin: 20px 0;
    }
`;

const SetName = styled.div`
    height: 50px;
    background-color: ${neutrals[4]};
    width: 120px;
    border-radius: 15px 0 0 15px;
    p {
        text-align: center;
        padding-top: 15px;
    }
    @media only screen and (max-width: ${breakpoints.t}) {
        width: 60%;
    }
`;

const SetQuantity = styled("div")`
    height: 50px !important;
    border: 2px solid ${neutrals[5]} !important;
    width: 80px !important;
    background: ${({ theme }) => theme.colors.white};
    color: ${neutrals[3]} !important;
    border-radius: 0 15px 15px 0 !important;
    // left: 18px !important;
    z-index: 3 !important;
    top: 0 !important;
    position: relative !important;
    p {
        text-align: center;
        padding-top: 14px;
    }
    ${dark`
        color: ${neutrals[6]};
    `}
    @media only screen and (max-width: ${breakpoints.t}) {
        width: 40% !important;
    }
`;

const BarInfo = styled.div`
    width: 75%;
    height: 40px;
    @media only screen and (max-width: ${breakpoints.t}) {
        width: 80%;
    }
`;

const BarContainer = styled.div<{ percentage: number }>`
    width: 95%;
    border-radius: 25px;
    background-color: ${neutrals[6]};
    height: 37px;
    margin-bottom: 10px;
    ${dark`
        background-color: ${neutrals[4]};
    `}
    @media only screen and (max-width: ${breakpoints.t}) {
        width: 100%;
    }
    @media only screen and (max-width: ${breakpoints.m}) {
        display: ${({ percentage }) => (percentage < 100 ? "none" : "block")};
    }
`;

const BarValue = styled.div<{ percentage: number }>`
    width: ${({ percentage }) => (percentage > 8 ? `${percentage}%` : "8%")};
    border-radius: 25px;
    height: 37px;
    background: ${({ percentage }) =>
        percentage > 99
            ? "linear-gradient(90deg, rgba(43, 206, 166, 1) 0%, rgba(83, 192, 202, 1) 50%, rgba(255, 178, 0, 1) 100%)"
            : "linear-gradient(90deg, rgba(43, 206, 166, 1) 0%, rgba(83, 192, 202, 1) 100%)"};
    position: relative;
    transition: 3s;
    @media only screen and (max-width: ${breakpoints.f}) {
        width: ${({ percentage }) =>
            percentage > 12 ? `${percentage}%` : "12%"};
    }
`;

const BarText = styled.p`
    text-align: end;
    padding: 9px 20px 0 0;
    @media only screen and (max-width: ${breakpoints.m}) {
        display: none;
    }
`;

const BarCompleted = styled.p`
    text-align: center;
    padding-top: 9px;
`;

const BarMessage = styled.p`
    color: black;
    font-size: 13px;
    text-align: center;
    @media only screen and (min-width: ${breakpoints.m}) {
        margin-top: -15px;
    }
    ${dark`
        color: ${white};
    `}
    span {
        font-size: 25px;
    }
`;

export default CardSet;
