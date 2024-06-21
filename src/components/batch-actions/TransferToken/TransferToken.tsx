import { useContext } from "react";
import {
    BATCH_OPERATION_MAX_COUNT,
    BATCH_TRANSFER_TARGET_ID,
} from "../../../constants/batchSelect";
import useBatchSelectValidators from "../../../hooks/useBatchSelectValidators";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchTransfer } from "../ModalBatchTransfer";

export const TransferToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);
    const validators = useBatchSelectValidators();

    const selectionTarget = {
        id: BATCH_TRANSFER_TARGET_ID,
        validate: validators[BATCH_TRANSFER_TARGET_ID],
        ModalContent: ModalBatchTransfer,
        submitLabel: "Transfer",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Transfer"
            context={tokenContext}
            {...props}
        />
    );
};
