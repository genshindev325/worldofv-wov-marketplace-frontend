import { useBlockchain } from "@/blockchain/BlockchainProvider";
import { useUserDataLegacy } from "@/hooks/useUserData";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/router";
import styled, { useTheme } from "styled-components";
import { usePopupHandler } from "../../../hooks/usePopupHandler";
import { useUserBalance } from "../../../hooks/useUserBalance";
import { Balance } from "../../BalanceProvider";
import { Box } from "../../common/Box";
import { Button_Style2 } from "../../common/Button";
import { Popup } from "../../common/Popup";
import { PopupLinkItem, PopupLinkItems } from "../../common/PopupLinkItems";
import { Text } from "../../common/Text";
import Icon from "../../Icon";
import UserAvatar from "../../UserAvatar";
import { ThemeButton } from "../ThemeButton";

export const UserItem = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.m})`);
    const user = useUserDataLegacy();
    const balance = useUserBalance();
    const router = useRouter();
    const { visible, hide, handleEvent } = usePopupHandler();
    const { walletService } = useBlockchain();

    const openNewWindow = () => {
        window?.open("https://app.inheriti.com/?refid=WorldOfV", "_blank");
    };

    let items: PopupLinkItem[] = [
        {
            label: "Profile",
            Icon: () => <Icon icon="user" />,
            href: "/profile",
            passHref: true,
        },
        {
            label: "Edit Profile",
            Icon: () => <Icon icon="edit" />,
            href: "/profile/edit",
            passHref: true,
        },
        {
            label: "Offer Settings",
            Icon: () => <Icon icon="coin" />,
            href: "/profile/offer-settings",
            passHref: true,
        },
        {
            label: "Dark theme",
            Icon: () => <Icon icon="bulb" />,
            Comp: () => <ThemeButton variant="switch" />,
        },

        {
            label: "Protect your NFTs",
            Icon: () => <Icon icon="inheriti" />,
            onClick: openNewWindow,
        },
        // https://app.inheriti.com/?refid=WorldOfV
        {
            label: "Disconnect",
            Icon: () => <Icon icon="exit" />,
            onClick: async () => {
                await walletService!.logout();
                router.push("/");
            },
        },
    ];

    // Insert admin link before disconnect.
    // For Bruti with ❤️
    if (user?.isAdmin) {
        items = [
            ...items.slice(0, items.length - 2),
            {
                label: "Admin Panel",
                Icon: () => <Icon icon="report" />,
                href: "/admin/home/banner",
                passHref: true,
            },
            ...items.slice(items.length - 2),
        ];
    }

    items.push({
        Comp: () =>
            balance != null ? (
                <Box width="100%">
                    {(["WoV", "VET", "vVET"] as (keyof Balance)[]).map(
                        (currency) =>
                            balance[currency] != null && (
                                <Text
                                    key={currency}
                                    variant="caption2"
                                    color="accent"
                                    textAlign="center"
                                >
                                    {balance[currency]}{" "}
                                    <strong>{currency}</strong>
                                </Text>
                            )
                    )}
                </Box>
            ) : null,
    });

    if (user == null) {
        return null;
    }

    return (
        <Popup
            placement={isSmallScreen ? "bottom" : "bottom-end"}
            interactive
            visible={visible}
            width={256}
            onClickOutside={hide}
            rounded
            content={<PopupLinkItems items={items} rounded />}
        >
            <InnerContainer onClick={handleEvent}>
                <UserAvatar
                    src={user.assets?.[0]?.url || user.profileImage}
                    size={32}
                />
                {!isSmallScreen && (
                    <Box px={2}>
                        <StyledText
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            color="text"
                        >
                            {user.username}
                        </StyledText>
                    </Box>
                )}
            </InnerContainer>
        </Popup>
    );
};

const StyledText = styled(Text)`
    width: 100%;
    max-width: 100px;
`;

const InnerContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 20px;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.muted};
    ${Button_Style2};
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.primary};
    }
`;
