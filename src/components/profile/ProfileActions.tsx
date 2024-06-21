import { userAddressSelector } from "@/store/selectors";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import { useProfile } from "../../providers/ProfileProvider";
import { isSameAddress } from "../../utils/isSameAddress";
import ActionCard from "../ActionCard";
import {
    ActionButtonProps,
    BuyToken,
    CancelOffer,
    OfferToken,
    SellToken,
    TransferToken,
    UnlistToken,
    UpdateOffer,
} from "../batch-actions";
import { Box } from "../common/Box";
import { Button } from "../common/Button";
import Icon from "../Icon";
import Link from "../Link";

const renderActionCard = (btns: ActionButtonProps<any>[]) => {
    if (btns.length === 0) return null;
    return (
        <ActionCard description="Select multiple items for batch actions">
            {btns.map((Btn) => (
                <Btn key={Btn.name} />
            ))}
        </ActionCard>
    );
};

interface ActionButtonsProps {
    /**
     * List of buttons to render when collection filter has been applied
     */
    collButtons: ActionButtonProps<any>[];
    /**
     * List of buttons to render when token type filter is set to `artist` (ART only)
     */
    artButtons: ActionButtonProps<any>[];
    /**
     * List of buttons to render for the remaining cases
     */
    restButtons: ActionButtonProps<any>[];
}

/**
 * Return the given configuration of buttons based on:
 * - current selected tab
 * - whether or not the collection filter is being applied
 * - whether or not the token type filter is being set to `artist`
 */
const ActionButtons: FC<ActionButtonsProps> = ({
    collButtons,
    artButtons,
    restButtons,
}) => {
    const { selectedCollectionId, selectedTokenType } = useProfile();

    const collectionSelected = selectedCollectionId != null;
    const artOnlySelected = selectedTokenType.value === "artist";

    if (collectionSelected) return renderActionCard(collButtons);
    else if (artOnlySelected) return renderActionCard(artButtons);
    return renderActionCard(restButtons);
};

export const ProfileActions = () => {
    const ownAddress = useRecoilValue(userAddressSelector);
    const { user, selectedTab } = useProfile();

    if (!user) {
        return null;
    }

    const lookingOwnProfile = isSameAddress(user?.address, ownAddress);

    // When looking at my own profile
    if (lookingOwnProfile) {
        switch (selectedTab.value) {
            case "collected":
                return (
                    <ActionButtons
                        collButtons={[SellToken, TransferToken]}
                        artButtons={[SellToken, TransferToken]}
                        restButtons={[]}
                    />
                );
            case "created":
                return (
                    <ActionButtons
                        collButtons={[SellToken, TransferToken]}
                        artButtons={[SellToken, TransferToken]}
                        restButtons={[SellToken, TransferToken]}
                    />
                );
            case "onsale":
                return (
                    <ActionButtons
                        collButtons={[/* UpdateToken, */ UnlistToken]}
                        artButtons={[/* UpdateToken, */ UnlistToken]}
                        restButtons={[]}
                    />
                );
            case "offers-received":
                return (
                    <Box mt="5">
                        <Link href="/profile/offer-settings" passHref>
                            <Button outline fullWidth>
                                <Icon icon="coin" />
                                Offer Settings
                            </Button>
                        </Link>
                    </Box>
                );
            case "offers-made":
                return (
                    <ActionButtons
                        collButtons={[CancelOffer, UpdateOffer]}
                        artButtons={[CancelOffer, UpdateOffer]}
                        restButtons={[CancelOffer, UpdateOffer]}
                    />
                );
            default:
                return null;
        }
    }

    // When looking at other user's profile
    else {
        switch (selectedTab.value) {
            case "collected":
                return (
                    <ActionButtons
                        collButtons={[BuyToken, OfferToken]}
                        artButtons={[BuyToken, OfferToken]}
                        restButtons={[]}
                    />
                );
            case "created":
                return (
                    <ActionButtons
                        collButtons={[BuyToken, OfferToken]}
                        artButtons={[BuyToken, OfferToken]}
                        restButtons={[BuyToken, OfferToken]}
                    />
                );
            case "onsale":
                return (
                    <ActionButtons
                        collButtons={[BuyToken, OfferToken]}
                        artButtons={[BuyToken, OfferToken]}
                        restButtons={[]}
                    />
                );
            case "offers-made":
                return (
                    <ActionButtons
                        collButtons={[]}
                        artButtons={[]}
                        restButtons={[]}
                    />
                );
            default:
                return null;
        }
    }
};
