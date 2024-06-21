import styled from "styled-components";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import calculateCardSize from "../../utils/calculateCardSize";
import InfoCard from "../InfoCard";

const { containerLarge } = common;
const { media, dark } = mixins;

const {
    colors: { neutrals, blue },
    typography: { h3, h4, body1, body2 },
} = variables;

const reasonsWhy = [
    {
        icon: "minting-support",
        title: "Minting Support",
        description:
            "We provide full technical support before and throughout the mint to ensure a seamless experience for collectors, along with a custom minting page and dApp.",
    },
    {
        icon: "strategy-consulting",
        title: "Strategy consulting",
        description:
            "Through our strategic consulting services we provide guidance, in-depth analysis and marketing advice to help you achieve your goals.",
    },
    {
        icon: "randomized-minting",
        title: "Randomized minting",
        description:
            "Our smart contract is designed to ensure full NFT randomisation during the minting event, guaranteeing a fair and transparent distribution.",
    },
    {
        icon: "arweave",
        title: "Arweave",
        description:
            "Thanks to Arweave, we provide a a tamper-proof, permanent storage solution for your NFTs and metadata, making them accessible without having to worry about maintenance or costs.",
    },
    {
        icon: "nft-reveal",
        title: "NFT reveal",
        description:
            "Instant or delayed reveal? Choose the strategy that best fits your needs after the minting event.",
    },
    {
        icon: "saas",
        title: "Staking-as-a-Service",
        description:
            "Project will be able to utilize our NFT staking mechanism to incentivize their community of holders with rewards distributed in $WoV token.",
    },
    {
        icon: "utilities",
        title: "NFT additional utilities",
        description:
            "Projects launching on WoV will get access to customised utilities such as breeding, burning & airdrops.",
    },
    {
        icon: "integration",
        title: "Full VIP-180 integration",
        description:
            "Select VET or any VeChain Ecosystem (VIP-180) token as a payment option for the mint.",
    },
    {
        icon: "state-of-the-art-marketplace",
        title: "State-of-the-art marketplace",
        description:
            "World of V offers cutting-edge features such as collection offers & batch mint/sell/offer that will greatly enhance the collecting experience.",
    },
    {
        icon: "discord",
        title: "Discord Bot Services",
        description:
            "We’ll set up and implement customized Bots for your Discord server to keep your community up to date with sales, offers and listings of your project on World of V.",
    },
    {
        icon: "social-media",
        title: "Media Support",
        description:
            "We’ll provide visibility to your project through our social media and access to our art direction resources and tools to strengthen your communication strategy.",
    },
    {
        icon: "phygital",
        title: "Phygital integration",
        description:
            "Thanks to VeChain native tools, we enable artists to integrate their physical artwork with an NFC chip containing the NFT, thus creating a hybrid experience for the collectors.",
    },
];

const LaunchpadWhy = () => (
    <Container>
        <Head>
            <Title>A Suite of Services & Tools for NFT Creators</Title>
        </Head>

        <Grid>
            {reasonsWhy.map((props) => (
                <InfoCard key={props.title} {...props} />
            ))}
        </Grid>

        <Description>
            We&apos;re looking forward to starting a project with you:{" "}
            <CustomLink href="https://discord.gg/worldofv">
                Get in touch now!
            </CustomLink>
        </Description>
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

const Description = styled.h2`
    color: ${neutrals[4]};
    ${body1};
    text-align: center;
    margin-top: 10px;
    display: block;
    margin-bottom: 20px;
    font-weight: 100;

    strong {
        font-weight: 500;
        color: ${neutrals[2]};

        ${dark`
            color: ${neutrals[8]};
        `}
    }
`;

const CustomLink = styled.a`
    color: ${blue};
    cursor: pointer;
    font-weight: bold;
`;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 40px;

    > * {
        ${calculateCardSize(4, 24)};
        margin: 24px 12px 0;
        text-align: center;

        ${media.z`
            ${calculateCardSize(4, 24)};
            `}

        ${media.d`
            ${calculateCardSize(3, 24)};
        `}

        ${media.f`
            ${calculateCardSize(2, 24)};
        `}

        ${media.p`
            ${calculateCardSize(1, 24)};
        `}
    }
`;

export default LaunchpadWhy;
