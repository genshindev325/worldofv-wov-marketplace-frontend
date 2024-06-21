import { Spacer } from "@/components/common/Spacer";
import styled from "styled-components";
import AuctionContent from "../../components/Auction/AuctionContent";
import ProductDetail from "../../components/ProductDetail/ProductDetail";
import common from "../../styles/_common";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { useAuction } from "./AuctionProvider";

const { media } = mixins;
const { container } = common;
const {
    colors: { green },
    typography: { captionBold1 },
} = variables;

const AuctionWrapper = () => {
    const { auction } = useAuction();

    return (
        <Container>
            <InnerContainer>
                {auction && !auction.ended ? (
                    <AuctionBanner>Auction Active</AuctionBanner>
                ) : null}

                <ProductDetail />
                <Spacer size={5} />
                <AuctionContent />
            </InnerContainer>
        </Container>
    );
};

const Container = styled.div`
    ${container};
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: inherit;
`;

const InnerContainer = styled.div`
    position: relative;
    display: flex;
    height: 100%;
    min-height: inherit;

    ${media.t`
        display: block;
    `}
`;

const AuctionBanner = styled.div`
    ${captionBold1};
    background: ${green};
    text-align: center;
    padding: 6px 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    position: absolute;
    bottom: 100%;
    width: 100%;
`;

export default AuctionWrapper;
