import usePriceConversion from "@/hooks/usePriceConversion";
import { useUserData } from "@/hooks/useUserData";
import _ from "lodash";
import React from "react";
import AspectRatio from "react-aspect-ratio";
import ReactCountdown, { CountdownRenderProps } from "react-countdown";
import styled from "styled-components";
import { VerifiedStatus } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { TokenData } from "../types/TokenData";
import formatPrice from "../utils/formatPrice";
import { isSameAddress } from "../utils/isSameAddress";
import { Tooltip } from "./common/Tooltip";
import Link from "./Link";
import UserAvatar from "./UserAvatar";

const { dark } = mixins;
const {
    colors: { neutrals, red, green, blue },
    typography: { bodyBold2, caption2, captionBold2 },
} = variables;

enum AuctionStateEnum {
    ACTIVE = "active",
    TO_SETTLE = "to settle",
    ENDED = "ended",
}

/* interface CardProps {
    token: ITokenData;
    edition: IEditionData;
    auction: IAuctionData;
    offer: Pick<IOfferData, "tokenId" | "price">;
} */

// TODO: Change to CardProps after Auction refactor
const Card: React.FC<any> = (props) => {
    const { user } = useUserData();
    const priceConversion = usePriceConversion();

    const token = React.useMemo(
        () =>
            new TokenData({
                tokenData: props.token || props,
                editionsData: props.edition ? [props.edition] : undefined,
                auctionData: props.auction,
            }),
        [props]
    );

    const floorPriceEdition = React.useMemo(
        () => token.getFloorPriceEdition(priceConversion),
        [priceConversion, token]
    );

    const asset =
        token.assets == null
            ? null
            : token.assets.find(
                  (asset) => asset.size === "ANIMATED_INSIDE_512"
              ) || token.assets[token.assets.length - 1];

    const link = React.useMemo(() => {
        if (token && floorPriceEdition) {
            return token.isOnAuction
                ? `/auction/${token.auction!.id}`
                : `/token/${token.smartContractAddress}/${
                      floorPriceEdition!.id || token.id
                  }`;
        }
    }, [token, floorPriceEdition]);

    const countdownRender = ({
        days,
        hours,
        minutes,
        seconds,
        completed,
    }: CountdownRenderProps) =>
        completed ? null : (
            <Countdown>
                {days ? (
                    <CountdownValue>
                        <CountdownNumber>{days}</CountdownNumber>d
                    </CountdownValue>
                ) : null}

                {hours ? (
                    <CountdownValue>
                        <CountdownNumber>{hours}</CountdownNumber>h
                    </CountdownValue>
                ) : null}

                {minutes ? (
                    <CountdownValue>
                        <CountdownNumber>
                            {minutes.toString().padStart(2, "0")}
                        </CountdownNumber>
                        m
                    </CountdownValue>
                ) : null}

                {days == null && hours < 1 && (
                    <CountdownValue>
                        <CountdownNumber>
                            {seconds.toString().padStart(2, "0")}
                        </CountdownNumber>
                        s
                    </CountdownValue>
                )}
            </Countdown>
        );

    const auctionState = React.useMemo(
        () =>
            token.auction?.ended
                ? !token.auction.cancelled && !token.auction.settled
                    ? user &&
                      (isSameAddress(
                          user.address,
                          token.auction.seller?.address
                      ) ||
                          isSameAddress(
                              user.address,
                              token.auction.bidder?.address
                          ))
                        ? AuctionStateEnum.TO_SETTLE
                        : AuctionStateEnum.ENDED
                    : null
                : AuctionStateEnum.ACTIVE,
        [
            token.auction?.bidder?.address,
            token.auction?.cancelled,
            token.auction?.ended,
            token.auction?.seller?.address,
            token.auction?.settled,
            user,
        ]
    );

    const isPFPCreator =
        token.collection?.type === "PFP" &&
        isSameAddress(token.creator.address, token.smartContractAddress);

    const tokenIdRegex = "#.*[0-9]";

    const tokenId = token.name.match(tokenIdRegex);

    const newTokenName = token.name.includes("Mystery VeGem")
        ? "Mistery Ve... " + tokenId
        : token.name;

    const showCollectionVerifiedBadge =
        token.collection?.name && (token.creator.verified || isPFPCreator)
            ? true
            : false;

    return (
        <Link href={token.smartContractAddress && link} passHref>
            <Container className="card">
                <CardPreview>
                    {token.auction && token.isOnAuction ? (
                        <AuctionLiveBanner state={auctionState}>
                            {auctionState === AuctionStateEnum.ACTIVE
                                ? "active"
                                : auctionState === AuctionStateEnum.ENDED
                                ? "ended"
                                : auctionState === AuctionStateEnum.TO_SETTLE
                                ? "to be settled"
                                : null}
                        </AuctionLiveBanner>
                    ) : null}

                    <AspectRatio ratio="1">
                        <CardAsset blur={!token.canBeBought}>
                            {asset != null ? (
                                asset.mimeType.startsWith("video") ? (
                                    <video
                                        preload="metadata"
                                        src={`${asset.url}#t=0.001`}
                                    />
                                ) : (
                                    <img src={asset.url} alt="Card preview" />
                                )
                            ) : (
                                <div />
                            )}
                        </CardAsset>
                    </AspectRatio>

                    {token.creator.profileImage ? (
                        <Link
                            href={
                                isPFPCreator
                                    ? `/collection/${
                                          token.collection!.customUrl ||
                                          token.collection!.id
                                      }`
                                    : token.creator.profileIdentifier &&
                                      token.smartContractAddress
                                    ? `/profile/${token.creator.profileIdentifier}`
                                    : ""
                            }
                            passHref
                        >
                            <a>
                                <Tooltip
                                    content={
                                        isPFPCreator
                                            ? token.collection!.name
                                            : token.creator.username
                                    }
                                    placement="top-start"
                                >
                                    <Avatar
                                        src={
                                            isPFPCreator
                                                ? token.collection!
                                                      .thumbnailImageUrl
                                                : token.creator.profileImage
                                        }
                                        verified={
                                            isPFPCreator
                                                ? token.collection!.isVerified
                                                : token.creator.verified
                                        }
                                        verifiedLevel={
                                            isPFPCreator
                                                ? VerifiedStatus.Verified
                                                : token.creator.verifiedLevel
                                        }
                                    />
                                </Tooltip>
                            </a>
                        </Link>
                    ) : null}
                </CardPreview>

                <CardLink>
                    <CardBody>
                        <CardLine>
                            <CardTitle>{newTokenName}</CardTitle>
                        </CardLine>

                        <CardCollectionLine
                            showCollectionVerifiedBadge={
                                showCollectionVerifiedBadge
                            }
                        >
                            {token.collection?.name ? (
                                <Link
                                    href={
                                        token.collection?.id &&
                                        `/collection/${
                                            token.collection.customUrl ||
                                            token.collection.id
                                        }`
                                    }
                                    passHref
                                >
                                    {token.rank ? (
                                        <CardCollection
                                            style={{ maxWidth: "70px" }}
                                        >
                                            {token.collection.name ===
                                            "Mad Ⓥ-Apes Elementals"
                                                ? "MVA Elementals"
                                                : token.collection.name}
                                        </CardCollection>
                                    ) : (
                                        <CardCollection
                                            style={{ maxWidth: "120px" }}
                                        >
                                            {token.collection.name ===
                                            "Mad Ⓥ-Apes Elementals"
                                                ? "MVA Elementals"
                                                : token.collection.name}
                                        </CardCollection>
                                    )}
                                </Link>
                            ) : (
                                <CardCollection>&nbsp;</CardCollection>
                            )}

                            {token.collection?.type === "EXTERNAL" ? (
                                token.rank ? (
                                    `Rank: ${token.rank}`
                                ) : null
                            ) : _.isNumber(token.onSale) ||
                              _.isNumber(token.editionsCount) ? (
                                <span>
                                    {token.onSale} of {token.editionsCount}
                                </span>
                            ) : null}
                        </CardCollectionLine>
                    </CardBody>

                    <CardFooter>
                        {token.isOnAuction ? (
                            <CardPrice>
                                <span>
                                    {token.formattedAuctionPrice}{" "}
                                    {token.auction!.payment}
                                </span>
                            </CardPrice>
                        ) : (
                            <CardPrice>
                                {floorPriceEdition &&
                                floorPriceEdition.price ? (
                                    <span>
                                        {floorPriceEdition.formattedPrice}{" "}
                                        {floorPriceEdition.payment}
                                    </span>
                                ) : null}
                            </CardPrice>
                        )}

                        {token.auction && token.isOnAuction ? (
                            <CardStock>
                                <ReactCountdown
                                    date={
                                        token.auction.updatedEndDate ||
                                        token.auction.endDate
                                    }
                                    renderer={countdownRender}
                                />
                            </CardStock>
                        ) : (
                            <CardPrice>
                                {props?.offer?.price && (
                                    <>
                                        Offer{" "}
                                        <span>
                                            {formatPrice(props.offer.price)}{" "}
                                            vVET
                                        </span>
                                    </>
                                )}
                            </CardPrice>
                        )}
                    </CardFooter>
                </CardLink>
            </Container>
        </Link>
    );
};

const CardPreview = styled.div`
    position: relative;
`;

const CardAsset = styled.div<{ blur: boolean }>`
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    overflow: hidden;
    -webkit-mask-image: -webkit-radial-gradient(white, black) !important;

    img,
    video,
    div {
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 1s;
        background-color: ${({ theme }) => theme.colors.muted};
    }

    ${({ blur }) =>
        blur
            ? `
        img {
            -webkit-filter: blur(50px);
            filter: blur(50px);
        }
    `
            : ""}
`;

const Container = styled.a`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 16px;
    background: ${neutrals[8]};
    box-shadow: 0px 10px 16px rgba(31, 47, 69, 0.12);
    -webkit-mask-image: -webkit-radial-gradient(white, black);

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

    &:nth-child(3) {
        margin-top: auto;
    }
`;

const CardCollectionLine = styled(CardLine)<{
    showCollectionVerifiedBadge: boolean;
}>`
    font-size: 12px;
    color: ${neutrals[4]};
    justify-content: space-between;
    align-items: baseline;
    position: relative;

    ${({ showCollectionVerifiedBadge }) =>
        showCollectionVerifiedBadge &&
        `
        a {
            padding-left: 15px;

            &::after {
                content: "";
                background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzI5MzoyNDM5KSI+CjxwYXRoIGQ9Ik02IDZIMzBWMzBINlY2WiIgZmlsbD0iI0ZDRkNGRCIvPgo8cGF0aCBkPSJNMzUuMzgyNCAyMC4zODIxQzM0Ljc4MjYgMTguOTAyNSAzNC43ODI2IDE3LjI2MjkgMzUuMzgyNCAxNS44MjMyTDM1LjU4MjMgMTUuMzQzNEMzNi44NjE4IDEyLjMwNDEgMzUuMzgyNCA4Ljc4NDk3IDMyLjM0MzUgNy41MDUyOEwzMS45MDM3IDcuMzA1MzNDMzAuNDI0MyA2LjcwNTQ4IDI5LjI2NDcgNS41NDU3NiAyOC42NjUgNC4wNjYxMkwyOC41MDUgMy42NjYyMkMyNy4xODU1IDAuNjI2OTY3IDIzLjcwNjkgLTAuODEyNjggMjAuNjI4IDAuNDI3MDE2TDIwLjIyODIgMC41ODY5NzdDMTguNzQ4OCAxLjE4NjgzIDE3LjEwOTQgMS4xODY4MyAxNS42MyAwLjU4Njk3N0wxNS4yNzAxIDAuNDI3MDE2QzEyLjI3MTMgLTAuODEyNjggOC43NTI2MiAwLjY2Njk1OCA3LjQ3MzExIDMuNzA2MjFMNy4zMTMxNyA0LjAyNjEzQzYuNzEzNCA1LjUwNTc3IDUuNTUzODUgNi42NjU0OSA0LjA3NDQyIDcuMjY1MzRMMy43MTQ1NSA3LjQyNTNDMC43MTU3MDggOC43MDQ5OSAtMC43NjM3MjMgMTIuMjI0MSAwLjUxNTc4NSAxNS4yNjM0TDAuNjc1NzI0IDE1LjYyMzNDMS4yNzU0OSAxNy4xMDI5IDEuMjc1NDkgMTguNzQyNSAwLjY3NTcyNCAyMC4xODIyTDAuNTE1Nzg1IDIwLjYyMjFDLTAuNzYzNzIzIDIzLjY2MTMgMC42NzU3MjQgMjcuMTgwNSAzLjc1NDU0IDI4LjQyMDFMNC4xNTQzOSAyOC41ODAxQzUuNjMzODIgMjkuMTggNi43OTMzNyAzMC4zMzk3IDcuMzkzMTQgMzEuODE5M0w3LjU5MzA2IDMyLjI1OTJDOC44MzI1OSAzNS4zMzg0IDEyLjM1MTIgMzYuNzc4MSAxNS4zOTAxIDM1LjUzODRMMTUuODI5OSAzNS4zMzg1QzE3LjMwOTMgMzQuNzM4NiAxOC45NDg3IDM0LjczODYgMjAuNDI4MSAzNS4zMzg1TDIwLjc4OCAzNS40OTg0QzIzLjgyNjggMzYuNzc4MSAyNy4zNDU1IDM1LjI5ODUgMjguNjI1IDMyLjI1OTJMMjguNzg0OSAzMS45MzkzQzI5LjM4NDcgMzAuNDU5NiAzMC41NDQyIDI5LjI5OTkgMzIuMDIzNyAyOC43MDAxTDMyLjM0MzUgMjguNTgwMUMzNS40MjI0IDI3LjMwMDQgMzYuODYxOCAyMy44MjEzIDM1LjU4MjMgMjAuNzQyTDM1LjM4MjQgMjAuMzgyMVpNMTYuMzQ5NyAyNS43ODA4TDguNTUyNjkgMTkuMjIyNEwxMC45NTE4IDE2LjM4MzFMMTUuOTA5OSAyMC41ODIxTDI0LjY2NjUgMTAuMTg0NkwyNy41MDU0IDEyLjU4NEwxNi4zNDk3IDI1Ljc4MDhaIiBmaWxsPSIjMzc3MkZGIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMjkzOjI0MzkiPgo8cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==");
                position: absolute;
                left: 0;
                bottom: 4px;
                width: 12px;
                height: 12px;
                background-size: contain;
            }
        }
    `}
`;

const CardTitle = styled.div`
    padding-top: 1px;
    ${bodyBold2}
    font-size: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const CardCollection = styled.a`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const CardFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${neutrals[6]};
    ${caption2}
    color: ${neutrals[4]};
    height: 32px;

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const CardPrice = styled.div`
    span {
        font-weight: 600;
        color: ${neutrals[3]};

        ${dark`
            color: ${neutrals[8]};
        `}
    }
`;

const CardStock = styled.div``;

const AuctionLiveBanner = styled.div<{ state?: AuctionStateEnum | null }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 1;
    background: ${({ state }) =>
        state === AuctionStateEnum.ACTIVE
            ? green
            : state === AuctionStateEnum.ENDED
            ? red
            : state === AuctionStateEnum.TO_SETTLE
            ? blue
            : neutrals[3]};
    padding: 6px 12px;
    text-align: center;
    ${captionBold2};
    color: ${neutrals[7]};
`;

const Countdown = styled.div`
    display: flex;

    > *:not(:first-child) {
        margin-left: 2px;
    }
`;

const CountdownValue = styled.div`
    display: flex;
    align-items: flex-end;
    font-weight: 500;
    letter-spacing: 1px;
`;

const CountdownNumber = styled.div`
    font-weight: 600;
    color: ${neutrals[3]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;

export default Card;
