import styled from "styled-components";
import mixins from "../../styles/_mixins";
import { useAuction } from "../Auction/AuctionProvider";
import ProductDetailImage from "./ProductDetailImage";
import { useItem } from "./ProductDetailProvider";

const { media } = mixins;

const ProductDetail = () => {
    const item = useItem();
    const auction = useAuction();

    const token = item?.token || auction.token;

    if (token == null) return null;

    const asset =
        token.assets.find((asset) => asset.size === "ANIMATED_INSIDE_1024") ||
        token.assets[token.assets.length - 1];

    return (
        <Container>
            {asset.mimeType.startsWith("video") ? (
                <StyledVideo
                    loop
                    controls
                    preload="metadata"
                    src={`${asset.url}#t=0.001`}
                />
            ) : (
                <ProductDetailImage {...{ token }} />
            )}
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    display: grid;
    gap: 32px;
    align-items: start;
    align-content: start;
    flex: 1;

    ${media.t`
        margin-right: 0;
        margin-bottom: 32px;
    `}
`;

const StyledVideo = styled.video`
    margin: 0 auto;
    border-radius: 16px;
    max-width: 100%;
    max-height: calc(100vh - 80px - 64px - 64px);
    height: fit-content;
`;

export default ProductDetail;
