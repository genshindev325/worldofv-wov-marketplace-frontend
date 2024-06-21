import { useTheme } from "next-themes";
import React from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import Footer from "./Footer";
import Header from "./Header/Header";

interface GlobalLayoutProps {
    noHeader?: boolean;
    noFooter?: boolean;
}

const GlobalLayout: React.FC<React.PropsWithChildren<GlobalLayoutProps>> = ({
    noHeader,
    noFooter,
    children,
}) => {
    const { theme } = useTheme();

    return (
        <Container {...{ noHeader }}>
            {!noHeader && <Header />}

            <InnerContainer>{children}</InnerContainer>

            {/*
             * TODO: sometimes when the page is initially loaded the text inside
             * the toast is not visible, I think it might have something to do
             * with this component here.
             */}
            <ToastContainer
                position="top-center"
                theme={theme === "dark" ? "dark" : "light"}
            />

            {!noFooter && <Footer />}
        </Container>
    );
};

const Container = styled.main<{ noHeader?: boolean }>`
    max-width: 100%;
    min-height: 100vh;
    width: 100%;
    vertical-align: inherit;
    flex-shrink: 0;
    flex-direction: column;
    flex-basis: auto;
    display: flex;
    align-items: stretch;
`;

const InnerContainer = styled.div`
    flex: 1 0 auto;
    vertical-align: inherit;
    max-width: 100%;
    min-height: 0px;
    min-width: 0px;
    flex-direction: column;
    display: flex;
    align-items: stretch;
`;

export default GlobalLayout;
