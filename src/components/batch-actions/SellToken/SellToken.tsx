import { useContext } from "react";
import {
    BATCH_OPERATION_MAX_COUNT,
    BATCH_SALE_TARGET_ID,
} from "../../../constants/batchSelect";
import useBatchSelectValidators from "../../../hooks/useBatchSelectValidators";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchSale } from "../ModalBatchSale";

export const SellToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);
    const validators = useBatchSelectValidators();

    const selectionTarget = {
        id: BATCH_SALE_TARGET_ID,
        validate: validators[BATCH_SALE_TARGET_ID],
        ModalContent: ModalBatchSale,
        submitLabel: "Batch Sell",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Sell"
            context={tokenContext}
            {...props}
        />
    );
};
