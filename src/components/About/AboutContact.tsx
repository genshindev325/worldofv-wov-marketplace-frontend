import Link from "next/link";
import styled from "styled-components";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { containerLarge } = common;
const { media, dark } = mixins;

const {
    colors: { neutrals },
    typography: { h3, h4, body1, body2 },
} = variables;

const AboutContact = () => (
    <Container>
        <Head>
            <Title>Interested in contacting us?</Title>
        </Head>

        <Description>
            Do you have questions and are you looking for an answer?
        </Description>

        <Description>
            Send us an email at{" "}
            <Link href="mailto:info@worldofv.art" passHref>
                info@worldofv.art
            </Link>
        </Description>

        <Description>
            Join in our Discord Server and talk with the community.{" "}
            <Link href="https://discord.gg/worldofv" passHref>
                Click to join now!
            </Link>
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

export default AboutContact;
