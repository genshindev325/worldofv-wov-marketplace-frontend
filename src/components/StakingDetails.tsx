import { useMemo } from "react";
import styled from "styled-components";
import { StakingInfo } from "../components/ConnexProvider";
import variables from "../styles/_variables";
import formatDuration from "../utils/formatDuration";
import { Alert } from "./common/Alert";
import Icon from "./Icon";

const { colors, typography } = variables;
const { neutrals } = colors;

export default function StakingDetails(stakingInfo: StakingInfo) {
    const hasStarted = useMemo(
        () => stakingInfo.periodFinish >= Date.now() / 1000,
        [stakingInfo]
    );

    const minStakeDuration = useMemo(() => {
        const poolDuration = stakingInfo.periodFinish * 1000 - Date.now();
        const minimumDuration = stakingInfo.minimumDuration * 1000;
        const duration = Math.min(minimumDuration, poolDuration);
        return formatDuration(duration);
    }, [stakingInfo]);

    if (!hasStarted) {
        return (
            <Alert
                variant="warn"
                title="The staking pool is not open yet"
                text="You'll be able to stake once it goes live"
            />
        );
    }

    return (
        <StakingDetailsContainer>
            <StakingDetailsTitle>
                <Icon icon="info-circle" size={18} color={colors.blue} />
                <span>Staking Pool Details</span>
            </StakingDetailsTitle>
            <table>
                <tr>
                    <StakingDetailsLabel>Soft lock period</StakingDetailsLabel>
                    <StakingDetailsValue>
                        {minStakeDuration}
                    </StakingDetailsValue>
                </tr>
            </table>
            <StakingDetailsCaption>
                <p>
                    Unstaking before the end of the soft lock period will result
                    in a loss of rewards.
                </p>
                <p>All listed NFTs will be automatically unlisted.</p>
            </StakingDetailsCaption>
        </StakingDetailsContainer>
    );
}

const StakingDetailsContainer = styled.div``;

const StakingDetailsTitle = styled.p`
    ${typography.body1}
    display: flex;
    align-items: baseline;
    margin-bottom: 8px;
    font-size: 1.3em;

    > * + * {
        margin-left: 8px;
    }
`;

const StakingDetailsLabel = styled.td`
    ${typography.body2}
    color: ${neutrals[4]}
`;

const StakingDetailsValue = styled.td`
    ${typography.bodyBold2}
    text-align: right;
    padding-top: 8px;
`;

const StakingDetailsCaption = styled.div`
    ${typography.caption1}
    color: ${neutrals[4]};
    padding-top: 16px;
    font-style: oblique;

    > * + * {
        margin-top: 4px;
    }
`;
