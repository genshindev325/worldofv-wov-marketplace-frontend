import { Box } from "@/components/common/Box";
import { CardGrid } from "@/components/common/CardGrid";
import { Pagination } from "@/components/common/Pagination";
import { ScrollTop } from "@/components/common/ScrollTop";
import { Spacer } from "@/components/common/Spacer";
import { PhygitalsCard } from "@/components/phygitals/PhygitalsCard";
import { usePhygitalsQuery } from "@/hooks/usePhygitalsQuery";
import { usePhygitals } from "@/providers/PhygitalsProvider";
import common from "@/styles/_common";
import styled from "styled-components";
import { PhygitalsFilters } from "./PhygitalsFilters";
import { PhygitalsHeader } from "./PhygitalsHeader";

// TODO: this should be a component
const { containerFluid } = common;

const PAGE_SIZE = 9;

export const PhygitalsPageContent = () => {
    const { page, setPage, resetToDefaults } = usePhygitals();
    const { loading, items, total } = usePhygitalsQuery(PAGE_SIZE);

    return (
        <ScrollTop>
            {(scrollTop) => (
                <Box py={4}>
                    <ContainerFluid>
                        <PhygitalsFilters />
                        <Spacer y size={3} />
                        <Box
                            display={{ _: "none", d: "block" }}
                            pt={{ _: 0, d: 5 }}
                            pb={{ _: 0, d: 3 }}
                        >
                            <PhygitalsHeader />
                        </Box>
                        <CardGrid
                            variant="wider"
                            gridType="large"
                            CardComponent={PhygitalsCard}
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
