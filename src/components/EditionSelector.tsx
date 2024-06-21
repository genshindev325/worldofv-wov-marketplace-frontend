import { Box } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import { EditionData } from "@/types/EditionData";
import { TokenData } from "@/types/TokenData";
import BigNumber from "bignumber.js";
import React from "react";
import styled from "styled-components";
import useConvertPrices from "../hooks/useConvertPrices";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";

const { dark } = mixins;
const {
    colors: { neutrals },
    typography: { caption1, captionBold1 },
} = variables;

interface EditionSelectorProps {
    token: TokenData;
    selectedEdition: EditionData;
    onClick?: (e: any) => void;
    ownedEditionsCount: any;
}

const EditionSelector: React.FC<EditionSelectorProps> = ({
    token,
    selectedEdition,
    onClick,
    ownedEditionsCount,
}) => {
    const convertedPrice = useConvertPrices(
        selectedEdition?.price
            ? [new BigNumber(selectedEdition.price)]
            : undefined,
        selectedEdition?.payment
    );
    const otherCurrency = React.useMemo(() => {
        return selectedEdition?.payment === "VET" ? "WoV" : "VET";
    }, [selectedEdition]);

    if (token?.collection?.type === "EXTERNAL" || token.editionsCount < 2) {
        if (!selectedEdition?.isOnSale) return null;
        return (
            <Box mb={3}>
                <Text>Current price</Text>
                <Flex alignItems="flex-end" rowGap={1} mt={2}>
                    <Text
                        variant="bodyBold2"
                        fontSize={{ _: 4, m: 5 }}
                        lineHeight={1}
                        fontWeight="bold"
                    >
                        {selectedEdition.formattedPrice}{" "}
                        {selectedEdition.payment}{" "}
                    </Text>
                    <Text variant="caption3" color="accent" lineHeight={4}>
                        {convertedPrice &&
                            convertedPrice[0].formattedPrices[
                                otherCurrency
                            ]}{" "}
                        {otherCurrency}
                    </Text>
                </Flex>
            </Box>
        );
    }

    return (
        <Container {...{ onClick }}>
            <EditionCountsContainer>
                <EditionCount>
                    {token.editions.length} Editions Minted
                </EditionCount>
                <EditionOwnedCount>
                    Owned: {ownedEditionsCount}
                </EditionOwnedCount>
            </EditionCountsContainer>

            <Selector>
                {selectedEdition ? (
                    <>
                        <Edition>
                            Edition #
                            {selectedEdition.editionNumber
                                .toString()
                                .padStart(
                                    token.editionsCount.toString().length,
                                    "0"
                                )}
                        </Edition>

                        {selectedEdition.isOnSale && (
                            <Box>
                                <Text>
                                    {selectedEdition.formattedPrice}{" "}
                                    {selectedEdition.payment}{" "}
                                </Text>
                                <Text variant="caption3" color="accent">
                                    (≃
                                    {convertedPrice &&
                                        convertedPrice[0].formattedPrices[
                                            otherCurrency
                                        ]}{" "}
                                    {otherCurrency})
                                </Text>
                            </Box>
                        )}
                    </>
                ) : (
                    <Edition>Select an edition</Edition>
                )}
            </Selector>
        </Container>
    );
};

const Container = styled.div``;

const EditionCountsContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const EditionCount = styled.div`
    ${caption1};
    margin-bottom: 8px;
    color: ${neutrals[4]};
`;

const EditionOwnedCount = styled.div`
    ${caption1};
    margin-bottom: 8px;
    color: ${neutrals[4]};
`;

const Selector = styled.div`
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 56px 0 14px;
    width: 100%;
    border-radius: ${({ theme }) => theme.radii[3]}px;
    border: 2px solid ${neutrals[6]};
    background: none;

    ${captionBold1}
    transition: border-color 0.2s;

    ${dark`
        border-color: ${neutrals[3]};
        color: ${neutrals[8]};
    `}

    &::placeholder {
        color: ${neutrals[4]};
    }

    &:focus {
        border-color: ${neutrals[4]};

        ${dark`
            border-color: ${neutrals[4]};
        `}
    }

    &::before {
        content: "";
        position: absolute;
        top: 50%;
        right: 8px;
        width: 32px;
        height: 32px;
        transform: translateY(-50%) rotate(-90deg);
        border-radius: 50%;
        box-shadow: inset 0 0 0 2px ${neutrals[6]};
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' viewBox='0 0 10 6'%3E%3Cpath fill-rule='evenodd' d='M9.207.793a1 1 0 0 0-1.414 0L5 3.586 2.207.793A1 1 0 1 0 .793 2.207l3.5 3.5a1 1 0 0 0 1.414 0l3.5-3.5a1 1 0 0 0 0-1.414z' fill='%23777e91'/%3E%3C/svg%3E")
            no-repeat 50% 50% / 10px auto;
        transition: transform 0.2s;
    }

    &:hover {
        border-color: ${neutrals[4]};
    }
`;

const Edition = styled.div`
    color: ${neutrals[3]};
`;

const Value = styled.div`
    color: ${neutrals[4]};
`;

export default EditionSelector;
