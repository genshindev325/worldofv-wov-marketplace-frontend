import { Box } from "@/components/common/Box";
import { Spacer } from "@/components/common/Spacer";
import React from "react";
import styled from "styled-components";
import variables from "../../../styles/_variables";
import DashboardFaq from "./DashboardFaq";
import DashboardUserInfo from "./DashboardUserInfo";

const { breakpoints } = variables;

const DashboardAside: React.FC = () => {
    return (
        <Container>
            <DashboardUserInfo />
            <Spacer y size={4} />
            <Box display={{ _: "none", x: "block" }}>
                <DashboardFaq />
            </Box>
        </Container>
    );
};

const Container = styled.aside`
    margin-top: 40px;
    width: 350px;
    @media only screen and (max-width: ${breakpoints.x}) {
        width: 100%;
    }
`;

export default DashboardAside;
