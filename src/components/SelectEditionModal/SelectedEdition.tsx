import BigNumber from "bignumber.js";
import { useMemo } from "react";
import useConvertPrices from "../../hooks/useConvertPrices";
import { EditionData } from "../../types/EditionData";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import { Divider } from "../common/Divider";
import { Flex } from "../common/Flex";
import { Text } from "../common/Text";
import UserPreviewItem from "../UserPreviewItem";

interface SelectedEditionProps {
    edition: EditionData;
    onSelect: (edition: EditionData) => void;
}

const SelectedEdition: React.FC<SelectedEditionProps> = ({
    edition,
    onSelect,
}) => {
    const convertedPrices = useConvertPrices(
        edition.price ? [new BigNumber(edition.price)] : undefined,
        edition.payment
    );
    const otherCurrency = useMemo(() => {
        return edition.payment === "VET" ? "WoV" : "VET";
    }, [edition.payment]);

    return (
        <>
            <Flex alignItems="center" height={85}>
                <Text variant="captionBold1" flexBasis={{ _: "25%", a: "20%" }}>
                    {" "}
                    #{edition.editionNumber}
                </Text>
                <Box display={{ _: "none", a: "block" }} flexBasis="30%" pt={3}>
                    <UserPreviewItem user={edition.owner} />
                </Box>
                {edition.isOnSale ? (
                    <Text
                        variant="captionBold1"
                        color="text"
                        flexBasis={{ _: "40%", a: "30%" }}
                    >
                        {edition.formattedPrice} {edition.payment}{" "}
                        <Text
                            as="span"
                            variant="caption3"
                            color="accent"
                            whiteSpace="nowrap"
                        >
                            ≃
                            {convertedPrices &&
                                convertedPrices[0].formattedPrices[
                                    otherCurrency
                                ]}{" "}
                            {otherCurrency}
                        </Text>
                    </Text>
                ) : (
                    <Text flexBasis={{ _: "40%", a: "30%" }}>
                        {" "}
                        Not on sale{" "}
                    </Text>
                )}
                <Flex
                    justifyContent="flex-end"
                    flexBasis={{ _: "35%", a: "20%" }}
                >
                    <Button small onClick={() => onSelect(edition)}>
                        Select
                    </Button>
                </Flex>
            </Flex>
            <Divider />
        </>
    );
};

export default SelectedEdition;
