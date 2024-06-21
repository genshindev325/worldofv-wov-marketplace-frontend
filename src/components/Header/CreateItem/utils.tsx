import { Tb3DCubeSphere } from "react-icons/tb";
import { PopupLinkItem } from "../../common/PopupLinkItems";
import Icon from "../../Icon";

export const getCreateItems = (): PopupLinkItem[] => [
    {
        label: "Single NFT",
        Icon: () => <Icon icon="image" />,
        href: "/token/create",
        passHref: true,
    },
    {
        label: "Phygital",
        Icon: () => <Tb3DCubeSphere />,
        href: "/token/create-phygital",
        passHref: true,
    },
    {
        label: "Multiple NFTs",
        Icon: () => <Icon icon="image" />,
        href: "/token/batch-create",
        passHref: true,
    },
    {
        label: "Collection",
        Icon: () => <Icon icon="stop" />,
        href: "/collection/create",
        passHref: true,
    },
];
