import usePriceConversion from "@/hooks/usePriceConversion";
import BigNumber from "bignumber.js";
import { useCallback, useMemo } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { useCollection } from "../../providers/CollectionProvider";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { SaleCurrency } from "../../types/Currencies";
import formatNumber from "../../utils/formatNumber";
import formatPrice from "../../utils/formatPrice";
import { getPaymentFromContractAddress } from "../../utils/getPaymentFromContractAddress";
import { useConnex } from "../ConnexProvider";

const {
    typography: { bodyBold1, caption1 },
    colors: { neutrals },
} = variables;

const { dark } = mixins;

const CollectionStats = () => {
    const { collection } = useCollection() as any;
    const { getCollectionStakedPercentage } = useConnex();
    const priceConversion = usePriceConversion();

    const fetchStakedCount = useCallback(
        async (contractAddresses: string[] = []) => {
            const info = await Promise.all(
                contractAddresses.map((a) =>
                    getCollectionStakedPercentage(
                        a,
                        collection.smartContractAddress
                    )
                )
            );
            return info.reduce((count, info) => count + info, 0);
        },
        [collection.smartContractAddress, getCollectionStakedPercentage]
    );

    const { data: stakedPercent } = useSWR(
        [collection.stakingContractAddresses, "STAKED_COUNT"],
        fetchStakedCount
    );
    const prices: Record<string, string>[] = useMemo(
        () =>
            collection.stats?.floorPrices?.reduce((prices: any, item: any) => {
                const address = item.addressVIP180;
                const payment = getPaymentFromContractAddress(
                    address
                ) as SaleCurrency;
                const rate = priceConversion?.[payment];
                const price = formatNumber(formatPrice(item.price));
                const priceUSD = rate
                    ? new BigNumber(item.price).div(1e18).times(rate)
                    : null;
                const convertedPrice =
                    payment === "VET"
                        ? priceUSD?.dividedBy(priceConversion!.WoV!).toFixed(0)
                        : priceUSD?.dividedBy(priceConversion!.VET!).toFixed(0);
                return [...prices, { payment, price, convertedPrice }];
            }, []),
        [collection.stats?.floorPrices, priceConversion]
    );

    if (
        !collection.stats ||
        !Object.keys(collection.stats).filter((el) => el).length
    ) {
        return null;
    }

    return (
        <Container>
            <InnerContainer>
                <StatsBlock>
                    <StatsBlockLabel>Items</StatsBlockLabel>
                    <StatsBlockValue>
                        {collection.stats.itemsCount}
                    </StatsBlockValue>
                </StatsBlock>

                <StatsBlock>
                    <StatsBlockLabel>Owners</StatsBlockLabel>
                    <StatsBlockValue>
                        {collection.stats.ownersCount}
                    </StatsBlockValue>
                </StatsBlock>

                {prices?.map(({ payment, price, convertedPrice }) => (
                    <StatsBlock key={payment}>
                        <StatsBlockLabel>{payment} floor price</StatsBlockLabel>
                        <StatsBlockValue>
                            {price} {payment}
                        </StatsBlockValue>
                        {convertedPrice && (
                            <StatsBlockLabel>
                                {convertedPrice}{" "}
                                {payment === "VET" ? "WoV" : "VET"}
                            </StatsBlockLabel>
                        )}
                    </StatsBlock>
                ))}

                <StatsBlock>
                    <StatsBlockLabel>Offers</StatsBlockLabel>
                    <StatsBlockValue>
                        {collection.stats.offersCount}
                    </StatsBlockValue>
                </StatsBlock>

                <StatsBlock>
                    <StatsBlockLabel>Collection offer</StatsBlockLabel>
                    <StatsBlockValue>
                        {collection.stats.highestCollectionOffer
                            ? `${formatNumber(
                                  formatPrice(
                                      collection.stats.highestCollectionOffer
                                          .price
                                  )
                              )} ${getPaymentFromContractAddress(
                                  collection.stats.highestCollectionOffer
                                      .addressVIP180
                              )}`
                            : "---"}
                    </StatsBlockValue>
                </StatsBlock>

                {!!collection.stakingContractAddresses?.length && (
                    <StatsBlock>
                        <StatsBlockLabel>NFT staked</StatsBlockLabel>
                        <StatsBlockValue>
                            {stakedPercent
                                ? `${stakedPercent.toFixed(2) || 0}%`
                                : "---"}
                        </StatsBlockValue>
                    </StatsBlock>
                )}
            </InnerContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`;

const InnerContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    background-color: ${neutrals[6]};
    background-clip: content-box;
    border-radius: 8px;
    overflow: hidden;

    ::before {
        content: "";
        border: 2px solid red;
        border-radius: 8px;
        height: 100%;
        width: 100%;
        position: absolute;
        border-color: ${neutrals[6]};

        ${dark`
            border-color: ${neutrals[3]};
        `};
    }

    ${dark`
        background-color: ${neutrals[3]};
    `};
`;

const StatsBlock = styled.div`
    min-width: 142px;
    height: 88px;
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 14px;
    justify-content: flex-start;
    padding: 10px 0px;
    text-align: center;
    margin: 1px;
    background-color: ${neutrals[8]};

    ${dark`
        background-color: ${neutrals[1]};
    `};
`;

const StatsBlockValue = styled.div`
    ${bodyBold1};
    font-size: 20px;
    padding: 0 16px;
    color: ${neutrals[2]};

    ${dark`
        color: ${neutrals[8]};
    `}
`;

const StatsBlockLabel = styled.div`
    ${caption1};
    color: ${neutrals[4]};

    ${dark`
        color: ${neutrals[5]};
    `}
`;

export default CollectionStats;
