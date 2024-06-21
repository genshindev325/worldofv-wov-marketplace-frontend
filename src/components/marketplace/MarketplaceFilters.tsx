import { useMediaQuery } from "@react-hook/media-query";
import React from "react";
import styled, { useTheme } from "styled-components";
import {
    CATEGORY_OPTIONS,
    CREATOR_OPTIONS,
    FILTER_SORT_OPTIONS,
    PAYMENT_OPTIONS,
    SORT_OPTIONS,
} from "../../constants/marketplaceFilterOptions";
import ModalFilters from "../../modals/ModalFilters";
import { useMarketplace } from "../../providers/MarketplaceProvider";
import mixins from "../../styles/_mixins";
import { Button } from "../common/Button";
import { GridTypeSelector } from "../common/GridTypeSelector";
import { Spacer } from "../common/Spacer";
import { OptionItemProps, Select } from "../FormInputs/Select";
import { TokenTypeSelect } from "../FormInputs/TokenTypeSelect";
import GroupSelect from "../GroupSelect";
import MarketplaceCollectionSelect from "./MarketplaceCollectionSelect";

const { media } = mixins;

// TODO: DRY input field components
const MarketplaceFilters = () => {
    const theme = useTheme();
    const {
        selectedSort,
        setSelectedSort,
        selectedPayment,
        setSelectedPayment,
        selectedCreator,
        setSelectedCreator,
        selectedCategory,
        setSelectedCategory,
        selectedTokenType,
        setSelectedTokenType,
    } = useMarketplace();

    const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);

    const onChangeFilterSortOptions = (group: string, option: string) => {
        switch (group) {
            case "filter":
                return setSelectedCreator(
                    CREATOR_OPTIONS.find((o: any) => o.value === option)!
                );
            case "sort":
                return setSelectedSort(
                    SORT_OPTIONS.find((o: any) => o.value === option)!
                );
        }
    };

    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.a})`);

    // We could simplify this by introducing a grid system
    // that is adaptable based on break points
    const tokenTypeSelect = (
        <TokenTypeSelect
            value={selectedTokenType}
            onChange={setSelectedTokenType}
        />
    );

    return (
        <>
            {isSmallScreen && (
                <>
                    <ModalFilters
                        isOpen={isFiltersOpen}
                        setIsOpen={setIsFiltersOpen}
                    >
                        <Grid>
                            <Select
                                inputProps={{
                                    value: selectedCreator,
                                    options: CREATOR_OPTIONS,
                                    onChange: (value) =>
                                        setSelectedCreator!(
                                            value as OptionItemProps
                                        ),
                                }}
                            />

                            {tokenTypeSelect}

                            <Select
                                inputProps={{
                                    value: selectedPayment,
                                    options: PAYMENT_OPTIONS,
                                    onChange: (value) =>
                                        setSelectedPayment!(
                                            value as OptionItemProps
                                        ),
                                }}
                            />
                            <Select
                                inputProps={{
                                    value: selectedCategory,
                                    options: CATEGORY_OPTIONS,
                                    onChange: (value) =>
                                        setSelectedCategory!(
                                            value as OptionItemProps
                                        ),
                                }}
                            />
                        </Grid>

                        <Spacer y size={3} />

                        <Button
                            style={{ width: "100%" }}
                            type="button"
                            onClick={() => setIsFiltersOpen(false)}
                        >
                            Done
                        </Button>
                    </ModalFilters>

                    <Grid>
                        <MarketplaceCollectionSelect />

                        <GridItemEnd>
                            <GroupSelect
                                label="Filter &amp; Sort"
                                content={selectedSort.label}
                                groups={FILTER_SORT_OPTIONS}
                                onChange={onChangeFilterSortOptions}
                                selected={{
                                    filter: selectedCreator.value,
                                    sort: selectedSort.value,
                                }}
                            />

                            <GridTypeSelector />
                        </GridItemEnd>
                    </Grid>

                    <FloatButton small onClick={() => setIsFiltersOpen(true)}>
                        Filter
                    </FloatButton>
                </>
            )}

            {!isSmallScreen && (
                <Grid>
                    <Select
                        inputProps={{
                            value: selectedCategory,
                            options: CATEGORY_OPTIONS,
                            onChange: (value) =>
                                setSelectedCategory!(value as OptionItemProps),
                        }}
                    />
                    <Select
                        inputProps={{
                            value: selectedPayment,
                            options: PAYMENT_OPTIONS,
                            onChange: (value) =>
                                setSelectedPayment!(value as OptionItemProps),
                        }}
                    />

                    <MarketplaceCollectionSelect />

                    {tokenTypeSelect}

                    <GridItemEnd>
                        <GroupSelect
                            label="Filter &amp; Sort"
                            content={selectedSort.label}
                            groups={FILTER_SORT_OPTIONS}
                            onChange={onChangeFilterSortOptions}
                            selected={{
                                filter: selectedCreator.value,
                                sort: selectedSort.value,
                            }}
                        />

                        <GridTypeSelector />
                    </GridItemEnd>
                </Grid>
            )}
        </>
    );
};

const Grid = styled.div`
    display: grid;
    grid-template-columns:
        minmax(160px, 320px) repeat(1, minmax(160px, 192px))
        minmax(160px, 240px) minmax(160px, 192px) auto;
    gap: 16px;

    ${media.x`
        grid-template-columns: 1fr 1fr;
    `}

    ${media.a`
        grid-template-columns: 1fr;
    `}
`;

const GridItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    & > * {
        width: 100%;
    }
`;

const GridItemEnd = styled(GridItem)`
    justify-content: flex-end;
    white-space: nowrap;

    & > div {
        width: 100%;

        &:first-child {
            min-width: 200px;
            max-width: 240px;
        }
    }

    ${media.t`
        & > div {
            &:first-child {
                min-width: 70%;
            }

            &:nth-child(2) {
                justify-content: end;
                min-width: 20%;
            }
        }
    `}

    ${media.a`
        grid-column: auto;
    `}
`;

const FloatButton = styled(Button)`
    background-color: rgba(119, 126, 144, 0.7);
    backdrop-filter: blur(5px);
    z-index: 10;
    position: fixed;
    bottom: 20px;
    width: 80%;
    left: 50%;
    transform: translate(-50%, 0);
`;

export default MarketplaceFilters;
