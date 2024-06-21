import React from "react";
import styled from "styled-components";
import common from "../../styles/_common";
import PillsNav, { NavItemProps } from "../PillsNav";

const { containerLarge } = common;

const CollectionsTop = () => {
    const navList = React.useMemo(
        () => [
            {
                label: "All",
                value: 0,
                count: 8,
            },
            {
                label: "Minting Now",
                value: 1,
                count: 3,
            },
        ],
        []
    );

    const [selectedTab, setSelectedTab] = React.useState(
        navList.find((el) => el.value === 0)?.label
    );

    const onTabChange = (item: NavItemProps) => setSelectedTab(item.label);

    return (
        <Container>
            <StyledPillsNav
                items={navList}
                value={selectedTab}
                onChange={onTabChange}
            />
        </Container>
    );
};

const Container = styled.div`
    ${containerLarge};
`;

const StyledPillsNav = styled(PillsNav)`
    display: flex;
    justify-content: center;
`;

export default CollectionsTop;
