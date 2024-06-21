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

const LaunchpadHeader = () => (
    <Container>
        <Head>
            <Title>World of V Launchpad: Create, Deploy, Launch!</Title>
        </Head>
    </Container>
);

const Container = styled.div`
    position: relative;
    height: 263px;
    margin-bottom: 55px;
    padding: 0;
`;

const Head = styled.div`
    background-image: url("/img/wov__header-launchpad.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    color: #ffffff;
`;

const Title = styled.h3`
    ${h3};
    margin-bottom: 8px;
    text-align: center;
    text-shadow: 1px 6px 10px black;
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

export default LaunchpadHeader;
