import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/router";
import { useContext, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import { useBurnMintingQuery } from "../../hooks/useBurnMintingQuery";
import { useGridType } from "../../hooks/useGridType";
import { TokenBatchSelectContext } from "../../providers/BatchSelectProvider";
import { BatchSelectCard, BatchSelectToolbar } from "../batch-actions";
import { Alert } from "../common/Alert";
import { CardGrid } from "../common/CardGrid";
import { GridTypeSelector } from "../common/GridTypeSelector";
import { Pagination } from "../common/Pagination";
import { ScrollTop } from "../common/ScrollTop";
import { Spacer } from "../common/Spacer";
import { SearchInput } from "../FormInputs/SearchInput";
import { BurnMintingContext } from "./BurnMintingContext";

export default function BurnMintingSelect() {
    const theme = useTheme();
    const router = useRouter();
    const { collection } = useContext(BurnMintingContext);

    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");

    const gridType = useGridType();
    const isBigScreen = useMediaQuery(`(min-width: ${theme.breakpoints.z})`);

    const pageSize = useMemo(() => {
        if (isBigScreen && gridType === "small") {
            return 16;
        }
        // if (isBigScreen && gridType === "large") {
        //     return 10;
        // }
        return 12;
    }, [gridType, isBigScreen]);

    const { loading, items, total } = useBurnMintingQuery(
        pageSize,
        page,
        query
    );

    return (
        <ScrollTop>
            {(scrollTop) => (
                <>
                    <Alert
                        variant="warn"
                        title="Selected NFTs will be burned."
                    />
                    <Spacer y size={4} />
                    <SearchInput
                        value={query}
                        placeholder="Search by Title"
                        onSearch={setQuery}
                    />
                    <Spacer y size={3} />
                    <Toolbar>
                        <BatchSelectToolbar
                            selectionContext={TokenBatchSelectContext}
                        />
                        <GridTypeSelector />
                    </Toolbar>
                    <CardGrid
                        variant="wide"
                        gridType={gridType}
                        CardComponent={BatchSelectCard}
                        loading={loading}
                        items={items}
                        pageSize={pageSize}
                        noResultsText="You don't own any NFT from this collection."
                        noResultsButtonLabel="Buy Tickets"
                        onNoResultsButtonClick={() => {
                            const slug =
                                collection!.customUrl ||
                                collection!.smartContractAddress!;
                            router.push(`/collection/${slug}?tab=onsale`);
                        }}
                    />
                    <Spacer y size={5} />
                    <Pagination
                        totalCount={total}
                        pageSize={pageSize}
                        currentPage={page}
                        onPageChange={(newPage) => {
                            setPage(newPage);
                            scrollTop();
                        }}
                    />
                </>
            )}
        </ScrollTop>
    );
}

const Toolbar = styled.div`
    display: flex;
    flex-direction: row;

    > :first-child {
        flex: 1;
    }

    > :last-child {
        margin-left: 16px;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.s}) {
        flex-direction: column;

        > :last-child {
            margin-top: 16px;
            margin-left: 0;
        }
    }
`;
