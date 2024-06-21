import _ from "lodash";
import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import { AssetSize } from "../../generated/graphql";
import { useProfile } from "../../providers/ProfileProvider";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import formatPrice from "../../utils/formatPrice";
import { Balance } from "../BalanceProvider";
import { Box } from "../common/Box";
import { Button_Style2 } from "../common/Button";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Spacer } from "../common/Spacer";
import { Text } from "../common/Text";
import { Tooltip } from "../common/Tooltip";
import { useConnex } from "../ConnexProvider";
import Icon from "../Icon";
import ReadMore from "../ReadMore";
import UserAvatar from "../UserAvatar";

const fitty = require("fitty/dist/fitty.min.js");

const { media } = mixins;
const { dark } = mixins;
const {
    colors: { blue, neutrals },
    typography: { bodyBold1, caption2, caption1 },
} = variables;

export const ProfileInfo = () => {
    const { user } = useProfile();
    const { getBalance } = useConnex();

    const { data: balance } = useSWR(
        user?.showBalance ? [user.address, "PROFILE_BALANCE"] : null,
        async (address) => {
            const balance = await getBalance(address);
            return _.mapValues(balance, formatPrice) as unknown as Record<
                keyof Balance,
                string
            >;
        }
    );

    React.useEffect(() => {
        fitty("#username", { maxSize: 24 });
    }, []);

    if (!user) {
        return null;
    }

    const copyURL = async () => {
        if (process.browser) {
            try {
                await navigator.clipboard.writeText(
                    `${window.location.origin}/profile/${user.profileIdentifier}`
                );

                toast.info("Profile URL copied to clipboard");
            } catch (err) {
                toast.error("An error occurred while copying the profile URL");
            }
        }
    };

    const copyAddress = async () => {
        if (process.browser) {
            try {
                await navigator.clipboard.writeText(user.address);
                toast.info("Address copied to clipboard");
            } catch (err) {
                toast.error("An error occurred while copying the address");
            }
        }
    };

    const UserSite = ({ withUrl = false }) => (
        <StyledA href={user.websiteUrl} target="_blank" rel="noreferrer">
            {withUrl ? (
                <Flex alignItems="center" mb={3}>
                    <Icon icon="globe" style={{ marginTop: 6 }} />
                    <Text
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        ml={1}
                        as="a"
                    >
                        {user.websiteUrl}
                    </Text>
                </Flex>
            ) : (
                <Icon icon="globe" />
            )}
        </StyledA>
    );

    return (
        <Container>
            <UserAvatarContainer>
                {user.profileImage && (
                    <UserAvatar
                        src={
                            user.assets?.find(
                                (a) => a.size === AssetSize.StaticCover_512
                            )?.url || user.profileImage
                        }
                        verified={user.verified}
                        verifiedLevel={user.verifiedLevel}
                        size={100}
                        verifiedSize={26}
                    />
                )}
            </UserAvatarContainer>

            {user.name && (
                <Tooltip content="Click to copy the custom url">
                    <UserName onClick={copyURL} id="username">
                        {user.name}{" "}
                        <sup style={{ fontSize: "12px" }}>
                            <Icon icon="files-empty" />
                        </sup>
                    </UserName>
                </Tooltip>
            )}
            <Spacer y size={1} />

            <UserAddress>
                <Tooltip content="Click to copy the address">
                    <UserAddressNumber onClick={copyAddress}>
                        {user.shortAddress}{" "}
                        <sup style={{ fontSize: "12px" }}>
                            <Icon icon="files-empty" />
                        </sup>
                    </UserAddressNumber>
                </Tooltip>
            </UserAddress>

            <Text
                variant="caption2"
                color="accent"
                whiteSpace="pre-wrap"
                textAlign="center"
                mb={3}
            >
                <ReadMore withToggle>{user.description}</ReadMore>
            </Text>

            {user.websiteUrl && (
                <Box display={{ _: "none", t: "block" }}>
                    <UserSite withUrl />
                </Box>
            )}

            {balance != null && (
                <UserBalance>
                    {balance.WoV && (
                        <div>
                            {balance.WoV} <strong>WoV</strong>
                        </div>
                    )}

                    {balance.VET && (
                        <div>
                            {balance.VET} <strong>VET</strong>
                        </div>
                    )}

                    {balance.vVET && (
                        <div>
                            {balance.vVET} <strong>vVET</strong>
                        </div>
                    )}
                </UserBalance>
            )}

            <Box display={{ _: "none", t: "block" }}>
                <Divider />
            </Box>

            <Flex justifyContent="center" pt={2} rowGap={4}>
                {user.websiteUrl && (
                    <Box display={{ _: "block", t: "none" }}>
                        <UserSite />
                    </Box>
                )}

                {user.twitterUrl && (
                    <StyledA
                        href={user.twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon icon="twitter-fill" />
                    </StyledA>
                )}

                {user.instagramUrl && (
                    <StyledA
                        href={user.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon icon="instagram-fill" />
                    </StyledA>
                )}

                {user.facebookUrl && (
                    <StyledA
                        href={user.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon icon="facebook-fill" />
                    </StyledA>
                )}

                {user.discordUrl && (
                    <StyledA
                        href={user.discordUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Icon icon="discord-fill" />
                    </StyledA>
                )}

                {user.showEmail && user.email && (
                    <StyledA href={`mailto:${user.email}`} rel="noreferrer">
                        <Icon icon="envelope" />
                    </StyledA>
                )}
            </Flex>
        </Container>
    );
};

const Container = styled.div`
    padding: 12px 28px;
    box-shadow: 0px 40px 32px -24px rgba(15, 15, 15, 0.12);
    border-radius: ${({ theme }) => theme.radii[4]}px;
    border: ${({ theme }) => `1px solid ${theme.colors.muted}`};
    background: ${({ theme }) => theme.colors.highlight};
    text-align: center;

    > :first-child {
        margin: 0 auto 24px !important;
    }

    ${media.t`
        box-shadow: none;
        background: none;
        border: none;
    `}

    ${dark`
        ${media.t`
            background: none;
            border: none;
        `}
    `}
`;

const UserAvatarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    > * {
        img {
            border: 3px solid ${({ theme }) => theme.colors.background};
        }
        background: ${({ theme }) => theme.colors.background};
        border-radius: 50%;
    }
    ${media.t`
        > * {
            margin-top: -30px;
        }
    `}
    ${media.m`
        > * {
            margin-top: -30px;
        }
    `}
`;

const UserName = styled.div`
    cursor: pointer;
    ${bodyBold1};
    transition: color 0.2s;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;

    &:hover {
        color: ${blue};
    }
`;

const UserAddress = styled.div`
    display: inline-flex;
    align-items: center;
    margin-bottom: 20px;
    ${media.t`
        margin-bottom: 10px;
    `}
`;

const UserAddressNumber = styled.div`
    cursor: pointer;
    ${Button_Style2};
    color: ${neutrals[2]};
    transition: color 0.2s;

    &:hover {
        color: ${blue} !important;
    }

    ${dark`
        color: ${neutrals[8]};
    `}
`;

const UserBalance = styled.div`
    padding: 16px 0;
    border-top: 1px solid ${({ theme }) => theme.colors.muted};
    ${({ theme }) => theme.typography.caption2};
    color: ${({ theme }) => theme.colors.accent};
`;

const StyledA = styled.a`
    .icon {
        width: 20px;
        height: 20px;
        font-size: 20px;
        color: ${({ theme }) => theme.colors.accent};
        transition: color 0.2s;
    }

    &:hover {
        .icon {
            color: ${({ theme }) => theme.colors.primary};
        }
    }
`;
