import React, { useMemo } from "react";
import styled from "styled-components";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { ITokenAttribute } from "../types/TokenData";
import isValidURL from "../utils/isValidUrl";
import { Alert } from "./common/Alert";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { bodyBold2, caption1, captionBold1, hairline2 },
} = variables;

interface TokenAttributeListProps {
    attributes?: ITokenAttribute[];
    score?: number;
    rank?: number;
}
const TokenAttributeList: React.FC<TokenAttributeListProps> = ({
    attributes,
    score,
    rank,
}) => (
    <Container>
        {rank || score ? (
            <PropertiesContainer>
                {rank ? (
                    <PropertyCard>
                        <PropertyCardLabel>Rank</PropertyCardLabel>
                        <PropertyCardValue>{rank}</PropertyCardValue>
                    </PropertyCard>
                ) : null}

                {score ? (
                    <PropertyCard>
                        <PropertyCardLabel>Score</PropertyCardLabel>
                        <PropertyCardValue>
                            {Math.round(score * 100) / 100}
                        </PropertyCardValue>
                    </PropertyCard>
                ) : null}
            </PropertiesContainer>
        ) : null}

        {!attributes ? (
            <Alert text="No attributes found for this NFT" />
        ) : (
            attributes.map((a) => (
                <Attribute key={`${a.trait_type}_${a.value}`} {...a} />
            ))
        )}
    </Container>
);

const Attribute = ({ trait_type, ...props }: ITokenAttribute) => {
    const value = props.value?.toString();
    const isUrl = useMemo(() => isValidURL(value, ["http", "https"]), [value]);
    const shortUrl = useMemo(
        () =>
            isUrl
                ? value.replace(/(?<=^https?:\/\/.+[\/]).+(?=\/[^\/]+$)/, "...")
                : null,
        [isUrl, value]
    );

    return (
        <AttributeItem>
            <AttributeItemName
                style={{ whiteSpace: isUrl ? "nowrap" : "inherit" }}
            >
                {trait_type}
            </AttributeItemName>
            {isUrl ? (
                <AttributeItemLink target="_blank" href={value}>
                    {shortUrl}
                </AttributeItemLink>
            ) : (
                <AttributeItemValue>{value}</AttributeItemValue>
            )}
        </AttributeItem>
    );
};

const Container = styled.div`
    padding-top: 16px;
`;

const PropertiesContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
`;

const PropertyCard = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 12px 16px;
    border-radius: 8px;
    background: ${neutrals[7]};

    ${dark`
        background: ${neutrals[2]};
    `}

    &:not(:last-child) {
        margin-right: 16px;
    }
`;

const PropertyCardLabel = styled.div`
    ${hairline2};
    margin-bottom: 4px;
    color: ${neutrals[4]};

    ${dark`
        color: ${neutrals[5]};
    `}
`;

const PropertyCardValue = styled.div`
    ${bodyBold2}
`;

const AttributeItem = styled.div`
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
        border-bottom: 1px solid ${neutrals[6]};
        padding-bottom: 2px;
        margin-bottom: 2px;

        ${dark`
            border-color: ${neutrals[2]};
        `}
    }
`;

const AttributeItemName = styled.div`
    ${captionBold1};
    color: ${neutrals[4]};

    ${dark`
        color: ${neutrals[5]};
    `}
`;

const AttributeItemValue = styled.div`
    ${caption1};
`;

const AttributeItemLink = styled.a`
    ${caption1};
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
    margin-left: 8px;
`;

export default TokenAttributeList;
