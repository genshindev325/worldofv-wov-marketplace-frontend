import styled from "styled-components";
import { AssetFragment } from "../../../generated/graphql";

export interface TokenAssetProps {
    asset: Omit<AssetFragment, "size">;
    sizePx?: number;
    className?: string;
}

export function TokenAsset({ asset, sizePx = 64, className }: TokenAssetProps) {
    return (
        <MediaContainer {...{ sizePx, className }}>
            {asset?.mimeType.startsWith("video") ? (
                <video preload="metadata" src={`${asset?.url}#t=0.001`} />
            ) : (
                <img src={asset?.url} alt="Card preview" />
            )}
        </MediaContainer>
    );
}

const MediaContainer = styled.div<{ sizePx: number }>`
    width: ${({ sizePx }) => sizePx}px;
    height: ${({ sizePx }) => sizePx}px;

    img,
    video {
        object-fit: cover;
        float: left;
        width: 100%;
        height: 100%;
        transition: transform 1s;
        background-color: ${({ theme }) => theme.colors.muted};
        border-radius: ${({ theme }) => theme.radii[2]}px;
    }
`;
