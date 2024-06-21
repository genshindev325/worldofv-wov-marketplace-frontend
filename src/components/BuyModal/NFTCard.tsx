import Link from "next/link";
import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import formatPrice from "../../utils/formatPrice";
import CircleButton from "../CircleButton";
import { Flex } from "../common/Flex";
import { TokenAsset } from "../common/TokenAsset";
import FittedParagraph from "../FittedParagraph";
import ConditionalWrapper from "../HOC/ConditionalWrapper";
import Icon from "../Icon";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

interface NFTCardProps {
    token: any; // TODO
    isBatch: boolean;
    deselectSelf?: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ token, isBatch, deselectSelf }) => {
    let href = "";
    if (isBatch) {
        href = `/token/${token.smartContractAddress}/${token.tokenId}`;
    }
    return (
        <Flex alignItems="center" justifyContent="space-between" rowGap={3}>
            <ConditionalWrapper
                isRendered={isBatch}
                wrapper={(children) => (
                    <Link href={href}>
                        <a>{children}</a>
                    </Link>
                )}
            >
                <TokenAsset asset={token.asset} sizePx={72} />
            </ConditionalWrapper>

            <ItemInfoContainer>
                <ConditionalWrapper
                    isRendered={isBatch}
                    wrapper={(children) => (
                        <Link href={href}>
                            <a>{children}</a>
                        </Link>
                    )}
                >
                    <FittedParagraph
                        fittyOptions={{ minSize: 12, maxSize: 16 }}
                    >
                        {token.name}
                    </FittedParagraph>
                </ConditionalWrapper>
                <DimText>
                    Sale Price:{" "}
                    <strong>
                        {formatPrice(token.price)} {token.currency}
                    </strong>
                    {token.rank != null && (
                        <SmallText>
                            Rank: <strong>{token.rank}</strong>
                        </SmallText>
                    )}
                </DimText>
            </ItemInfoContainer>
            {isBatch && (
                <CircleButton outline small onClick={deselectSelf}>
                    <Icon icon="close" />
                </CircleButton>
            )}
        </Flex>
    );
};

const ItemInfoContainer = styled.div`
    ${typography.body2}
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    overflow: hidden;
`;

const DimText = styled.div`
    color: ${neutrals[4]};
`;

const SmallText = styled.p`
    ${typography.caption2}
`;

export default NFTCard;
