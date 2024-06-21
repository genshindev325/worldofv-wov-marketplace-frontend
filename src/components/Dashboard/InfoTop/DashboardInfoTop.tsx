import React from "react";
import styled from "styled-components";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";
import DashboardEstimadedGen from "./DashboardEstimatedGen";
import DashboardUnclaimedWov from "./DashboardUnclaimedWoV";

const { dark } = mixins;
const { breakpoints } = variables;

const DashboardInfoTop: React.FC = () => {
    return (
        <Container>
            <DashboardUnclaimedWov />
            <DashboardEstimadedGen />
        </Container>
    );
};

const Container = styled.section`
    height: 380px;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin: 20px;
    @media only screen and (max-width: ${breakpoints.t}) {
        height: unset;
        flex-direction: column;
        align-items: center;
    }
    @media only screen and (max-width: ${breakpoints.x}) {
        margin: 20px 0;
    }
`;

export default DashboardInfoTop;
