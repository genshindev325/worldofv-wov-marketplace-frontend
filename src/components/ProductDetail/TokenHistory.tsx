import React from "react";
import styled from "styled-components";
import ProductDetailAccordion from "./ProductDetailAccordion";
import TokenHistoryContent from "./TokenHistoryContent";

const TokenHistory: React.FC = () => {
    return (
        <Container>
            <New>New</New>
            <StyledProductDetailAccordion title="History">
                <TokenHistoryContent />
            </StyledProductDetailAccordion>
        </Container>
    );
};

const StyledProductDetailAccordion = styled(ProductDetailAccordion)`
    margin: 20px 80px 64px;
    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.t}) {
        margin: 20px 40px 64px;
    }
    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.a}) {
        margin: 20px 32px 64px;
    }
`;

// TODO: remove these 2 components as soon as few days are passed
const Container = styled.div`
    position: relative;
`;

const New = styled.div`
    position: absolute;
    top: -15px;
    left: 160px;
    color: ${({ theme }) => theme.colors.white};
    font-size: 10px;
    font-weight: bold;
    background: #3772ff;
    line-height: 25px;
    padding: 0 8px;
    text-transform: uppercase;
    border-radius: 6px;
    @media only screen and (max-width: ${({ theme }) => theme.breakpoints.t}) {
        left: 120px;
    }
`;

export default TokenHistory;
