import usePriceConversion from "@/hooks/usePriceConversion";
import React from "react";
import styled from "styled-components";
import variables from "../../../styles/_variables";
import formatPrice from "../../../utils/formatPrice";
import { Tooltip } from "../../common/Tooltip";
import { useDashBoard } from "../DashBoardProvider";

const {
    colors: { neutrals },
    typography: { bodyBold2, bodyBold1 },
    breakpoints,
} = variables;

const DashboardEstimadedGen: React.FC = () => {
    const { dailyRewards } = useDashBoard();
    const priceConversion = usePriceConversion();

    const estimatedGeneration = React.useMemo(() => {
        if (priceConversion) {
            const conversionRateWoVToVET =
                priceConversion?.WoV / priceConversion?.VET;
            const montlyRewardsWoV = dailyRewards.multipliedBy(30);
            const annualRewardsWoV = dailyRewards.multipliedBy(365);
            const dailyRewardsVET = dailyRewards.multipliedBy(
                conversionRateWoVToVET
            );
            const montlyRewardsVET = montlyRewardsWoV.multipliedBy(
                conversionRateWoVToVET
            );
            const annualRewardsVET = annualRewardsWoV.multipliedBy(
                conversionRateWoVToVET
            );
            const rewards = {
                dailyRewards: {
                    WoV: formatPrice(dailyRewards),
                    VET: formatPrice(dailyRewardsVET),
                },
                montlyRewards: {
                    WoV: formatPrice(montlyRewardsWoV),
                    VET: formatPrice(montlyRewardsVET),
                },
                annualRewards: {
                    WoV: formatPrice(annualRewardsWoV),
                    VET: formatPrice(annualRewardsVET),
                },
            };
            return rewards;
        }
    }, [dailyRewards, priceConversion]);

    return (
        <Container>
            <Tooltip content="The Estimated Generation accounts for all Genesis and Special Cards in your wallet, either staked or unstaked.">
                <Title>Estimated Generation</Title>
            </Tooltip>
            <InnerContainer>
                <TimeColumn>
                    <Time>Per day</Time>
                    <Time>Per month</Time>
                    <Time>Per year</Time>
                </TimeColumn>

                {estimatedGeneration && (
                    <AmountColumn>
                        <AmountContainer>
                            <AmountWoV>
                                {estimatedGeneration!.dailyRewards.WoV} WoV
                            </AmountWoV>
                            <AmountVET>
                                {estimatedGeneration!.dailyRewards.VET} VET
                            </AmountVET>
                        </AmountContainer>
                        <AmountContainer>
                            <AmountWoV>
                                {estimatedGeneration!.montlyRewards.WoV} WoV
                            </AmountWoV>
                            <AmountVET>
                                {estimatedGeneration!.montlyRewards.VET} VET
                            </AmountVET>
                        </AmountContainer>
                        <AmountContainer>
                            <AmountWoV>
                                {estimatedGeneration!.annualRewards.WoV} WoV
                            </AmountWoV>
                            <AmountVET>
                                {estimatedGeneration!.annualRewards.VET} VET
                            </AmountVET>
                        </AmountContainer>
                    </AmountColumn>
                )}
            </InnerContainer>
        </Container>
    );
};

// TODO: refactor using responsice props from Box, Flex and Text comps
const Container = styled.div`
    padding: 95px;
    @media only screen and (max-width: ${breakpoints.x}) {
        width: 600px;
    }
    @media only screen and (max-width: ${breakpoints.t}) {
        padding: 30px;
    }
    @media only screen and (max-width: ${breakpoints.a}) {
        width: 350px;
    }
`;

const Title = styled.div`
    ${bodyBold1}
    @media only screen and (max-width: ${breakpoints.t}) {
        text-align: center;
    }
    @media only screen and (max-width: ${breakpoints.a}) {
        font-size: 20px;
    }
`;

const InnerContainer = styled.div`
    display: flex;
    @media only screen and (max-width: ${breakpoints.t}) {
        justify-content: center;
        align-items: center;
    }
`;

const TimeColumn = styled.div`
    width: 150px;
`;

const AmountColumn = styled.div``;

const Time = styled.p`
    font-size: 20px;
    color: ${neutrals[4]};
    padding-top: ${({ theme }) => theme.space[2]}px;
    @media only screen and (max-width: ${breakpoints.a}) {
        font-size: 14px;
    }
`;

const AmountContainer = styled.div`
    display: flex;
    align-items: baseline;
    padding-top: 16px;
`;

const AmountWoV = styled.p`
    ${bodyBold2}
    font-size: 18px;
    white-space: nowrap;
    @media only screen and (max-width: ${breakpoints.a}) {
        font-size: 12px;
    }
`;

const AmountVET = styled.p`
    padding-left: 10px;
    color: ${neutrals[4]};
    white-space: nowrap;
`;

export default DashboardEstimadedGen;
