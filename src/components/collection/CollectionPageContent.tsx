import { useGridType } from "@/hooks/useGridType";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { CollectionType } from "../../generated/graphql";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { TokenBatchSelectContext } from "../../providers/BatchSelectProvider";
import {
    CollectionContext,
    useCollection,
} from "../../providers/CollectionProvider";
import { useGlobalConfig } from "../../providers/GlobalConfigProvider";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import {
    addTabsCount,
    filterByItemType,
    usePageSize,
} from "../../utils/pageTabs";
import { BatchSelectCard, BatchSelectToolbar } from "../batch-actions";
import { CardGrid } from "../common/CardGrid";
import { Flex } from "../common/Flex";
import { Pagination } from "../common/Pagination";
import { ScrollTop } from "../common/ScrollTop";
import { Spacer } from "../common/Spacer";
import EventsHistory from "../History/EventsHistory";
import PillsNav, { NavItemProps } from "../PillsNav";
import TabsNav from "../TabsNav";
import { CollectionActions } from "./CollectionActions";
import { CollectionCover } from "./CollectionCover";
import CollectionFilters from "./CollectionFilters";
import { CollectionInfo } from "./CollectionInfo";
import CollectionStats from "./CollectionStats";

const { media } = mixins;
const { containerFluid } = common;

const MOBILE_TABS = [
    {
        id: "items",
        label: "Items",
        value: ["all", "onsale", "collected", "staked"],
    },
    {
        id: "stats",
        label: "Stats",
        value: "stats",
    },
    {
        id: "sales",
        label: "Sales",
        value: "sales",
    },
];

export const CollectionPageContent = () => {
    const router = useRouter();
    const globalConfig = useGlobalConfig();
    const theme = useTheme();
    const gridType = useGridType();

    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.m})`);

    const tokenBatchSelectContext = useContext(TokenBatchSelectContext);
    const { tabs, selectedTab, setSelectedTab, page, setPage, collection } =
        useCollection();

    const [mobileTab, setMobileTab] = useState<NavItemProps>(MOBILE_TABS[0]);

    const resetSelectionTarget = () => {
        tokenBatchSelectContext.setSelecting(false);
    };

    // Reset batch selection on collection/tab change
    useEffect(() => {
        resetSelectionTarget();
    }, [router.query?.id, selectedTab.label, mobileTab.id]);

    // Reset batch selection when going to the initial collection page
    // (router.query.tab === undefined)
    useEffect(() => {
        if (router.query?.tab == null && selectedTab.label === "All") {
            resetSelectionTarget();
        }
    }, [router.query?.tab, selectedTab.label]);

    const pageSize = usePageSize();

    const all = useCollectionQuery("all", pageSize);
    const onsale = useCollectionQuery("onsale", pageSize);
    const collected = useCollectionQuery("collected", pageSize);
    const staked = useCollectionQuery("staked", pageSize);

    const data = { all, onsale, collected, staked };

    const curTabData = filterByItemType(data, selectedTab.value)!;

    return (
        <div id="collection">
            <CollectionCover />
            <Container>
                <InnerContainer>
                    <aside>
                        <CollectionInfo />
                        <CollectionActions />
                    </aside>

                    <Container2>
                        {isSmallScreen &&
                            // There is a bug on the history query when collecion.type === "MARKETPLACE"
                            // Also they don't have stats so we filter our the tabs alltogher ans show only the items
                            collection.type !== CollectionType.Marketplace && (
                                <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    mb={3}
                                >
                                    <TabsNav
                                        items={MOBILE_TABS}
                                        value={mobileTab.label}
                                        onChange={setMobileTab}
                                    />
                                </Flex>
                            )}
                        {((isSmallScreen && mobileTab.id === "stats") ||
                            !isSmallScreen) && <CollectionStats />}
                        {isSmallScreen && mobileTab.id === "sales" && (
                            <EventsHistory
                                route="collection"
                                context={CollectionContext}
                            />
                        )}
                        {((isSmallScreen && mobileTab.id === "items") ||
                            !isSmallScreen) && (
                            <ScrollTop>
                                {(scrollTop) => (
                                    <Flex flexDirection="column" columnGap={3}>
                                        <StyledPillsNav
                                            items={(globalConfig.countersOn
                                                ? addTabsCount(data, tabs)
                                                : tabs
                                            )
                                                // There is a bug on the history query when collecion.type === "MARKETPLACE"
                                                // so we filter out the tab for now
                                                .filter((t) =>
                                                    t.value === "sales"
                                                        ? collection.type !==
                                                          CollectionType.Marketplace
                                                        : true
                                                )
                                                // we filter out the sales on small screen size because we show it in the mobile tab
                                                .filter((t) =>
                                                    t.value === "sales" &&
                                                    isSmallScreen
                                                        ? false
                                                        : true
                                                )}
                                            value={selectedTab.label}
                                            onChange={setSelectedTab}
                                        />
                                        {selectedTab.label !== "Sales" ? (
                                            <div>
                                                <CollectionFilters />
                                                <Spacer y size={3} />
                                                <BatchSelectToolbar
                                                    selectionContext={
                                                        TokenBatchSelectContext
                                                    }
                                                    items={curTabData.items}
                                                />
                                                <CardGrid
                                                    variant="narrow"
                                                    gridType={gridType}
                                                    CardComponent={
                                                        BatchSelectCard
                                                    }
                                                    loading={curTabData.loading}
                                                    items={curTabData.items}
                                                    pageSize={pageSize}
                                                />
                                                <Spacer y size={5} />
                                                <Pagination
                                                    totalCount={
                                                        curTabData.total
                                                    }
                                                    pageSize={pageSize}
                                                    currentPage={page}
                                                    onPageChange={(newPage) => {
                                                        setPage(newPage);
                                                        scrollTop();
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <EventsHistory
                                                route="collection"
                                                context={CollectionContext}
                                            />
                                        )}
                                    </Flex>
                                )}
                            </ScrollTop>
                        )}
                    </Container2>
                </InnerContainer>
            </Container>
        </div>
    );
};

const Container = styled.div`
    position: relative;
    z-index: 3;
    padding: 32px 0;

    ${media.t`
        padding-top: 0;
    `}

    ${media.m`
        padding: 0 0 64px;
    `}
`;

const InnerContainer = styled.div`
    ${containerFluid};

    display: flex;
    align-items: flex-start;

    ${media.t`
        display: block;
    `}

    aside {
        flex-shrink: 0;
        width: 256px;
        margin-top: -145px;

        position: relative;

        ${media.t`
            position: relative;
            top: 0;
            width: 100%;
            margin: 0 0 48px;
        `}
        ${media.m`
            margin: 0 0 20px;
        `}
    }
`;

const Container2 = styled.div`
    flex: 0 0 calc(100% - 256px);
    width: calc(100% - 256px);
    padding-left: 64px;

    ${media.x`
        padding-left: 32px;
    `}

    ${media.t`
        width: 100%;
        padding-left: 0;
    `}
`;

const StyledPillsNav = styled(PillsNav)`
    margin-bottom: 0;
    width: calc(100% - 40px - 40px - 12px);
    overflow-x: auto;
    width: 100%;
`;
