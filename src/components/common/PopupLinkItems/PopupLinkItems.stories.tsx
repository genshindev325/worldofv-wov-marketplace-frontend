import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ThemeButton } from "../../Header/ThemeButton";
import Icon from "../../Icon";
import { Box } from "../Box";
import { PopupLinkItems } from "./PopupLinkItems";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/PopupLinkItems",
    component: PopupLinkItems,
    argTypes: {},
} as ComponentMeta<typeof PopupLinkItems>;

const items = [
    {
        label: "Dashboard",
        icon: () => <Icon icon="image" />,
        href: "/dashboard",
        passHref: true,
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
    {
        label: "With Theme Component",
        Comp: () => <ThemeButton variant="switch" />,
    },
    {
        label: "With Click Action",
        onClick: () => {
            console.log("Clicked");
        },
    },
    {
        Comp: () => <p>I&apos;m just a component</p>,
    },
];

export const Default: ComponentStory<typeof PopupLinkItems> = (args) => (
    <Box p={4}>
        <PopupLinkItems items={items} />
    </Box>
);
