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

const AboutHero = () => (
    <Container>
        <Head>
            <Title>What is World of V?</Title>
        </Head>

        <Description>
            World of V is the zero-fee, green NFT marketplace built on the
            VeChain blockchain that aims to build a safe, entertaining space for
            digital creators and art enthusiasts across the world. We strongly
            believe in the power of a community-driven, inclusive movement
            committed to shape a culture where{" "}
            <strong>environmental sustainability and accessibility</strong> are
            core principles.
        </Description>

        <Description>
            Our goal is to empower artists and collectors through a
            state-of-the-art platform, providing all the necessary tools for a
            seamless, fun experience. Forget about expensive fees and long
            minting times: creating and collecting art on World of V is fast,
            affordable and secure.
        </Description>
    </Container>
);

const Container = styled.div`
    ${containerLarge};
`;

const Head = styled.div`
    max-width: 800px;
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

export default AboutHero;
