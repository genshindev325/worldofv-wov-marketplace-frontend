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

const reasonsWhy = [
    {
        title: "Zero Gas Fees",
        description:
            "On World of V you can mint, buy & sell NFTs with no gas fees. Thanks to our Fee Delegation mechanism, all fees are sponsored by us.",
    },
    {
        title: "Exclusive Features",
        description:
            "Enjoy a wide range of features and functionalities built around you and designed to enhance your experience on our secure, easy-to-use platform.",
    },
    {
        title: "Phygital",
        description:
            "Thanks to the combination of Blockchain, IoT and NFC technology, we bridge the gap between the physical and the digital world to create a one-of-a-kind experience.",
    },
];

const PartnersWhy = () => (
    <Container>
        <Head>
            <Title>Let&#8216;s work together</Title>
        </Head>

        <Description>
            Our goal is to build a vibrant environment where builders can shape
            the future of digital art.
            <br />
            By partnering up with us, you&#8216;ll be able to leverage on our
            exclusive tools, network and expertise to grow your community and
            engage with like-minded NFT enthusiasts.
        </Description>

        <Grid>
            {reasonsWhy.map((props) => (
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
            ${calculateCardSize(2, 24)};
        `}

        ${media.p`
            ${calculateCardSize(1, 24)};
        `}
    }
`;

export default PartnersWhy;
