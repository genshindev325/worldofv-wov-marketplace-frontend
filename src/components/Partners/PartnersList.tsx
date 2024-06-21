import styled from "styled-components";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import calculateCardSize from "../../utils/calculateCardSize";
import InfoCard from "../InfoCard";

const { containerLarge } = common;
const { media, dark } = mixins;

const {
    colors: { neutrals },
    typography: { h3, h4, body1, body2 },
} = variables;

const partners = [
    {
        title: "Mad ⓥ-Apes",
        description:
            "Mad Ⓥ-Apes is an NFT collection comprised of 9,999 mad apes! These apex predators were looking for an environment free of contamination, and they found the best one imaginable here in the VeChain metaverse.",
        image: "/img/mva-logo.jpg",
        link: "https://mvanft.io",
    },
    {
        title: "Safe Haven",
        description:
            "Safe Haven is building DeFi solutions for safely managing, storing and transferring your crypto or other digital assets like NFTs, passwords, pictures and documents. Safe Haven’s solutions include decentralized inheritance, masternode solutions, wallets and pooling services.",
        image: "/img/safehaven-logo.jpg",
        link: "https://safehaven.io",
    },
    {
        title: "Laava",
        description:
            "Laava helps brands tell trusted stories and turn their products into connected products, with our patented Smart Fingerprint technology® – the world’s first secure and globally scalable alternative to QR codes.",
        image: "/img/logo__laava.png",
        link: "https://laava.id/",
    },
    {
        title: "vechain.energy",
        description:
            "vechain.energy helps unlock the full potential of blockchain technology with seamless integrations of blockchain into existing development environments eliminating the complexity of blockchain and web3, so you can focus on delivering innovative solutions.",
        image: "/img/logo__vechain-energy.jpg",
        link: "https://vechain.energy/",
    },
    {
        title: "Authentic8",
        description:
            "Preserving brand integrity with authenticity solutions backed by the blockchain.",
        image: "/img/logo__authentic8-logo.jpg",
        link: "https://www.authentic8.tech/",
    },
    {
        title: "EXPlus",
        description:
            "Collect digital works, exclusive memorabilia and live unique experiences with your favorite celebrities.",
        image: "/img/logo__explus.jpg",
        link: "https://www.explus.tech/",
    },
];

const PartnersList = () => (
    <Container>
        <Head>
            <Title>Our partners</Title>
        </Head>

        <Description>
            We&#8216;ve established partnerships with projects and entities
            committed to building steadily and creating lasting value in the NFT
            space.
        </Description>

        <Grid>
            {partners.map((props) => (
                <InfoCard key={props.title} {...props} />
            ))}
        </Grid>
    </Container>
);

const Container = styled.div`
    ${containerLarge};
    margin: 64px auto 16px;
    position: relative;

    .swiper-wrapper {
        padding: 16px 0;
    }
`;

const Head = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 32px;
`;

const Title = styled.h2`
    ${h3};

    ${media.m`
        ${h4};
    `}

    ${media.s`
        ${body1};
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

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;

    > * {
        ${calculateCardSize(3, 24)};
        margin: 24px 12px 0;

        ${media.z`
            ${calculateCardSize(3, 24)};
            `}

        ${media.d`
            ${calculateCardSize(3, 24)};
        `}

        ${media.f`
            ${calculateCardSize(1, 24)};
        `}

        ${media.p`
            ${calculateCardSize(1, 24)};
        `}
    }
`;

export default PartnersList;
