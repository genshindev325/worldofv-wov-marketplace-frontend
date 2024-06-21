import { CardPlaceholder } from "@/components/cards/CardPlaceholder";
import { Button } from "@/components/common/Button";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import { MarketplaceTokenFragment } from "@/generated/graphql";
import mixins from "@/styles/_mixins";
import calculateCardSize from "@/utils/calculateCardSize";
import { ElementType, FC } from "react";
import LazyLoad from "react-lazyload";
import styled from "styled-components";

const { media } = mixins;

interface CardGridProps {
    /**
     * Use "wide" when the Grid is supposed to be full width. Otherwise, use "norrow".
     */
    variant: "narrow" | "wide" | "wider";
    /**
     * Grid type
     */
    gridType: "small" | "large";
    /**
     * Card component.
     */
    CardComponent: ElementType;
    /**
     * Display placeholder while data are being loaded.
     */
    loading: boolean;
    /**
     * Items data to be displayed using the given CardComponent.
     */
    items: MarketplaceTokenFragment[];
    /**
     * Number of items to be displayed on the grid.
     */
    pageSize: number;
    /**
     * Text to display in case of no results found.
     */
    noResultsText?: string;
    /**
     * Button label to display in case of no results found.
     */
    noResultsButtonLabel?: string;
    /**
     * Callback function in case the "Reset the search" button needs to be displayed.
     */
    onNoResultsButtonClick?: () => void;
}

export const CardGrid: FC<CardGridProps> = ({
    variant,
    gridType,
    loading,
    items,
    pageSize,
    CardComponent,
    noResultsText = "No items found for this search",
    noResultsButtonLabel = "Reset the search",
    onNoResultsButtonClick,
}) => {
    if (!loading && items.length === 0) {
        return (
            <Flex flexDirection="column" alignItems="center" p={4}>
                <Text variant="body1" textAlign="center" mb={4}>
                    {noResultsText}
                </Text>
                {typeof onNoResultsButtonClick === "function" && (
                    <Button onClick={onNoResultsButtonClick}>
                        {noResultsButtonLabel}
                    </Button>
                )}
            </Flex>
        );
    }

    const mapping = {
        narrow: ContainerNarrow,
        wide: ContainerWide,
        wider: ContainerWider,
    };
    const Container = mapping[variant] || ContainerWide;

    return (
        <Container className={`${gridType}-grid`}>
            {items?.map((item) => (
                <LazyLoad
                    key={
                        item.tokenId
                            ? `${item.tokenId}_${item.smartContractAddress}`
                            : item.collectionId
                    }
                    resize
                    offset={100}
                    unmountIfInvisible
                    placeholder={<CardPlaceholder />}
                >
                    <CardComponent {...item} />
                </LazyLoad>
            ))}

            {loading &&
                Array.from({ length: pageSize }, (_, idx) => (
                    <CardPlaceholder key={idx} />
                ))}
        </Container>
    );
};

const ContainerNarrow = styled.div`
    display: flex;
    flex-wrap: wrap;

    > * {
        ${calculateCardSize(5, 24)};
        margin: 24px 12px 0;

        ${media.z`
            ${calculateCardSize(3, 24)};
            `}

        ${media.d`
            ${calculateCardSize(2, 24)};
        `}

        ${media.f`
            ${calculateCardSize(2, 24)};
        `}

        ${media.a`
            ${calculateCardSize(1, 24)};
        `}
    }

    &.small-grid {
        > * {
            ${calculateCardSize(2, 12)};
            margin: 12px 6px 0;

            @media (min-width: 768px) {
                ${calculateCardSize(3, 12)};
            }

            @media (min-width: 1100px) {
                ${calculateCardSize(4, 12)};
            }

            @media (min-width: 1450px) {
                ${calculateCardSize(6, 12)};
            }

            @media (min-width: 1600px) {
                ${calculateCardSize(6, 12)};
            }
        }
    }
`;

const ContainerWide = styled.div`
    display: flex;
    flex-wrap: wrap;

    > * {
        ${calculateCardSize(6, 24)};
        margin: 24px 12px 0;

        ${media.z`
            ${calculateCardSize(4, 24)};
            `}

        ${media.d`
            ${calculateCardSize(3, 24)};
        `}

        ${media.f`
            ${calculateCardSize(2, 24)};
        `}

        ${media.a`
            ${calculateCardSize(1, 24)};
        `}
    }

    &.small-grid {
        > * {
            ${calculateCardSize(2, 12)};
            margin: 12px 6px 0;

            @media (min-width: 768px) {
                ${calculateCardSize(3, 12)};
            }

            @media (min-width: 992px) {
                ${calculateCardSize(4, 12)};
            }

            @media (min-width: 1200px) {
                ${calculateCardSize(6, 12)};
            }

            @media (min-width: 1650px) {
                ${calculateCardSize(8, 12)};
            }
        }
    }
`;

const ContainerWider = styled.div`
    display: flex;
    flex-wrap: wrap;

    > * {
        ${calculateCardSize(3, 24)};
        margin: 86px 12px 0;

        ${media.x`
            ${calculateCardSize(2, 24)};
        `}

        ${media.f`
            ${calculateCardSize(1, 24)};
        `}
    }

    &.small-grid {
        > * {
            ${calculateCardSize(2, 12)};
            margin: 12px 6px 0;

            @media (min-width: 768px) {
                ${calculateCardSize(3, 12)};
            }

            @media (min-width: 992px) {
                ${calculateCardSize(4, 12)};
            }

            @media (min-width: 1200px) {
                ${calculateCardSize(6, 12)};
            }

            @media (min-width: 1650px) {
                ${calculateCardSize(8, 12)};
            }
        }
    }
`;
