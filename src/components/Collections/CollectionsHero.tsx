import React from "react";
import styled from "styled-components";
import common from "../../styles/_common";
import variables from "../../styles/_variables";
import { SearchInput } from "../FormInputs/SearchInput";

const { containerLarge } = common;

const {
    typography: { h3 },
} = variables;

interface CollectionsHeroProps {
    searchText: string;
    setSearchText: (value: string) => void;
}

const CollectionsHero: React.FC<CollectionsHeroProps> = ({
    searchText,
    setSearchText,
}) => (
    <Container>
        <Head>
            <Title>Explore Collections</Title>
            <SearchInputContainer>
                <SearchInput
                    value={searchText}
                    placeholder="Search by Collection Name"
                    onSearch={setSearchText}
                />
            </SearchInputContainer>
        </Head>
    </Container>
);

const Container = styled.div`
    ${containerLarge};
`;

const Head = styled.div`
    max-width: 800px;
    margin: 0 auto 32px;
    text-align: center;
`;

const Title = styled.h3`
    ${h3};
    margin-bottom: 8px;
`;

const SearchInputContainer = styled.div`
    margin: 20px auto;
    max-width: 400px;
`;

export default CollectionsHero;
