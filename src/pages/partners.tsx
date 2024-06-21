import type { NextPage } from "next";
import styled from "styled-components";
import Head from "../components/Head";
import PartnersHero from "../components/Partners/PartnersHero";
import PartnersList from "../components/Partners/PartnersList";
import PartnersWhy from "../components/Partners/PartnersWhy";
import sections from "../styles/_section";

const { section } = sections;

const About: NextPage = () => (
    <>
        <Head title="Partners" />

        <Container id="edit-collection">
            <InnerContainer>
                <PartnersHero />
                <PartnersWhy />
                <PartnersList />
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
