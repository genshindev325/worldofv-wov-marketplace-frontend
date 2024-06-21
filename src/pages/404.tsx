import type { NextPage } from "next";
import styled from "styled-components";
import common from "../styles/_common";
import variables from "../styles/_variables";

const { containerLarge } = common;

const {
    colors: { neutrals },
    typography: { h3, body2 },
} = variables;

const Custom404: NextPage = () => (
    <Container>
        <Icon>
            <img src="/img/wov-logo.svg" alt="World of V" />
        </Icon>
        <Headline>Page not found</Headline>
        <Lead>
            Uh oh, we can&apos;t seem to find the page you&apos;re looking for.
            Try going back
            <br />
            to the previous page or see our Help Center for more information.
        </Lead>
    </Container>
);

const Container = styled.div`
    ${containerLarge};
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
`;

const Icon = styled.div`
    position: relative;
    z-index: 12;
    width: 200px;

    img {
        position: relative;
        width: 100%;
    }
`;

const Headline = styled.p`
    ${h3};
    text-align: center;
    margin-top: 50px;
`;

const Lead = styled.p`
    ${body2};
    color: ${neutrals[5]};
    text-align: center;
    margin-top: 10px;
`;

export default Custom404;
