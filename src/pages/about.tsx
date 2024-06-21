import type { NextPage } from "next";
import styled from "styled-components";
import AboutContact from "../components/About/AboutContact";
import AboutFees from "../components/About/AboutFees";
import AboutGreenestNFTPlatform from "../components/About/AboutGreenestNFTPlatform";
import AboutHero from "../components/About/AboutHero";
import Head from "../components/Head";
import sections from "../styles/_section";

const { section } = sections;

const About: NextPage = () => (
    <>
        <Head title="About" />

        <Container id="edit-collection">
            <InnerContainer>
                <AboutHero />
                <AboutFees />
                <AboutGreenestNFTPlatform />
                <AboutContact />
            </InnerContainer>
        </Container>
    </>
);

const Container = styled.div`
    padding-bottom: 80px;
`;

const InnerContainer = styled.div`
    ${section};
    padding-bottom: 0 !important;
`;

export default About;
