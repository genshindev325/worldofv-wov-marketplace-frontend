import { useMediaQuery } from "@react-hook/media-query";
import { useState } from "react";
import styled, { useTheme } from "styled-components";
import { useCollectionAttributes } from "../../hooks/useCollectionAttributes";
import ModalCollectionFilter from "../../modals/ModalCollectionFilter";
import ModalSort from "../../modals/ModalSort";
import { useCollection } from "../../providers/CollectionProvider";
import { CollectionOffer } from "../batch-actions";
import CircleButton from "../CircleButton";
import { Button } from "../common/Button";
import { Flex } from "../common/Flex";
import { GridTypeSelector } from "../common/GridTypeSelector";
import { Popup } from "../common/Popup";
import { Spacer } from "../common/Spacer";
import { PropertiesInput } from "../FormInputs/PropertiesInput";
import { SearchInput } from "../FormInputs/SearchInput";
import { SortSelect } from "../FormInputs/SortSelect";
import { SwitchInput } from "../FormInputs/SwitchInput";
import Icon from "../Icon";
import MarketplaceCollectionSelect from "../marketplace/MarketplaceCollectionSelect";
import { ModalBatchSelect } from "./ModalBatchSelect";

const CollectionFilters = () => {
    const theme = useTheme();
    const {
        collection,
        selectedTab,
        query,
        setQuery,
        sortOptions,
        sort,
        setSort,
        onlyStakeable,
        setOnlyStakeable,
        currency,
        setCurrency,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        minRank,
        setMinRank,
        maxRank,
        setMaxRank,
        activeProperties,
        setActiveProperties,
    } = useCollection();

    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.a})`);
    const attributes = useCollectionAttributes(collection);

    const [isModalBatchSelectOpen, setModalBatchSelectOpen] = useState(false);
    const [isModalSortOpen, setModalSortOpen] = useState(false);
    const [isModalCollectionFilterOpen, setModalCollectionFilterOpen] =
        useState(false);

    const hideStakedButton =
        process.env.NEXT_PUBLIC_DISABLE_STAKING?.toLowerCase() != "true" &&
        selectedTab.value === "collected" &&
        collection.stakingContractAddresses?.length ? (
            <SwitchInput
                label="Available for Staking"
                checked={onlyStakeable}
                onChange={(e) => {
                    setOnlyStakeable(e.target.checked);
                }}
            />
        ) : null;

    const searchInput = (
        <SearchInput
            value={query}
            placeholder={
                collection?.type === "EXTERNAL"
                    ? "Search by Title"
                    : "Search by Title, Artist, Collection"
            }
            onSearch={setQuery}
        />
    );

    return (
        <>
            <SelectContainer>
                {!isSmallScreen && searchInput}
                {!isSmallScreen && hideStakedButton}

                {isSmallScreen && collection?.type === "EXTERNAL" && (
                    <>
                        <SingleSelectContainer>
                            <StyledCollectionSelect
                                selectedCollectionId={collection.collectionId}
                            />

                            <StyledPopup
                                content={searchInput}
                                trigger="click"
                                interactive
                                placement="bottom"
                            >
                                <StyledCircleButton outline>
                                    <Icon icon="search" />
                                </StyledCircleButton>
                            </StyledPopup>

                            <GridTypeSelector />
                        </SingleSelectContainer>

                        <div style={{ flexBasis: "100%" }}>
                            {hideStakedButton}
                        </div>

                        <FlexContainer>
                            {["all", "onsale"].includes(selectedTab.value) && (
                                <CollectionOffer fullWidth small={false} />
                            )}

                            <ButtonGroup>
                                <ButtonWithIcon
                                    outline
                                    onClick={() => {
                                        setModalBatchSelectOpen(true);
                                    }}
                                >
                                    <Icon icon="saas" />
                                    Batch
                                </ButtonWithIcon>
                                <ButtonWithIcon
                                    outline
                                    onClick={() => {
                                        setModalCollectionFilterOpen(true);
                                    }}
                                >
                                    <Icon icon="filter" />
                                    Filters
                                </ButtonWithIcon>
                                <ButtonWithIcon
                                    outline
                                    onClick={() => {
                                        setModalSortOpen(true);
                                    }}
                                >
                                    <Icon icon="sort" />
                                    Sort
                                </ButtonWithIcon>
                            </ButtonGroup>
                        </FlexContainer>
                    </>
                )}

                {isSmallScreen && collection?.type === "MARKETPLACE" && (
                    <Flex flexDirection="column" width="100%" columnGap={3}>
                        {searchInput}
                        <Flex
                            alignItems="center"
                            justifyContent="space-between"
                            rowGap={3}
                        >
                            <SortSelect
                                options={sortOptions}
                                value={sort}
                                fullWidth
                                onChange={setSort}
                            />
                            <GridTypeSelector />
                        </Flex>
                        <ButtonWithIcon
                            outline
                            onClick={() => {
                                setModalBatchSelectOpen(true);
                            }}
                        >
                            <Icon icon="saas" />
                            Batch
                        </ButtonWithIcon>
                    </Flex>
                )}

                {!isSmallScreen && collection?.type === "EXTERNAL" && (
                    <>
                        <StyledCollectionSelect
                            selectedCollectionId={collection.collectionId}
                        />

                        <PropertiesInput
                            onClick={() => {
                                setModalCollectionFilterOpen(true);
                            }}
                        />
                    </>
                )}

                {!isSmallScreen && (
                    <SingleSelectContainer>
                        <SortSelect
                            options={sortOptions}
                            value={sort}
                            onChange={setSort}
                        />
                        <Spacer size={3} />
                        <GridTypeSelector />
                    </SingleSelectContainer>
                )}
            </SelectContainer>

            <ModalBatchSelect
                isOpen={isModalBatchSelectOpen}
                setIsOpen={setModalBatchSelectOpen}
            />

            <ModalCollectionFilter
                isOpen={isModalCollectionFilterOpen}
                setIsOpen={setModalCollectionFilterOpen}
                attributes={attributes}
                values={{
                    selectedProperties: activeProperties as any,
                    currency,
                    minPrice,
                    maxPrice,
                    minRank,
                    maxRank,
                }}
                onSetValues={(vs) => {
                    setActiveProperties((vs.selectedProperties as any) || null);
                    setCurrency(vs.currency);
                    setMinPrice(vs.minPrice);
                    setMaxPrice(vs.maxPrice);
                    setMinRank(vs.minRank);
                    setMaxRank(vs.maxRank);
                }}
            />

            <ModalSort
                options={sortOptions}
                isOpen={isModalSortOpen}
                setIsOpen={setModalSortOpen}
                selectedOption={sort}
                setSelectedOption={setSort}
            />
        </>
    );
};

const SelectContainer = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    & > :first-child {
        flex-grow: 2;
        flex-basis: 240px;
    }

    & > * {
        flex-grow: 1;
        flex-basis: 240px;
    }
`;

const SingleSelectContainer = styled.div`
    min-width: 288px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: stretch;

    > :first-child {
        flex-grow: 1;
        min-width: 0;
        margin-right: 16px;
    }

    @media screen and (max-width: 384px) {
        flex-wrap: wrap;
        justify-content: space-between;

        > :first-child {
            width: 100%;
            margin-bottom: 8px;
            margin-right: 0px;
        }
    }
`;

// TODO: use Flex component
const FlexContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ButtonWithIcon = styled(Button)`
    i.icon {
        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 5px;
        }
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    flex: 1;

    > * + * {
        margin-left: 8px;
    }

    > * {
        flex: 1 1 128px;
        max-height: 48px;
    }

    @media screen and (max-width: 384px) {
        flex-direction: column;

        > * + * {
            margin-left: 0px;
            margin-top: 8px;
        }
    }
`;

const StyledPopup = styled(Popup)`
    border-radius: 16px;
`;

const StyledCollectionSelect = styled(MarketplaceCollectionSelect)`
    min-width: 256px;
`;

const StyledCircleButton = styled(CircleButton)`
    flex-grow: 0;
    margin-right: 8px;
    width: 40px;
    max-width: 40px;
    height: 40px;
    padding: 0;
    overflow: hidden;

    i {
        padding: 0;
    }
`;

export default CollectionFilters;
