import styled, { css } from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { TokenData } from "../../types/TokenData";

const { media, dark } = mixins;
const {
    colors: { neutrals },
} = variables;

interface ProductDetailImageProps {
    token: TokenData;
}

const ProductDetailImage: React.FC<ProductDetailImageProps> = ({ token }) => {
    const asset512 = token.assets.find(
        (asset) => asset.size === "ANIMATED_INSIDE_512"
    );
    const asset1024 = token.assets.find(
        (asset) => asset.size === "ANIMATED_INSIDE_1024"
    );
    const assetFallback = token.assets[token.assets.length - 1];

    return (
        <Container blurred={!token.canBeBought}>
            {asset512 != null && (
                <source srcSet={asset512.url} media="(max-width: 512px)" />
            )}

            {asset1024 != null && (
                <source srcSet={asset1024.url} media="(max-width: 1024px)" />
            )}

            {/* Original image fallback */}
            <StyledImage src={assetFallback.url} alt={token.name} />
        </Container>
    );
};

const Container = styled.picture<{ blurred?: boolean }>`
    overflow: hidden;
    margin: 0 auto;
    border-radius: 16px;

    ${({ blurred }) =>
        blurred
            ? css`
                  border: 2px solid ${neutrals[8]};

                  ${dark`
                        border-color: ${neutrals[2]};
                    `}

                  img {
                      -webkit-filter: blur(50px);
                      filter: blur(50px);
                  }
              `
            : undefined}
`;

const StyledImage = styled.img`
    margin: 0 auto;
    object-fit: scale-down;

    max-width: 100%;
    max-height: calc(100vh - 80px - 64px - 64px);
    height: fit-content;
    ${media.t`
        height: inherit;
    `}
`;

export default ProductDetailImage;
