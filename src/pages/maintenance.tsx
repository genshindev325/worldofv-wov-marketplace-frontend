import styled from "styled-components";
import common from "../styles/_common";
import variables from "../styles/_variables";
import { CustomNextPage } from "./_app";

const { containerLarge } = common;

const {
    colors: { white, neutrals },
    typography: { h3, body1 },
} = variables;

const Maintenance: CustomNextPage = () => (
    <Container id="edit-collection">
        <Icon>
            <img src="/img/wov-yellow-logo.svg" alt="World of V" />
        </Icon>
        <Headline>We&apos;ll be Right Back!</Headline>
        <Message>
            We&apos;re down for maintenance, we&apos;ll be back soon.
        </Message>
    </Container>
);

Maintenance.noHeader = true;
Maintenance.noFooter = true;

const Container = styled.div`
    ${containerLarge};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const Icon = styled.div`
    position: relative;
    z-index: 12;
    width: 100px;

    img {
        position: relative;
        width: 100%;
    }
`;

const Headline = styled.p`
    ${h3};
    color: ${white};
    text-align: center;
    margin-top: 50px;
`;

const Message = styled.p`
    ${body1};
    color: ${neutrals[5]};
    text-align: center;
    margin-top: 50px;
`;

export default Maintenance;
