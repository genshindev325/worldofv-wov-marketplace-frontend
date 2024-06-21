import {
    BusinessDashboardPageContent,
    BusinessDashboardPageContentProps,
} from "@/components/business/BusinessDashboardPageContent";
import Head from "@/components/Head";
import type { NextPage, NextPageContext } from "next";

const BusinessDashboard: NextPage<BusinessDashboardPageContentProps> = (
    props
) => {
    return (
        <>
            <Head title="Manage your NFTs" />
            <BusinessDashboardPageContent {...props} />
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

export default BusinessDashboard;

// TODO: move config files outside the pages folder and have a single source of truth
const pages: Record<string, Omit<BusinessDashboardPageContentProps, "slug">> = {
    // artemix: {
    //     pointsContractAddress: "0x633cd60DC3D1598503411A2Ea550a23ed36B6e82",
    //     pointsCollectionId: "",
    //     voucherImgUrl: "/img/nft__artemix.png",
    //     pointName: "NFT",
    //     logoUrlLight: "/img/logo__artemix.png",
    //     logoUrlDark: "/img/logo__artemix--white.png",
    //     bannerUrlMobile: "/img/cover-banner.png",
    //     bannerUrlDesktop: "/img/cover-banner.png",
    //     pointsPerVoucher: 10,
    // },
    // mitsuba: {
    //     pointsContractAddress: "0x54b1375BddF4119940A76AF4Fc48Cd58958DAa5D",
    //     pointsCollectionId: "",
    //     voucherImgUrl: "/img/nft__mitsuba.jpg",
    //     pointName: "NFT",
    //     logoUrlLight: "/img/logo__mitsuba.png",
    //     logoUrlDark: "/img/logo__mitsuba--white.png",
    //     bannerUrlMobile: "/img/bg__mitsuba.jpg",
    //     bannerUrlDesktop: "/img/bg__mitsuba.jpg",
    //     pointsPerVoucher: 10,
    // },
    // ufc: {
    //     pointsContractAddress: "0xa810237745b776aeB42181d2097bAa50ACEd7D8a",
    //     pointsCollectionId: "",
    //     voucherImgUrl: "/img/nft__ufc.jpg",
    //     pointName: "Phygital",
    //     logoUrlLight: "/img/logo__ufc.png",
    //     logoUrlDark: "/img/logo__ufc.png",
    //     bannerUrlMobile: "/img/bg__ufc.jpg",
    //     bannerUrlDesktop: "/img/bg__ufc.jpg",
    //     pointsPerVoucher: 10,
    // },
    // vechain2023: {
    //     pointsContractAddress: "0xa542c0875b6f5EBeFe57AA00CA56A4d19904C0b4",
    //     pointsCollectionId: "",
    //     voucherImgUrl: "/img/nft__vechain2023.png",
    //     pointName: "POA NFT",
    //     logoUrlLight: "/img/vechain__logo.png",
    //     logoUrlDark: "/img/vechain__logo--white.png",
    //     bannerUrlMobile: "/img/bg__vechain2023.jpg",
    //     bannerUrlDesktop: "/img/bg__vechain2023.jpg",
    //     pointsPerVoucher: 10,
    // },
    nftloyaltytest: {
        pointsContractAddress: "",
        pointsCollectionId: "",
        vouchersContractAddress: "",
        vouchersCollectionId: "",
        voucherImgUrl: "/img/nft__schecker.png",
        pointName: "Raw Point",
        logoUrlLight: "/img/business_dashboard_raw__logo.png",
        logoUrlDark: "/img/business_dashboard_raw__logo.png",
        bannerUrlMobile: "/img/schecker__banner--desktop.png",
        bannerUrlDesktop: "/img/schecker__banner--desktop.png",
        pointsPerVoucher: 10,
    },
    scheckter: {
        pointsContractAddress: "0x5D431bc82b67C070639E747c50A13CfF15403F18",
        pointsCollectionId: "c6187b87-6bf8-47d4-967f-66eee0cb163c",
        vouchersContractAddress: "0x607007c278A6c87f2f08d0846cb053cD80279ed5",
        vouchersCollectionId: "b8cbb461-fae5-4831-abb4-15db0613b21d",
        voucherImgUrl: "/img/business_dashboard_raw__voucher.jpg",
        pointName: "RAW",
        logoUrlLight: "/img/business_dashboard_raw__logo.png",
        logoUrlDark: "/img/business_dashboard_raw__logo.png",
        bannerUrlMobile: "/img/schecker__banner--desktop.png",
        bannerUrlDesktop: "/img/schecker__banner--desktop.png",
        transferToAddress: "0x71BC12A510652bDfCB5Dd9f3DFA41059E3425cCB",
        pointsPerVoucher: 10,
    },
    "wine-test": {
        pointsContractAddress: "0x32abb85A818E5D1eBA42F1288D34976EB6DccBdE",
        pointsCollectionId: "6496d83f-f11d-476a-8a11-aab1a85bdcf5",
        vouchersContractAddress: "0x0B1a560406D21e375CBEBE84c3472c2Fa8218694",
        vouchersCollectionId: "482780fc-edc2-4ad7-9100-4f7ed974cb07",
        voucherImgUrl: "/img/business_montezemolo_voucher_image.jpg",
        pointName: "",
        bannerUrlMobile: "/img/business_montezemolo_banner.jpg",
        bannerUrlDesktop: "/img/business_montezemolo_banner.jpg",
        pointsPerVoucher: 10,
    },
    Sweat1000: {
        pointsContractAddress: "0xC40BC08aF312ca03592a54F96fB34c10bd10Cb37",
        pointsCollectionId: "1e419f5c-212a-4634-a1b2-3923469aee16",
        vouchersContractAddress: "0x174871C02c042ae2e23181b9F3beC7975A544cdA",
        vouchersCollectionId: "8260b3ea-64c1-4f8d-8810-11179eb8bfca",
        voucherImgUrl: "/img/business_sweat_1000_voucher.png",
        pointName: "",
        bannerUrlMobile: "/img/business_sweat_1000_banner.png",
        bannerUrlDesktop: "/img/business_sweat_1000_banner.png",
        pointsPerVoucher: 20,
    },
};
