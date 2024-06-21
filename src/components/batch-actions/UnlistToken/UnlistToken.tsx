import { useContext } from "react";
import {
    BATCH_OPERATION_MAX_COUNT,
    BATCH_UNLIST_TARGET_ID,
} from "../../../constants/batchSelect";
import useBatchSelectValidators from "../../../hooks/useBatchSelectValidators";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchUnlist } from "../ModalBatchUnlist";

export const UnlistToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);
    const validators = useBatchSelectValidators();

    const selectionTarget = {
        id: BATCH_UNLIST_TARGET_ID,
        validate: validators[BATCH_UNLIST_TARGET_ID],
        ModalContent: ModalBatchUnlist,
        submitLabel: "Batch Cancel",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };
    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Cancel"
            context={tokenContext}
            {...props}
        />
    );
};
