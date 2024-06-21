import React from "react";
import { ImStack } from "react-icons/im";
import Clamp from "react-multiline-clamp";
import styled, { useTheme } from "styled-components";
import { VerifiedStatus } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { Flex } from "./common/Flex";
import { Spacer } from "./common/Spacer";
import { Text } from "./common/Text";
import { Tooltip } from "./common/Tooltip";
import Link from "./Link";
import UserAvatar from "./UserAvatar";

const { dark } = mixins;
const {
    colors: { neutrals, red, green, blue },
    typography: { bodyBold2, caption2, hairline2, captionBold2 },
} = variables;

const STAKING_ICON_SIZE = 21;

interface CardCollectionProps {
    collectionId: string;
    name: string;
    description: string;
    thumbnailImageUrl: string;
    bannerImageUrl: string;
    isVerified: boolean;
    isMinting: boolean;
    customUrl?: string;
    mintPageUrl?: string;
    isStakingActive: boolean;
}

const CardCollection: React.FC<CardCollectionProps> = ({
    collectionId,
    name,
    description,
    thumbnailImageUrl,
    bannerImageUrl,
    customUrl,
    mintPageUrl,
    isVerified,
    isMinting,
    isStakingActive,
}) => {
    const theme = useTheme();
    const marketplaceUrl = `/collection/${customUrl || collectionId}`;

    return (
        <Container>
            <Link href={marketplaceUrl} passHref>
                <CardPreview>
                    <CardAsset>
                        <img src={bannerImageUrl} alt="Card preview" />
                    </CardAsset>

                    <Avatar
                        src={thumbnailImageUrl}
                        verified={isVerified}
                        verifiedLevel={VerifiedStatus.Verified}
                    />
                </CardPreview>
            </Link>

            <CardBody>
                <Flex alignItems="center" justifyContent="center" mt={1}>
                    <Spacer size={STAKING_ICON_SIZE} />
                    <Text
                        variant="bodyBold2"
                        fontSize={18}
                        textOverflow="ellipsis"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        mx={2}
                    >
                        {name}
                    </Text>
                    {isStakingActive ? (
                        <Tooltip content="Staking Active" placement="top">
                            <a>
                                <ImStack
                                    size={STAKING_ICON_SIZE}
                                    color={theme.colors.accent}
                                />
                            </a>
                        </Tooltip>
                    ) : (
                        <Spacer size={STAKING_ICON_SIZE} />
                    )}
                </Flex>

                <CardLine>
                    <Clamp lines={3}>
                        <CardDescription>{description}</CardDescription>
                    </Clamp>
                </CardLine>

                <CardLine>
                    <CardLinks>
                        {isMinting && mintPageUrl ? (
                            <Link href={mintPageUrl} passHref>
                                <CardLink target="_blank">Mint page</CardLink>
                            </Link>
                        ) : null}

                        <Link href={marketplaceUrl} passHref>
                            <CardLink>Marketplace</CardLink>
                        </Link>
                    </CardLinks>
                </CardLine>
            </CardBody>
        </Container>
    );
};

const CardPreview = styled.a`
    position: relative;
`;

const CardAsset = styled.div`
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    overflow: hidden;
    height: 200px;
    -webkit-mask-image: -webkit-radial-gradient(white, black) !important;

    img,
    video,
    div {
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 1s;
        background-color: ${neutrals[6]};

        ${dark`
            background-color: ${neutrals[3]};
        `}
    }
`;

const Container = styled.a`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radii[4]}px;
    border: ${({ theme }) => `1px solid ${theme.colors.muted}`};
    background: ${({ theme }) => theme.colors.highlight};
    box-shadow: 0px 16px 32px rgba(31, 47, 69, 0.12);

    &:hover {
        ${CardAsset} {
            img,
            video {
                transform: scale(1.1);
            }
        }
    }
`;

const Avatar = styled(UserAvatar).attrs(() => ({
    size: 50,
    verifiedSize: 14,
}))`
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: -25px;
    border: 2px solid ${neutrals[8]};
    border-radius: 50%;

    ${dark`
        border-color: ${neutrals[2]};
    `}
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 32px 16px 16px;
    color: ${neutrals[2]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;

const CardLine = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;

    &:first-child {
        margin-bottom: 2px;
    }

    &:nth-child(3) {
        margin-top: auto;
    }
`;

const CardDescription = styled.div`
    ${caption2}
    color: ${neutrals[4]};
    text-align: center;
`;

const CardLinks = styled.div`
    margin-top: 16px;
    flex: 1;
    display: flex;
    justify-content: space-around;
`;

const CardLink = styled.a`
    ${hairline2};
`;

export default CardCollection;
