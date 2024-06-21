import React from "react";
import styled from "styled-components";
import mixins from "../../../../styles/_mixins";
import calculateCardSize from "../../../../utils/calculateCardSize";
import { Box } from "../../../common/Box";
import { Pagination } from "../../../common/Pagination";
import { ScrollTop } from "../../../common/ScrollTop";
import { Spacer } from "../../../common/Spacer";
import { Text } from "../../../common/Text";
import { MissingToken, SetCount, useDashBoard } from "../../DashBoardProvider";
import GridCard from "./GridCard";

const { media } = mixins;

interface DashboardGridProps {
    isOpen: boolean;
    set: string;
    tokens: any;
    count: SetCount;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
    isOpen,
    set,
    tokens,
    count,
}) => {
    const [page, setPage] = React.useState(1);
    const { setSelected } = useDashBoard();
    React.useEffect(() => {
        setSelected({ page, selectedSet: set });
    }, [page, setSelected, set, isOpen]);

    return tokens && isOpen ? (
        <ScrollTop>
            {(scrollTop) => (
                <Box py={5}>
                    <Text variant="bodyBold2" textAlign="center" color="text">
                        To unlock the {set} set you need to get{" "}
                        {(count.total as number) - (count.owned as number)} out
                        of {tokens.meta.total} missing{" "}
                        {tokens.meta.total === 1 ? "card" : "cards"}:{" "}
                    </Text>
                    <Spacer y size={2} />
                    <GridContainer>
                        {tokens.tokens.map((token: MissingToken) => (
                            <GridCard
                                key={token.name}
                                token={token}
                                set={set}
                            />
                        ))}
                    </GridContainer>
                    <Spacer y size={5} />
                    <Pagination
                        totalCount={tokens.meta.total}
                        pageSize={6}
                        currentPage={page}
                        onPageChange={(newPage) => {
                            setPage(newPage);
                            scrollTop();
                        }}
                    />
                </Box>
            )}
        </ScrollTop>
    ) : null;
};

// TODO: use GridCard component instead (for consistency). Modify said component
// if necessary
const GridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 4px;
    // margin: 0 -10px;

    > * {
        ${calculateCardSize(6, 24)};
        margin: 24px 12px 0;

        ${media.z`
            ${calculateCardSize(6, 24)};
            `}

        ${media.d`
            ${calculateCardSize(3, 24)};
        `}

        ${media.f`
            ${calculateCardSize(3, 24)};
        `}

        ${media.a`
            ${calculateCardSize(2, 24)};
        `}
    }
`;

export default DashboardGrid;
