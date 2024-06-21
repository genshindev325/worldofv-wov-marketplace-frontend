import useGraphQL from "@/hooks/useGraphQL";
import styled from "styled-components";
import useSWR from "swr";

interface WinningCardProps {
    tokenId: string;
    collection: string;
    isWinner: boolean;
    loserUrl?: string;
}

const WinningCard: React.FC<WinningCardProps> = ({
    tokenId,
    collection,
    isWinner,
    loserUrl = "/img/unlucky.jpg",
}) => {
    const { sdk } = useGraphQL();

    const { data } = useSWR(
        isWinner ? [{ tokenId, collection }, "GET_TOKEN"] : null,
        ({ tokenId, collection }) =>
            sdk.GetToken({ tokenId, smartContractAddress: collection })
    );

    const asset = isWinner
        ? data?.token?.assets[data?.token?.assets.length - 1 || 0].url
        : loserUrl;

    return (
        <CardAsset>
            <img src={asset} alt={isWinner ? "Winning img" : "Losing img"} />
        </CardAsset>
    );
};

const CardAsset = styled.div`
    overflow: hidden;
    border-radius: 16px;
    height: 100%;
    width: 100%;
    max-height: 512px;
    max-width: 512px;
    margin: auto;

    img,
    video,
    div {
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: transform 1s;
        background-color: ${({ theme }) => theme.colors.muted};
    }
`;

export default WinningCard;
