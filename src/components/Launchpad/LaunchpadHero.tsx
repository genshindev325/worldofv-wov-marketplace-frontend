import styled from "styled-components";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { media, dark } = mixins;
const { containerLarge } = common;

const {
    colors: { blue, neutrals },
    typography: { h3, h4, body2 },
} = variables;

const LaunchpadHero = () => (
    <Container>
        <Description>
            WoV Launchpad is the one-stop solution that allows artists and
            community builders to focus on what they do best: creating art.
        </Description>

        <Description>
            Our services include an extensive bundle of products that will
            remove the barriers of entry into the NFT space, providing technical
            and strategic support to ensure a successful launch.
        </Description>

        <Description>
            <i>
                <strong>
                    We&apos;re passionate about delivering innovative solutions
                    to fit your needs.
                </strong>
            </i>
        </Description>
    </Container>
);

const Container = styled.div`
    ${containerLarge};
`;

const Head = styled.div`
    background-image: url("/img/wov__header-launchpad.png");
    background-repeat: no-repeat;
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 263px;
    color: white;
    width: 1800px;
    margin-left: 0;
    margin: 0 auto 32px;
    text-align: center;
`;

const Title = styled.h3`
    ${h3};
    margin-bottom: 8px;

    strong {
        color: ${blue};
    }

    ${media.m`
        ${h4};
    `}
`;

const Description = styled.p`
    color: ${neutrals[4]};
    ${body2};
    text-align: center;
    margin-bottom: 20px;

    strong {
        font-weight: 500;
        color: ${neutrals[2]};

        ${dark`
            color: ${neutrals[8]};
        `}
    }
`;

export default LaunchpadHero;
