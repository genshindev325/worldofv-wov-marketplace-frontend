import { useGridType } from "@/hooks/useGridType";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { usePageSize } from "@/utils/pageTabs";
import { useContext, useEffect, useMemo } from "react";
import { TokenBatchSelectContext } from "../../providers/BatchSelectProvider";
import { useProfile } from "../../providers/ProfileProvider";
import { BatchSelectCard, BatchSelectToolbar } from "../batch-actions";
import { Box } from "../common/Box";
import { CardGrid } from "../common/CardGrid";
import { Flex } from "../common/Flex";
import { Pagination } from "../common/Pagination";
import { ScrollTop } from "../common/ScrollTop";
import PillsNav, { NavItemProps } from "../PillsNav";
import { ProfileFilters } from "./ProfileFilters";

interface ProfileAuctionsProps {
    onLoad: (count: number) => void;
}

export default function ProfileAuctions({ onLoad }: ProfileAuctionsProps) {
    const { selectedTab, setSelectedTab, page, setPage } = useProfile();
    const gridType = useGridType();
    const pageSize = usePageSize();

    const created = useProfileQuery("auctions-created", pageSize);
    const toSettle = useProfileQuery("auctions-to-settle", pageSize);

    const currentTabData = useMemo(
        () => (selectedTab.value === "auctions-created" ? created : toSettle),
        [created, selectedTab.value, toSettle]
    );

    const { setSelecting } = useContext(TokenBatchSelectContext);

    // Pass count up to parent component on load
    useEffect(() => {
        if (typeof created.total === "number") onLoad(created.total!);
    }, [created.total, onLoad]);

    const tabs = useMemo(
        () => [
            {
                label: "Created",
                value: "auctions-created",
                count: created?.total,
            },
            {
                label: "To Settle",
                value: "auctions-to-settle",
                count: toSettle?.total ?? 0,
            },
        ],
        [created?.total, toSettle?.total]
    );

    const currentTab = useMemo(
        () => tabs.find((t) => t.value === selectedTab.value) || tabs[0],
        [selectedTab.value, tabs]
    );

    const handleTabChange = (tab: NavItemProps) => {
        setSelecting(false);
        setSelectedTab(tabs.find((t) => t.value === tab.value)!);
    };

    return (
        <ScrollTop>
            {(scrollTop) => (
                <>
                    <Flex flexDirection="column" columnGap={3}>
                        <PillsNav
                            value={currentTab.label}
                            items={tabs}
                            onChange={handleTabChange}
                        />
                        <ProfileFilters />
                        <BatchSelectToolbar
                            selectionContext={TokenBatchSelectContext}
                            items={currentTabData?.items}
                        />
                        <Box overflow="auto" zIndex={1}>
                            <CardGrid
                                variant="narrow"
                                gridType={gridType}
                                CardComponent={BatchSelectCard}
                                loading={currentTabData?.loading}
                                items={currentTabData?.items}
                                pageSize={pageSize}
                            />
                        </Box>
                        <Pagination
                            currentPage={page}
                            pageSize={pageSize}
                            totalCount={currentTabData?.total!}
                            onPageChange={(newPage) => {
                                setPage(newPage);
                                scrollTop();
                            }}
                        />
                    </Flex>
                </>
            )}
        </ScrollTop>
    );
}
