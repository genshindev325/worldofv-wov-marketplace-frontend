import moment from "moment";
import React, { useMemo } from "react";
import AspectRatio from "react-aspect-ratio";
import styled from "styled-components";
import { VerifiedDropFragment } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { Tooltip } from "./common/Tooltip";
import Link from "./Link";
import UserAvatar from "./UserAvatar";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { bodyBold2 },
} = variables;

const DropCard: React.FC<VerifiedDropFragment> = ({
    dateTime,
    title,
    imageUrl,
    collection,
    token,
    artist,
    asset,
}) => {
    const artistSlug = artist?.customUrl || artist?.address;
    const profileUrl = artistSlug ? `/profile/${artistSlug}` : undefined;

    const href = useMemo(
        () =>
            collection
                ? `/collection/${collection.collectionId}`
                : token
                ? `/token/${token.smartContractAddress}/${token.tokenId}`
                : profileUrl,
        [collection, profileUrl, token]
    );

    const isLive = new Date(dateTime) <= new Date();

    return (
        <Link {...{ href }} passHref>
            <Container
                className="drop-card"
                style={href ? { cursor: "pointer" } : undefined}
            >
                <CardPreview>
                    <AspectRatio ratio="1">
                        <CardAsset>
                            {asset != null &&
                                (asset.mimeType.startsWith("video") ? (
                                    <video
                                        preload="metadata"
                                        src={`${asset.url}#t=0.001`}
                                    />
                                ) : (
                                    <img src={asset.url} alt="Card preview" />
                                ))}

                            {isLive && <LiveBanner>Live</LiveBanner>}
                        </CardAsset>
                    </AspectRatio>

                    {artist?.assets?.length && (
                        <Link href={profileUrl} passHref>
                            <a>
                                <Tooltip content={artist.name}>
                                    <Avatar
                                        src={artist.assets[0].url}
                                        verified={artist.verified}
                                        verifiedLevel={
                                            artist.verifiedLevel as any
                                        }
                                    />
                                </Tooltip>
                            </a>
                        </Link>
                    )}
                </CardPreview>

                <CardLink>
                    <CardBody>
                        <CardLine>
                            <CardTitle>
                                {title || token?.name || collection?.name}
                            </CardTitle>
                        </CardLine>

                        <CardLine>
                            <CardItems>
                                {isLive ? (
                                    <strong>NOW LIVE 🔺</strong>
                                ) : (
                                    moment(dateTime).format("LLL")
                                )}
                            </CardItems>
                        </CardLine>
                    </CardBody>
                </CardLink>
            </Container>
        </Link>
    );
};

const CardPreview = styled.div`
    position: relative;
`;

const CardAsset = styled.div`
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    overflow: hidden;
    -webkit-mask-image: -webkit-radial-gradient(white, black) !important;

    img,
    video {
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 16px;
    background: ${neutrals[8]};
    box-shadow: 0px 4px 24px -6px rgba(15, 15, 15, 0.12);

    &:hover {
        ${CardAsset} {
            img,
            video {
                transform: scale(1.1);
            }
        }
    }

    ${dark`
        background: ${neutrals[2]};
    `}
`;

const Avatar = styled(UserAvatar).attrs(() => ({
    size: 34,
    verifiedSize: 12,
}))`
    position: absolute;
    left: 12px;
    bottom: -17px;
    border: 2px solid ${neutrals[8]};
    border-radius: 50%;

    ${dark`
        border-color: ${neutrals[2]};
        background: ${neutrals[2]};
    `}
`;

const CardLink = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 25px 12px 16px;
    color: ${neutrals[2]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const CardLine = styled.div`
    display: flex;
    align-items: flex-start;

    &:first-child {
        margin-bottom: 2px;
    }
`;

const CardTitle = styled.div`
    margin-right: auto;
    padding-top: 1px;
    ${bodyBold2}
    font-size: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const CardItems = styled.div`
    margin-right: auto;
    padding-top: 1px;
    font-size: 12px;
    line-height: 1;
    color: ${neutrals[4]};
`;

const LiveBanner = styled.div`
    position: absolute;
    top: 11px;
    left: 8px;
    background: #e4423c;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 26px;
    font-weight: 700;
    text-transform: uppercase;
    color: ${neutrals[8]};
    display: flex;
    align-items: center;

    &::before {
        content: "";
        display: inline-block;
        height: 6px;
        width: 6px;
        margin-right: 6px;
        border-radius: 100%;
        background: ${neutrals[8]};
    }
`;

export default DropCard;
