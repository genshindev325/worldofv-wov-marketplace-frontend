import { FC, useMemo } from "react";
import useAllowedBatchActions from "../../../hooks/useAllowedBatchActions";
import AnimatedModal from "../../../modals/AnimatedModal";
import {
    BuyToken,
    OfferToken,
    SellToken,
    StakeToken,
    TransferToken,
    UnlistToken,
    UnstakeToken,
} from "../../batch-actions";
import { Grid } from "../../common/Grid";

interface ModalBatchSelectProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
}

export const ModalBatchSelect: FC<ModalBatchSelectProps> = ({
    isOpen,
    setIsOpen,
}) => {
    const {
        canBatchSell,
        canBatchBuy,
        canBatchStake,
        canBatchUnstake,
        canBatchOffer,
        canBatchTransfer,
        canBatchUnlist,
    } = useAllowedBatchActions();

    const buttonProps = useMemo(
        () => ({
            fullWidth: true,
            onClick: () => {
                setIsOpen(false);
            },
        }),
        [setIsOpen]
    );

    const actions = [
        {
            id: "SellToken",
            Comp: SellToken,
            props: buttonProps,
            display: canBatchSell,
        },
        {
            id: "BuyToken",
            Comp: BuyToken,
            props: buttonProps,
            display: canBatchBuy,
        },
        {
            id: "StakeToken",
            Comp: StakeToken,
            props: buttonProps,
            display: canBatchStake,
        },
        {
            id: "UnstakeToken",
            Comp: UnstakeToken,
            props: buttonProps,
            display: canBatchUnstake,
        },
        {
            id: "OfferToken",
            Comp: OfferToken,
            props: buttonProps,
            display: canBatchOffer,
        },
        {
            id: "TransferToken",
            Comp: TransferToken,
            props: buttonProps,
            display: canBatchTransfer,
        },
        {
            id: "UnlistToken",
            Comp: UnlistToken,
            props: buttonProps,
            display: canBatchUnlist,
        },
    ];

    return (
        <AnimatedModal
            title="Batch actions"
            info="Select multiple items for batch actions."
            {...{ isOpen, setIsOpen }}
        >
            <Grid gridRowGap={3}>
                {actions.map(({ id, Comp, props, display }) =>
                    display ? <Comp key={id} {...props} /> : null
                )}
            </Grid>
        </AnimatedModal>
    );
};
