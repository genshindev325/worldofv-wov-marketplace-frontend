import { useCallback, useMemo } from "react";
import styled from "styled-components";
import { isSameAddress } from "../../utils/isSameAddress";
import OfferList from "../OfferList";
import ProductDetailAccordion from "./ProductDetailAccordion";
import { useItem } from "./ProductDetailProvider";

export default function ProductDetailOffers() {
    const item = useItem();

    const refreshOffers = useCallback(async () => {
        await Promise.all([
            item?.mutateOffers(),
            item?.mutateToken(),
            item?.mutateEditions(),
        ]);
    }, [item]);

    const offers = useMemo(
        () =>
            item.token.activeOffers?.filter(
                (o) =>
                    !isSameAddress(
                        o.bidderAddress,
                        item.selectedEdition?.owner?.address
                    )
            ),
        [item.selectedEdition?.owner?.address, item.token.activeOffers]
    );

    if (!item.token) return null;

    return (
        <StyledAccordion title="Offers" count={offers?.length} offers={offers}>
            <OfferList
                offers={offers}
                refreshOffers={refreshOffers}
                isNftPage
                // To fix this, fast workaround!
                isValidating={false}
            />
        </StyledAccordion>
    );
}

const StyledAccordion = styled(ProductDetailAccordion)`
    margin: 40px 0;
`;
