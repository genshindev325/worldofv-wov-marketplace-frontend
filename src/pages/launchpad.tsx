import type { NextPage } from "next";
import styled from "styled-components";
import Head from "../components/Head";
import LaunchpadHeader from "../components/Launchpad/LaunchpadHeader";
import LaunchpadHero from "../components/Launchpad/LaunchpadHero";
import LaunchpadWhy from "../components/Launchpad/LaunchpadWhy";
import sections from "../styles/_section";

const { section } = sections;

const Launchpad: NextPage = () => (
    <>
        <Head title="Launchpad" />

        <Container id="edit-collection">
            <InnerContainer>
                <LaunchpadHeader />
                <LaunchpadHero />
                <LaunchpadWhy />
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

export default Launchpad;
