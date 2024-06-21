import Link from "next/link";
import { useMemo } from "react";
import styled from "styled-components";
import CircleButton from "../components/CircleButton";
import { TokenAsset } from "../components/common/TokenAsset";
import FittedParagraph from "../components/FittedParagraph";
import Icon from "../components/Icon";
import { MarketplaceTokenFragment } from "../generated/graphql";
import variables from "../styles/_variables";
import getShortAddress from "../utils/getShortAddress";
import { Flex } from "./common/Flex";

const { colors, typography } = variables;
const { neutrals } = colors;

export interface TokenListProps {
    items: MarketplaceTokenFragment[];
    onDeselect?: (id: string) => void;
    showStakingContract?: boolean;
}

export default function TokenList({
    items,
    onDeselect,
    showStakingContract,
}: TokenListProps) {
    return (
        <Flex flexDirection="column" columnGap={2}>
            {items.map((t) => (
                <TokenListItem
                    key={t.tokenId}
                    deselectSelf={() => onDeselect?.(t.tokenId)}
                    token={t}
                    showStakingContract={showStakingContract}
                />
            ))}
        </Flex>
    );
}

interface TokenListItemProps {
    token: MarketplaceTokenFragment;
    deselectSelf?: () => void;
    showStakingContract?: boolean;
}

function TokenListItem({
    token,
    deselectSelf,
    showStakingContract,
}: TokenListItemProps) {
    const href = useMemo(
        () => `/token/${token.smartContractAddress}/${token.tokenId}`,
        [token.tokenId, token.smartContractAddress]
    );

    const asset =
        token.assets.find((asset) => asset.size === "STATIC_COVER_128") ||
        token.assets[token.assets.length - 1];

    const stakingContract = useMemo(
        () => getShortAddress(token.editions[0].stakingContractAddress!),
        [token.editions]
    );

    return (
        <Flex alignItems="center" rowGap={3}>
            <Link href={href}>
                <a>
                    <TokenAsset sizePx={72} asset={asset} />
                </a>
            </Link>
            <ItemInfoContainer>
                <Link href={href}>
                    <a>
                        <FittedParagraph
                            fittyOptions={{ minSize: 12, maxSize: 16 }}
                        >
                            {token.name}
                        </FittedParagraph>
                    </a>
                </Link>
                {!!token.rank && (
                    <DimText>
                        Rank: <strong>{token.rank}</strong>
                    </DimText>
                )}
                {showStakingContract && stakingContract && (
                    <DimText>
                        Staking Contract: <strong>{stakingContract}</strong>
                    </DimText>
                )}
            </ItemInfoContainer>
            <CircleButton outline small onClick={deselectSelf}>
                <Icon icon="close" />
            </CircleButton>
        </Flex>
    );
}

const ItemInfoContainer = styled.div`
    ${typography.body2}
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    overflow: hidden;
`;

const DimText = styled.p`
    ${typography.caption2}
    color: ${neutrals[4]};
`;
