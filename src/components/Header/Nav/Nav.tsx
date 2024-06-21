import { useMediaQuery } from "@react-hook/media-query";
import { FC, useState } from "react";
import styled, { useTheme } from "styled-components";
import mixins from "../../../styles/_mixins";
import { Box } from "../../common/Box";
import { Divider } from "../../common/Divider";
import { Flex } from "../../common/Flex";
import { Popup } from "../../common/Popup";
import { PopupLinkItems } from "../../common/PopupLinkItems";
import { StackItem } from "../../common/StackItem";
import { Text } from "../../common/Text";
import Link from "../../Link";
import { getNavItems } from "./utils";

const { media } = mixins;

interface NavProps {
    loggedIn?: boolean;
}

// TODO: introduce `view` prop?
export const Nav: FC<NavProps> = ({ loggedIn = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.x})`);

    const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);

    const navItems = getNavItems(loggedIn);

    if (isMobile) {
        return (
            <Flex flexDirection="column">
                {navItems
                    .filter((item) =>
                        selectedAnchor == null
                            ? true
                            : item.anchor === selectedAnchor
                    )
                    .map(({ anchor, isNew }) => (
                        <StackItem
                            key={anchor}
                            text={isNew ? `${anchor} 🆕` : anchor}
                            open={selectedAnchor === anchor}
                            onClick={() => {
                                setSelectedAnchor(
                                    selectedAnchor === anchor ? null : anchor
                                );
                            }}
                        />
                    ))}
                {selectedAnchor != null && <Divider />}
                {navItems
                    .find((item) => item.anchor === selectedAnchor)
                    ?.items.map(({ label, href, passHref, target }) => (
                        <Box py={3} key={label}>
                            <Link
                                href={href}
                                passHref={passHref}
                                // @ts-ignore
                                target={target}
                            >
                                <Text variant="bodyBold1" color="accent" as="a">
                                    {label}
                                </Text>
                            </Link>
                        </Box>
                    ))}
            </Flex>
        );
    }

    // TODO: why popup is not being triggered by <Text as="a" />?
    return (
        <Flex rowGap={4}>
            {navItems.map(({ isNew, anchor, items }) => (
                <Popup
                    key={anchor}
                    placement="bottom"
                    interactive
                    content={<PopupLinkItems items={items} />}
                >
                    <a>
                        <Text
                            variant="h3"
                            fontSize={3}
                            color="accent"
                            as="a"
                            style={{ position: "relative" }}
                        >
                            {isNew && <New>New</New>}
                            {anchor}
                        </Text>
                    </a>
                </Popup>
            ))}
        </Flex>
    );
};

const New = styled.div`
    position: absolute;
    top: -25px;
    left: 50px;
    color: ${({ theme }) => theme.colors.white};
    font-size: 10px;
    background: #3772ff;
    line-height: 25px;
    padding: 0 8px;
    text-transform: uppercase;
    border-radius: 6px;
    ${media.x`
        top: -8px;
        left: 100px;
    `}
`;
