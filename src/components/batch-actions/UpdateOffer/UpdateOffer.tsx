import { useContext } from "react";
import { BATCH_OPERATION_MAX_COUNT } from "../../../constants/batchSelect";
import { OfferBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { OfferData } from "../../../types/OfferData";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchUpdateOffer } from "../ModalBatchUpdateOffer";

export const UpdateOffer: ActionButtonProps<OfferData> = (props) => {
    const offerContext = useContext(OfferBatchSelectContext);

    const selectionTarget = {
        validate: () => undefined,
        ModalContent: ModalBatchUpdateOffer,
        submitLabel: "Batch Update",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Update"
            context={offerContext}
            {...props}
        />
    );
};
