import React from "react";
import styled from "styled-components";
import { Text } from "../common/Text";
import { Tooltip } from "../common/Tooltip";
import GenesisGenerationData from "./GenesisGenerationData";

interface GenesisRoundelProps {
    name: string;
}

const GenesisRoundel: React.FC<GenesisRoundelProps> = ({ name }) => {
    const data = GenesisGenerationData.find((data) =>
        name.startsWith(data.name)
    );

    if (data?.generationAmount == null) {
        return null;
    }

    return (
        <Tooltip content="WoV Daily Generation" placement="bottom-end">
            <Container>
                <GenesisRoundelImage src="/img/wov-white-logo.svg" />
                <Text fontSize={3} fontWeight="bold" color="white" as="span">
                    {data.generationAmount}
                </Text>
            </Container>
        </Tooltip>
    );
};

const Container = styled.div`
    width: auto !important;
    height: auto !important;
    position: absolute;
    padding: 0px 12px;
    top: 10px;
    right: 10px;
    line-height: 30px !important;
    background-color: ${({ theme }) => theme.colors.primary} !important;
    border-radius: ${({ theme }) => theme.radii[5]}px;
    z-index: 1;
`;

const GenesisRoundelImage = styled.img`
    margin-right: 4px;
    object-fit: contain;
    width: auto !important;
    height: 20px !important;
    background-color: inherit !important;
`;

export default GenesisRoundel;
