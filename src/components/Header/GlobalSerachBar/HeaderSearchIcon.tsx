import React from "react";
import styled from "styled-components";
import CircleButton from "../../CircleButton";
import Icon from "../../Icon";

interface HeaderSearchIconProps {
    isSearchBarOpen: boolean;
    setIsSearchBarOpen: (value: boolean) => void;
}

const HeaderSearchIcon: React.FC<HeaderSearchIconProps> = ({
    isSearchBarOpen,
    setIsSearchBarOpen,
}) => {
    return (
        <Container>
            <CircleButton
                small
                outline
                style={{ zIndex: 1 }}
                onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}
                ui
                button
            >
                <Icon icon="search" />
            </CircleButton>
        </Container>
    );
};

const Container = styled.div``;

export default HeaderSearchIcon;
