import React from "react";
import AspectRatio from "react-aspect-ratio";
import styled from "styled-components";
import { GetCollectionsQueryResult } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import getShortAddress from "../utils/getShortAddress";
import { Tooltip } from "./common/Tooltip";
import Link from "./Link";
import UserAvatar from "./UserAvatar";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { bodyBold2 },
} = variables;

export type CollectionCardProps =
    GetCollectionsQueryResult["collections"]["items"][0] & {
        itemsCount?: number;
    };

const CollectionCard: React.FC<CollectionCardProps> = ({
    itemsCount,
    ...collection
}) => {
    return (
        <Link
            href={
                collection.collectionId || collection.customUrl
                    ? `/collection/${
                          collection.customUrl || collection.collectionId
                      }`
                    : undefined
            }
            passHref
        >
            <Container className="collection-card">
                <CardPreview>
                    <AspectRatio ratio="1">
                        <CardAsset>
                            {collection.thumbnailImageUrl && (
                                <img
                                    src={collection.thumbnailImageUrl}
                                    alt="Card preview"
                                />
                            )}
                        </CardAsset>
                    </AspectRatio>

                    {collection.creator?.assets?.length && (
                        <Link
                            href={`/profile/${
                                collection.creator.customUrl ||
                                collection.creator.address
                            }`}
                            passHref
                        >
                            <a>
                                <Tooltip
                                    content={
                                        collection.creator.name ||
                                        getShortAddress(
                                            collection.creator.address
                                        )
                                    }
                                >
                                    <Avatar
                                        src={collection.creator.assets[0].url}
                                        verified={collection.creator.verified}
                                        verifiedLevel={
                                            collection.creator
                                                .verifiedLevel as any
                                        }
                                    />
                                </Tooltip>
                            </a>
                        </Link>
                    )}
                </CardPreview>

                <CardLink href="#">
                    <CardBody>
                        <CardLine>
                            <CardTitle>{collection.name}</CardTitle>
                        </CardLine>

                        {/* <CardLine>
                            <CardItems>
                                {itemsCount || "No"}{" "}
                                {Number(itemsCount) > 1 ? "items" : "item"}
                            </CardItems>
                        </CardLine> */}
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

    mask-image: -webkit-radial-gradient(white, black) !important;
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

const CardLink = styled.a`
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

export default CollectionCard;
