import { useGridType } from "@/hooks/useGridType";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useProfileCollectionsQuery } from "../../hooks/useProfileCollectionsQuery";
import { useProfileQuery } from "../../hooks/useProfileQuery";
import {
    OfferBatchSelectContext,
    TokenBatchSelectContext,
} from "../../providers/BatchSelectProvider";
import { useGlobalConfig } from "../../providers/GlobalConfigProvider";
import { ProfileContext, useProfile } from "../../providers/ProfileProvider";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import { UserLandingTabEnum } from "../../types/UserData";
import {
    addTabsCount,
    filterByItemType,
    usePageSize,
} from "../../utils/pageTabs";
import { BatchSelectCard, BatchSelectToolbar } from "../batch-actions";
import CollectionCard from "../CollectionCard";
import { CardGrid } from "../common/CardGrid";
import { Flex } from "../common/Flex";
import { Pagination } from "../common/Pagination";
import { ScrollTop } from "../common/ScrollTop";
import { Spacer } from "../common/Spacer";
import EventsHistory from "../History/EventsHistory";
import PillsNav from "../PillsNav";
import { ProfileActions } from "./ProfileActions";
import ProfileAuctions from "./ProfileAuctions";
import { ProfileCover } from "./ProfileCover";
import { ProfileFilters } from "./ProfileFilters";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileOffers } from "./ProfileOffers";

const { media } = mixins;
const { containerFluid } = common;

export const ProfilePageContent = () => {
    const router = useRouter();
    const globalConfig = useGlobalConfig();
    const { user, tabs, selectedTab, setSelectedTab, page, setPage } =
        useProfile();
    const gridType = useGridType();

    // Update offers count on data load
    const [offersCount, setOffersCount] = useState<number | undefined>();
    const [auctionsCount, setAuctionsCount] = useState<number | undefined>();

    const tokenBatchSelectContext = useContext(TokenBatchSelectContext);
    const offerBatchSelectContext = useContext(OfferBatchSelectContext);

    // If we add ID to NavItemProps and PillsNav we might be able to remove this
    const items = useMemo(
        () =>
            tabs.map(({ value, ...tab }) => ({
                value: Array.isArray(value) ? value[0] : value,
                ...tab,
            })),
        [tabs]
    );

    const resetSelectionTarget = () => {
        tokenBatchSelectContext.setSelecting(false);
        offerBatchSelectContext.setSelecting(false);
    };

    // Reset batch selection on profile/tab change
    useEffect(() => {
        resetSelectionTarget();
        // eslint-disable-next-line
    }, [router.query?.identifier?.[0], selectedTab.id]);

    // Reset batch selection and offer count when going to the initial profile page
    // (router.query.tab === undefined)
    useEffect(() => {
        if (router.query?.tab == null && selectedTab.id === user.landingTab) {
            resetSelectionTarget();
        }
        if (router.query?.tab == null) {
            setOffersCount(undefined);
            setAuctionsCount(undefined);
        }
        // eslint-disable-next-line
    }, [router.query?.tab, selectedTab.id, user.landingTab]);

    const pageSize = usePageSize();

    const created = useProfileQuery("created", pageSize);
    const onsale = useProfileQuery("onsale", pageSize);
    const collected = useProfileQuery("collected", pageSize);
    const staked = useProfileQuery("staked", pageSize);
    const collection = useProfileCollectionsQuery("collection", pageSize);

    // Only list your tab's name if you want to display a counter or a symbol next to it.
    const data = {
        created,
        onsale,
        collected,
        staked,
        collection,
        ["offers-received"]: { total: offersCount ?? "?" },
        ["auctions-created"]: { total: auctionsCount ?? "?" },
    };

    const curTabData = filterByItemType(data, selectedTab.value)!;

    const isOffersTab = selectedTab.id! === UserLandingTabEnum.Offers;
    const isAuctionTab = selectedTab.id! === UserLandingTabEnum.OnAuction;
    const isActivityTab = selectedTab.id! === UserLandingTabEnum.Activity;
    const isCollectionTab = selectedTab.id! === UserLandingTabEnum.Collections;

    return (
        <div id="profile">
            <ProfileCover />
            <Container>
                <InnerContainer>
                    <aside>
                        <ProfileInfo />
                        <ProfileActions />
                    </aside>
                    <StyledScrollTop>
                        {(scrollTop) => (
                            <Container2>
                                <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <StyledPillsNav
                                        items={
                                            globalConfig.countersOn
                                                ? addTabsCount(data, items)
                                                : items
                                        }
                                        value={selectedTab.label}
                                        onChange={setSelectedTab}
                                    />
                                </Flex>
                                <Spacer y size={3} />
                                {!isAuctionTab &&
                                    !isOffersTab &&
                                    !isActivityTab &&
                                    !isCollectionTab && (
                                        <>
                                            <ProfileFilters />
                                            <Spacer y size={3} />
                                        </>
                                    )}
                                {!isAuctionTab &&
                                    !isOffersTab &&
                                    !isActivityTab && (
                                        <>
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
                                                    isCollectionTab
                                                        ? CollectionCard
                                                        : BatchSelectCard
                                                }
                                                loading={curTabData.loading}
                                                items={curTabData.items}
                                                pageSize={pageSize}
                                            />
                                            <Spacer y size={5} />
                                            <Pagination
                                                totalCount={curTabData.total}
                                                pageSize={pageSize}
                                                currentPage={page}
                                                onPageChange={(newPage) => {
                                                    setPage(newPage);
                                                    scrollTop();
                                                }}
                                            />
                                        </>
                                    )}
                                {isOffersTab && (
                                    <ProfileOffers
                                        onLoad={(count) => {
                                            setOffersCount(count);
                                        }}
                                    />
                                )}
                                {isAuctionTab && (
                                    <ProfileAuctions
                                        onLoad={(count) => {
                                            setAuctionsCount(count);
                                        }}
                                    />
                                )}
                                {isActivityTab && (
                                    <EventsHistory
                                        route="profile"
                                        context={ProfileContext}
                                    />
                                )}
                            </Container2>
                        )}
                    </StyledScrollTop>
                </InnerContainer>
            </Container>
        </div>
    );
};

const Container = styled.div`
    position: relative;
    z-index: 3;
    padding: 80px 0;

    ${media.t`
        padding-top: 0px;
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
        margin-top: -190px;

        position: sticky;
        top: 120px;

        ${media.t`
            position: relative;
            top: 0;
            width: 100%;
            margin: -32px 0 8px;
        `}
    }
`;

const Container2 = styled.div`
    flex: 0 0 calc(100% - 256px);
    // width: calc(100% - 256px);
    padding-left: 40px;

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
    //width: calc(100% - 40px - 40px - 12px);
    width: 100%;
    overflow-x: auto;
`;

const StyledScrollTop = styled(ScrollTop)`
    overflow: hidden;
`;
