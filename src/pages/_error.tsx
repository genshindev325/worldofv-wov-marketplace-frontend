import styled from "styled-components";
import common from "../styles/_common";
import variables from "../styles/_variables";
import { CustomNextPage } from "./_app";

const { containerLarge } = common;

const {
    colors: { yellow },
    typography: { h3, h4, body2 },
} = variables;

const Error: CustomNextPage = () => (
    <Container>
        <Icon>
            <img src="/img/wov-yellow-logo.svg" alt="World of V" />
        </Icon>
        <Message>
            The marketplace is momentarily undergoing technical difficulties,
            we&apos;re working to resolve them. We apologize for the
            inconvenience.
        </Message>
    </Container>
);

Error.noHeader = true;
Error.noFooter = true;

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

const Message = styled.p`
    ${h3};
    color: ${yellow};
    text-align: center;
    margin-top: 50px;
`;

export default Error;
