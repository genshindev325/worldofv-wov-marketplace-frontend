import { useContext, useMemo } from "react";
import styled from "styled-components";
import variables from "../../styles/_variables";
import { BurnMintingContext } from "./BurnMintingContext";

const { colors, typography, breakpoints } = variables;
const { neutrals } = colors;

export default function BurnMintingTokensLeft() {
    const { collectionInfo: info } = useContext(BurnMintingContext);

    const progress = useMemo(
        () =>
            info
                ? ((info.totalCount - info.mintedCount) / info.totalCount) * 100
                : 100,
        [info]
    );

    return (
        <Container>
            <ProgressContainer>
                <ProgressBar progress={progress} />
            </ProgressContainer>

            <Description>
                {!info ? (
                    <>Loading...</>
                ) : info.totalCount <= info.mintedCount ? (
                    <>The event is over.</>
                ) : (
                    <>
                        Only{" "}
                        <strong>{info.totalCount - info.mintedCount}</strong>{" "}
                        NFTs left!
                    </>
                )}
            </Description>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: ${breakpoints.m};
`;

const Description = styled.p`
    ${typography.caption1}
    text-align: center;
    margin-top: 4px;
`;

const ProgressContainer = styled.div`
    border: 2px solid ${neutrals[4]};
    width: 100%;
    height: 32px;
    border-radius: 16px;
    display: flex;
    align-items: center;
`;

const ProgressBar = styled.div<{ progress: number }>`
    height: 20px;
    width: ${(props) => props.progress + "%"};
    transition: width 1s ease-in-out;
    border-radius: ${({ theme }) => theme.radii[3]}px;
    margin-inline: 4px;
    background-color: ${colors.blue};
`;
