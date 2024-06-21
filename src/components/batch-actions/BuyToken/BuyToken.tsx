import { useContext } from "react";
import {
    BATCH_OPERATION_MAX_COUNT,
    BATCH_PURCHASE_TARGET_ID,
} from "../../../constants/batchSelect";
import useBatchSelectValidators from "../../../hooks/useBatchSelectValidators";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchPurchase } from "../ModalBatchPurchase";

export const BuyToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);
    const validators = useBatchSelectValidators();

    const selectionTarget = {
        id: BATCH_PURCHASE_TARGET_ID,
        validate: validators[BATCH_PURCHASE_TARGET_ID],
        ModalContent: ModalBatchPurchase,
        submitLabel: "Batch Buy",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Buy"
            context={tokenContext}
            {...props}
        />
    );
};
