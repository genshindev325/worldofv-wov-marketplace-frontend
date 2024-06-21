import React from "react";
import styled from "styled-components";
import { useDashBoard } from "../DashBoardProvider";
import CardSet from "./CardSet";

const DashboardInfoBot: React.FC = () => {
    const { genesisCountBySet } = useDashBoard();

    return (
        <Container>
            <CardSet
                name="Genesis 2021"
                count={genesisCountBySet.whale}
                set="Whale"
            />
            <CardSet
                name="Moon Set"
                count={genesisCountBySet.moon}
                set="Moon"
            />
            <CardSet
                name="Africa Set"
                count={genesisCountBySet.africa}
                set="Africa"
            />
            <CardSet
                name="Olympic Set"
                count={genesisCountBySet.olympic}
                set="Olympic"
            />
            <CardSet
                name="Flower Set"
                count={genesisCountBySet.flower}
                set="Flower"
            />
            <CardSet
                name="World Cup Set"
                count={genesisCountBySet.worldCup}
                set="World Cup"
            />
            <CardSet
                name="Secret Set"
                count={{ owned: "?", total: "??" }}
                set="Secret"
                disabled={true}
            />
        </Container>
    );
};

const Container = styled.section``;

export default DashboardInfoBot;
