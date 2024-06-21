import { useContext } from "react";
import {
    BATCH_OFFER_TARGET_ID,
    BATCH_OPERATION_MAX_COUNT,
} from "../../../constants/batchSelect";
import useBatchSelectValidators from "../../../hooks/useBatchSelectValidators";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchOffer } from "../ModalBatchOffer";

export const OfferToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);
    const validators = useBatchSelectValidators();

    const selectionTarget = {
        id: BATCH_OFFER_TARGET_ID,
        validate: validators[BATCH_OFFER_TARGET_ID],
        ModalContent: ModalBatchOffer,
        submitLabel: "Batch Offer",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Offer"
            context={tokenContext}
            {...props}
        />
    );
};
