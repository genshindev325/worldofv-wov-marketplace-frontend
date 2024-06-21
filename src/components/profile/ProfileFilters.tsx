import styled from "styled-components";
import { useProfile } from "../../providers/ProfileProvider";
import CollectionSelect from "../CollectionSelect";
import { GridTypeSelector } from "../common/GridTypeSelector";
import { Spacer } from "../common/Spacer";
import PropertiesSelect from "../FormInputs/PropertiesSelect";
import { SearchInput } from "../FormInputs/SearchInput";
import { SortSelect } from "../FormInputs/SortSelect";
import { TokenTypeSelect } from "../FormInputs/TokenTypeSelect";

export const ProfileFilters = () => {
    const {
        selectedTab,
        query,
        setQuery,
        sortOptions,
        selectedSort,
        setSelectedSort,
        selectedTokenType,
        setSelectedTokenType,
        selectedCollectionId,
        setSelectedCollectionId,
        properties,
        setProperties,
    } = useProfile();

    const isCreatedTab = selectedTab.value === "created";
    const isArtistToken = selectedTokenType.value === "artist";
    const isCollectionSelected = selectedCollectionId != null;

    return (
        <Container>
            <SearchInput
                value={query}
                placeholder="Search by Title, Artist, Collection"
                onSearch={setQuery}
            />
            {isCollectionSelected && (
                <PropertiesSelect
                    collectionId={selectedCollectionId!}
                    selectedProperties={properties}
                    onSelectProperties={setProperties}
                />
            )}
            {!isCreatedTab && !isCollectionSelected && (
                <TokenTypeSelect
                    value={selectedTokenType}
                    onChange={setSelectedTokenType}
                />
            )}
            {!isCreatedTab && !isArtistToken && (
                <CollectionSelect
                    showDeselectOption
                    selectedCollectionId={selectedCollectionId}
                    onSelectCollection={(c) =>
                        setSelectedCollectionId(c?.collectionId)
                    }
                />
            )}
            <SelectContainer>
                <SortSelect
                    options={sortOptions}
                    value={selectedSort}
                    onChange={setSelectedSort}
                />

                <Spacer size={3} />
                <GridTypeSelector />
            </SelectContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    & > :first-child {
        flex-grow: 2;
        flex-basis: 200px;
    }

    & > * {
        flex-grow: 1;
        flex-basis: 160px;
    }
`;

const SelectContainer = styled.div`
    min-width: 288px;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: stretch;

    > :first-child {
        flex-grow: 1;
        min-width: 0;
    }
`;
