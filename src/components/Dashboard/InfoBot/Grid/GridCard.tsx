import React from "react";
import AspectRatio from "react-aspect-ratio";
import styled from "styled-components";
import { VerifiedStatus } from "../../../../generated/graphql";
import mixins from "../../../../styles/_mixins";
import variables from "../../../../styles/_variables";
import GenesisRoundel from "../../../Genesis/GenesisRoundel";
import Link from "../../../Link";
import UserAvatar from "../../../UserAvatar";
import { MissingToken } from "../../DashBoardProvider";

const { dark } = mixins;

const {
    colors: { neutrals, white },
    typography: { bodyBold2, caption2 },
} = variables;

interface GridCardProps {
    token: MissingToken;
    set: string;
}

const GridCard: React.FC<GridCardProps> = ({ token, set }) => {
    const href = React.useMemo(
        () =>
            `/collection/genesis?activeProperties=${set}-Unclaimed_Country-${token.country}&currency&maxPrice&maxRank&minPrice&minRank&onlyStakeable=0&page=1&query=&sort=price-low-to-high&tab=all`,
        [token.country, set]
    );

    return (
        <Link href={href}>
            <Container>
                <AspectRatio ratio="1">
                    <CardAsset>
                        <GenesisRoundel name={token.name} />
                        <img src={token.media[0].url} alt="NFT preview" />
                    </CardAsset>
                </AspectRatio>
                <CollectionThumbnail>
                    <Avatar
                        src={token.collectionThumbnail}
                        verified={true}
                        verifiedLevel={VerifiedStatus.Verified}
                    />
                </CollectionThumbnail>
                <Country>{token.country}</Country>
                <Collection>
                    <CollectionVerified />
                    <CollectionName>Genesis</CollectionName>
                </Collection>
            </Container>
        </Link>
    );
};

const CardAsset = styled.div`
    overflow: hidden;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
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
    border-radius: 16px;
    background: ${neutrals[8]};
    box-shadow: 0px 10px 16px rgba(31, 47, 69, 0.12);
    cursor: pointer;
    padding-bottom: 30px;
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

const CollectionThumbnail = styled.div`
    position: relative;
`;

const Avatar = styled(UserAvatar).attrs(() => ({
    size: 34,
    verifiedSize: 12,
}))`
    position: absolute !important;
    left: 12px;
    bottom: -17px;
    border: 2px solid ${neutrals[8]};
    border-radius: 50%;

    ${dark`
        border-color: ${neutrals[2]};
        background: ${neutrals[2]};
    `}
`;

const Country = styled.p`
    ${bodyBold2}
    padding: 20px;
    padding-bottom: 10px;
    font-size: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: black;
    ${dark`
        color: ${white}
    `}
`;

const Collection = styled.div`
    display: flex;
    align-items: center;
`;

const CollectionVerified = styled.div`
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzI5MzoyNDM5KSI+CjxwYXRoIGQ9Ik02IDZIMzBWMzBINlY2WiIgZmlsbD0iI0ZDRkNGRCIvPgo8cGF0aCBkPSJNMzUuMzgyNCAyMC4zODIxQzM0Ljc4MjYgMTguOTAyNSAzNC43ODI2IDE3LjI2MjkgMzUuMzgyNCAxNS44MjMyTDM1LjU4MjMgMTUuMzQzNEMzNi44NjE4IDEyLjMwNDEgMzUuMzgyNCA4Ljc4NDk3IDMyLjM0MzUgNy41MDUyOEwzMS45MDM3IDcuMzA1MzNDMzAuNDI0MyA2LjcwNTQ4IDI5LjI2NDcgNS41NDU3NiAyOC42NjUgNC4wNjYxMkwyOC41MDUgMy42NjYyMkMyNy4xODU1IDAuNjI2OTY3IDIzLjcwNjkgLTAuODEyNjggMjAuNjI4IDAuNDI3MDE2TDIwLjIyODIgMC41ODY5NzdDMTguNzQ4OCAxLjE4NjgzIDE3LjEwOTQgMS4xODY4MyAxNS42MyAwLjU4Njk3N0wxNS4yNzAxIDAuNDI3MDE2QzEyLjI3MTMgLTAuODEyNjggOC43NTI2MiAwLjY2Njk1OCA3LjQ3MzExIDMuNzA2MjFMNy4zMTMxNyA0LjAyNjEzQzYuNzEzNCA1LjUwNTc3IDUuNTUzODUgNi42NjU0OSA0LjA3NDQyIDcuMjY1MzRMMy43MTQ1NSA3LjQyNTNDMC43MTU3MDggOC43MDQ5OSAtMC43NjM3MjMgMTIuMjI0MSAwLjUxNTc4NSAxNS4yNjM0TDAuNjc1NzI0IDE1LjYyMzNDMS4yNzU0OSAxNy4xMDI5IDEuMjc1NDkgMTguNzQyNSAwLjY3NTcyNCAyMC4xODIyTDAuNTE1Nzg1IDIwLjYyMjFDLTAuNzYzNzIzIDIzLjY2MTMgMC42NzU3MjQgMjcuMTgwNSAzLjc1NDU0IDI4LjQyMDFMNC4xNTQzOSAyOC41ODAxQzUuNjMzODIgMjkuMTggNi43OTMzNyAzMC4zMzk3IDcuMzkzMTQgMzEuODE5M0w3LjU5MzA2IDMyLjI1OTJDOC44MzI1OSAzNS4zMzg0IDEyLjM1MTIgMzYuNzc4MSAxNS4zOTAxIDM1LjUzODRMMTUuODI5OSAzNS4zMzg1QzE3LjMwOTMgMzQuNzM4NiAxOC45NDg3IDM0LjczODYgMjAuNDI4MSAzNS4zMzg1TDIwLjc4OCAzNS40OTg0QzIzLjgyNjggMzYuNzc4MSAyNy4zNDU1IDM1LjI5ODUgMjguNjI1IDMyLjI1OTJMMjguNzg0OSAzMS45MzkzQzI5LjM4NDcgMzAuNDU5NiAzMC41NDQyIDI5LjI5OTkgMzIuMDIzNyAyOC43MDAxTDMyLjM0MzUgMjguNTgwMUMzNS40MjI0IDI3LjMwMDQgMzYuODYxOCAyMy44MjEzIDM1LjU4MjMgMjAuNzQyTDM1LjM4MjQgMjAuMzgyMVpNMTYuMzQ5NyAyNS43ODA4TDguNTUyNjkgMTkuMjIyNEwxMC45NTE4IDE2LjM4MzFMMTUuOTA5OSAyMC41ODIxTDI0LjY2NjUgMTAuMTg0NkwyNy41MDU0IDEyLjU4NEwxNi4zNDk3IDI1Ljc4MDhaIiBmaWxsPSIjMzc3MkZGIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMjkzOjI0MzkiPgo8cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==");
    margin-left: 20px;
    margin-right: 8px;
    width: 12px;
    height: 12px;
    background-size: contain;
`;

const CollectionName = styled.p`
    ${caption2}
    color: ${neutrals[4]};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;
export default GridCard;
