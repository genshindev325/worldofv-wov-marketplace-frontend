import styled from "styled-components";
import { Flex } from "./common/Flex";
import { Text } from "./common/Text";
import Icon from "./Icon";
import Link from "./Link";

export default function Footer() {
    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            padding={3}
            rowGap={3}
        >
            <Text variant="caption1" color="accent">
                World of V © 2023
            </Text>

            <div style={{ flex: 1 }} />

            <Flex rowGap={3}>
                <Link href="https://discord.gg/worldofv" passHref>
                    <SocialLink>
                        <Icon icon="discord-fill" />
                    </SocialLink>
                </Link>

                <Link
                    href="https://twitter.com/intent/follow?screen_name=worldofv_art"
                    passHref
                >
                    <SocialLink>
                        <Icon icon="twitter-fill" />
                    </SocialLink>
                </Link>

                <Link href="https://www.instagram.com/worldofv_art/" passHref>
                    <SocialLink>
                        <Icon icon="instagram-fill" />
                    </SocialLink>
                </Link>

                <Link
                    href="https://www.youtube.com/channel/UC2jIFCd383GF5DQ9kLml0GQ"
                    passHref
                >
                    <SocialLink>
                        <Icon icon="youtube-fill" />
                    </SocialLink>
                </Link>
            </Flex>

            <Flex
                style={{ flexGrow: 100 }}
                flexWrap="wrap"
                justifyContent="flex-end"
                rowGap={3}
            >
                <Link href="/marketplace" passHref>
                    <FooterLink>Marketplace</FooterLink>
                </Link>

                <Link href="/about" passHref>
                    <FooterLink>About</FooterLink>
                </Link>

                <Link href="/partners" passHref>
                    <FooterLink>Partners</FooterLink>
                </Link>

                <Link href="/privacy" passHref>
                    <FooterLink>Privacy</FooterLink>
                </Link>

                <Link href="/terms" passHref>
                    <FooterLink>Terms</FooterLink>
                </Link>

                <Link href="https://world-of-v.gitbook.io/world-of-v/" passHref>
                    <a target="_blank">
                        <FooterLink>Help</FooterLink>
                    </a>
                </Link>
            </Flex>
        </Flex>
    );
}

const FooterLink = styled.a`
    font-weight: 700;
    line-height: 40px;
    color: ${({ theme }) => theme.colors.accent};
    transition: color 0.2s;

    &:hover,
    &.active {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const SocialLink = styled.a.attrs(() => ({
    target: "_blank",
}))`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    font-size: 16px;

    .icon {
        color: ${({ theme }) => theme.colors.accent};
        transition: color 0.2s;
    }

    &:hover {
        .icon {
            color: ${({ theme }) => theme.colors.primary};
        }
    }
`;
