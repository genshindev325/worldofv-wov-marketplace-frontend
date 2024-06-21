import { NextPage } from "next";
import styled from "styled-components";
import DashboardBody from "../components/Dashboard/DashboardBody";
import DashboardProvider from "../components/Dashboard/DashBoardProvider";
import Head from "../components/Head";

const DashBoard: NextPage = () => {
    return (
        <>
            <Head title="Dashboard" />
            <DashboardProvider>
                <Container>
                    <DashboardBody />
                </Container>
            </DashboardProvider>
        </>
    );
};

const Container = styled.div``;

export default DashBoard;
