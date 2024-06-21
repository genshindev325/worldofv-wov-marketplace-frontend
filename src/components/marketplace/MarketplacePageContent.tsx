import { Card } from "@/components/cards/CardV2";
import { Box } from "@/components/common/Box";
import { useGridType } from "@/hooks/useGridType";
import styled from "styled-components";
import { useMarketplaceQuery } from "../../hooks/useMarketplaceQuery";
import { useMarketplace } from "../../providers/MarketplaceProvider";
import common from "../../styles/_common";
import { CardGrid } from "../common/CardGrid";
import { Pagination } from "../common/Pagination";
import { ScrollTop } from "../common/ScrollTop";
import { Spacer } from "../common/Spacer";
import MarketplaceFilters from "./MarketplaceFilters";

// TODO: this should be a component
const { containerFluid } = common;

const PAGE_SIZE = 24;

export const MarketplacePageContent = () => {
    const { page, setPage, resetToDefaults } = useMarketplace();
    const gridType = useGridType();
    const { loading, items, total } = useMarketplaceQuery(PAGE_SIZE);

    return (
        <ScrollTop>
            {(scrollTop) => (
                <Box py={4}>
                    <ContainerFluid>
                        <MarketplaceFilters />
                        <Spacer y size={3} />
                        <CardGrid
                            variant="wide"
                            gridType={gridType}
                            CardComponent={Card}
                            loading={loading}
                            items={items}
                            pageSize={PAGE_SIZE}
                            onNoResultsButtonClick={resetToDefaults}
                        />
                        <Spacer y size={5} />
                        <Pagination
                            totalCount={total}
                            pageSize={PAGE_SIZE}
                            currentPage={page}
                            onPageChange={(newPage) => {
                                setPage(newPage);
                                scrollTop();
                            }}
                        />
                    </ContainerFluid>
                </Box>
            )}
        </ScrollTop>
    );
};

const ContainerFluid = styled.div`
    ${containerFluid};
`;
