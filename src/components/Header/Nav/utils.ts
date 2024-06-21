import { PopupLinkItem } from "../../common/PopupLinkItems";

interface NavItem {
    anchor: string;
    isNew?: boolean;
    items: PopupLinkItem[];
}

export const getNavItems = (loggedIn: boolean): NavItem[] => [
    {
        anchor: "Explore",
        isNew: true,
        items: [
            {
                label: "Marketplace",
                href: "/marketplace",
                passHref: true,
            },
            {
                label: "Collections",
                href: "/collections",
                passHref: true,
            },
            {
                label: "Brands",
                href: "/brands",
                passHref: true,
            },
            {
                label: "Phygitals",
                href: "/phygitals",
                passHref: true,
            },
        ],
    },
    {
        anchor: "Resources",
        // isNew: true,
        items: [
            {
                label: "Top Collections",
                href: "/trending-collections",
                passHref: true,
            },
            {
                label: "Top Buyers",
                href: "/top-buyers",
                passHref: true,
            },
            {
                label: "PFP Launchpad",
                href: "/launchpad",
                passHref: true,
            },
            {
                label: "Partners",
                href: "/partners",
                passHref: true,
            },
        ],
    },
    {
        anchor: "Genesis",
        items: [
            {
                label: "Dashboard",
                href: loggedIn ? "/dashboard" : "/login",
                passHref: true,
            },
            {
                label: "Buy Wov",
                href: "https://vexchange.io/swap?outputCurrency=0x170F4BA8e7ACF6510f55dB26047C83D13498AF8A",
                passHref: true,
                target: "_blank",
            },
            {
                label: "Stake WoV",
                href: "https://staking.worldofv.art/#/",
                passHref: true,
            },
            {
                label: "Genesis Collection",
                href: "/collection/genesis",
                passHref: true,
            },
            {
                label: "Special Collection",
                href: "/collection/genesis-special",
                passHref: true,
            },
        ],
    },
    {
        anchor: "Playground",
        // isNew: true,
        items: [
            // {
            //     label: "Burning",
            //     href: "/playground/burning/shark-gang",
            //     passHref: true,
            // },
            {
                label: "MVA Lottery",
                href: "/playground/lottery/mva-lottery",
                passHref: true,
            },
        ],
    },
];
