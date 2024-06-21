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

const PartnersHero = () => (
    <Container>
        <Head>
            <Title>
                Welcome to World of V, the first green, zero-fee NFT marketplace
                built on the VeChain blockchain
            </Title>
        </Head>

        <Description>
            World of V&#8216;s is the cutting-edge platform that empowers
            artists & collectors to buy and sell NFTs, fostering creative
            collaboration and generating value in an impactful and sustainable
            way.
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

export default PartnersHero;
