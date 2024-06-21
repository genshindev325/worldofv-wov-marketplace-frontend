import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { dark, media } = mixins;
const { colors, typography, breakpoints } = variables;
const { neutrals } = colors;

export default function BurnMintingRequirements() {
    return (
        <Container>
            <Title>Requirements</Title>
            <p>
                To get a Nemesis, you need to have a Psycho Beasts NFT to burn.
            </p>
        </Container>
    );
}

const Container = styled.div`
    ${typography.caption1}
    display: flex;
    flex-direction: column;
    border: 2px solid ${neutrals[6]};
    border-radius: ${({ theme }) => theme.radii[3]}px;
    padding: 16px;
    width: 100%;
    max-width: ${breakpoints.f};

    > * + * {
        margin-top: 8px;
    }

    ${dark`
        border-color: ${neutrals[3]};
        color: ${neutrals[7]}
    `}

    text-align: center;
`;

const Title = styled.h4`
    ${typography.body1}
    text-align: center;
`;
