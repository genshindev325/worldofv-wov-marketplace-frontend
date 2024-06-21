import React from "react";
import styled from "styled-components";
import banner from "../../../public/img/DashboardBanner.jpeg";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import DashboardAside from "./Aside/DashboardAside";
import DashboardInfoBot from "./InfoBot/DashBoardInfoBot";
import DashboardDelegation from "./InfoTop/DashboardDelegation";
import DashboardInfoTop from "./InfoTop/DashboardInfoTop";

const { dark } = mixins;
const { breakpoints } = variables;

const DashboardBody: React.FC = () => {
    return (
        <>
            <Banner />
            <Container>
                <DashboardAside />
                <InnerCotnainer>
                    <DashboardInfoTop />
                    <DashboardDelegation />
                    <DashboardInfoBot />
                </InnerCotnainer>
            </Container>
        </>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    @media only screen and (max-width: ${breakpoints.x}) {
        flex-direction: column;
    }
`;

const Banner = styled.div`
    background-image: url(${banner.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 250px;
`;

const InnerCotnainer = styled.div`
    width: 77%;
    @media only screen and (max-width: ${breakpoints.x}) {
        width: 100%;
    }
`;

export default DashboardBody;
