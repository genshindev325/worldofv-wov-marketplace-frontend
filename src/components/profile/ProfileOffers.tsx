import { FC, useContext, useEffect, useMemo, useState } from "react";
import { Grid } from "../../components/common/Grid";
import { UserOfferType } from "../../generated/graphql";
import { useQueryGetOffersForUser } from "../../hooks/useQueryGetOffersForUser";
import { OfferBatchSelectContext } from "../../providers/BatchSelectProvider";
import { useProfile } from "../../providers/ProfileProvider";
import { IOfferData, OfferData } from "../../types/OfferData";
import { BatchSelectToolbar } from "../batch-actions";
import { Box } from "../common/Box";
import { Pagination } from "../common/Pagination";
import { ScrollTop } from "../common/ScrollTop";
import OfferList from "../OfferList";
import PillsNav, { NavItemProps } from "../PillsNav";

interface ProfileOffersProps {
    onLoad: (count: number) => void;
}

export const ProfileOffers: FC<ProfileOffersProps> = ({ onLoad }) => {
    const { user, selectedTab, setSelectedTab } = useProfile();

    const [page, setPage] = useState(1);
    const perPage = 20;

    const [activeIncomingOffers, refreshIncomingOffers, isValidatingIncoming] =
        useQueryGetOffersForUser(user.address, UserOfferType.Received, {
            page,
            perPage,
        });
    const [activeOutgoingOffers, refreshOutgoingOffers, isValidatingOutgoing] =
        useQueryGetOffersForUser(user.address, UserOfferType.Created, {
            page,
            perPage,
        });

    const { setSelecting } = useContext(OfferBatchSelectContext);

    // Pass count up to parent component on load
    useEffect(() => {
        if (!activeIncomingOffers) return;
        onLoad(activeIncomingOffers.meta.total!);
    }, [onLoad, activeIncomingOffers]);

    const tabs = useMemo(
        () => [
            {
                label: "Received",
                value: "offers-received",
                Component: () => (
                    <OfferList
                        offers={activeIncomingOffers?.offers as IOfferData[]}
                        refreshOffers={refreshIncomingOffers}
                        isValidating={isValidatingIncoming}
                        profileData={user}
                    />
                ),
                count: activeIncomingOffers?.meta?.total ?? 0,
            },
            {
                label: "Made",
                value: "offers-made",
                Component: () => (
                    <OfferList
                        offers={activeOutgoingOffers?.offers as IOfferData[]}
                        refreshOffers={refreshOutgoingOffers}
                        hideInitiator
                        isValidating={isValidatingOutgoing}
                        profileData={user}
                    />
                ),
                count: activeOutgoingOffers?.meta?.total ?? 0,
            },
        ],
        [
            activeIncomingOffers?.meta?.total,
            activeIncomingOffers?.offers,
            activeOutgoingOffers?.meta?.total,
            activeOutgoingOffers?.offers,
            isValidatingIncoming,
            isValidatingOutgoing,
            refreshIncomingOffers,
            refreshOutgoingOffers,
            user,
        ]
    );

    const currentTab = useMemo(
        () => tabs.find((t) => t.value === selectedTab.value) || tabs[0],
        [selectedTab.value, tabs]
    );

    const handleTabChange = (tab: NavItemProps) => {
        setSelecting(false);
        setSelectedTab(tabs.find((t) => t.value === tab.value)!);
    };

    const activeOffers = useMemo(() => {
        const items =
            currentTab.value === "offers-received"
                ? activeIncomingOffers
                : activeOutgoingOffers;

        return {
            meta: items?.meta,
            offers: items?.offers?.map((i: any) => new OfferData(i)),
        };
    }, [activeIncomingOffers, activeOutgoingOffers, currentTab.value]);

    return (
        <ScrollTop>
            {(scrollTop) => (
                <>
                    <Grid gridRowGap={3}>
                        <PillsNav
                            value={currentTab.label}
                            items={tabs}
                            onChange={handleTabChange}
                        />

                        <BatchSelectToolbar
                            selectionContext={OfferBatchSelectContext}
                            items={activeOffers?.offers}
                        />
                        <Box style={{ overflow: "auto", zIndex: 1 }}>
                            <currentTab.Component />
                        </Box>
                        <Pagination
                            currentPage={page}
                            pageSize={perPage}
                            totalCount={activeOffers?.meta?.total!}
                            onPageChange={(newPage) => {
                                setPage(newPage);
                                scrollTop();
                            }}
                        />
                    </Grid>
                </>
            )}
        </ScrollTop>
    );
};
