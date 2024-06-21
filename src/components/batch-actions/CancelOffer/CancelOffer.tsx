import { useContext } from "react";
import { BATCH_OPERATION_MAX_COUNT } from "../../../constants/batchSelect";
import { OfferBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { OfferData } from "../../../types/OfferData";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchCancelOffer } from "../ModalBatchCancelOffer";

export const CancelOffer: ActionButtonProps<OfferData> = (props) => {
    const offerContext = useContext(OfferBatchSelectContext);

    const selectionTarget = {
        validate: () => undefined,
        ModalContent: ModalBatchCancelOffer,
        submitLabel: "Batch Cancel",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Cancel"
            context={offerContext}
            {...props}
        />
    );
};
