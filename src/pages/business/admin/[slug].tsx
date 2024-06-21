import {
    BusinessAdminPageContent,
    BusinessAdminPageContentProps,
} from "@/components/business/BusinessAdminPageContent";
import Head from "@/components/Head";
import type { NextPage, NextPageContext } from "next";

const BusinessAdmin: NextPage<BusinessAdminPageContentProps> = (props) => {
    return (
        <>
            <Head title="Business Admin" />
            <BusinessAdminPageContent {...props} />
        </>
    );
};

export async function getServerSideProps(context: NextPageContext) {
    const slug = context.query?.slug as string;

    if (pages[slug] == null) {
        return { redirect: { destination: "/" } };
    }

    return {
        props: {
            ...pages[slug],
            slug,
        },
    };
}

export default BusinessAdmin;

const pages: Record<string, Omit<BusinessAdminPageContentProps, "slug">> = {
    scheckter: {
        pointsContractAddress: "0x5D431bc82b67C070639E747c50A13CfF15403F18",
        pointsCollectionId: "c6187b87-6bf8-47d4-967f-66eee0cb163c",
        vouchersContractAddress: "0x607007c278A6c87f2f08d0846cb053cD80279ed5",
        vouchersCollectionId: "b8cbb461-fae5-4831-abb4-15db0613b21d",
        logoUrlLight: "/img/business_dashboard_raw__logo.png",
        logoUrlDark: "/img/business_dashboard_raw__logo.png",
        bannerUrlMobile: "/img/schecker__banner--desktop.png",
        bannerUrlDesktop: "/img/schecker__banner--desktop.png",
        businessAddress: "0x71BC12A510652bDfCB5Dd9f3DFA41059E3425cCB",
    },
    // Sweat1000: {
    //     smartContractAddress: "0xC40BC08aF312ca03592a54F96fB34c10bd10Cb37",
    //     collectionId: "1e419f5c-212a-4634-a1b2-3923469aee16",
    //     cooldownContractAddress: "0x174871C02c042ae2e23181b9F3beC7975A544cdA",
    //     cooldownCollectionId: "8260b3ea-64c1-4f8d-8810-11179eb8bfca",
    //     bannerUrlMobile: "/img/business_sweat_1000_banner.png",
    //     bannerUrlDesktop: "/img/business_sweat_1000_banner.png",
    // },
};
