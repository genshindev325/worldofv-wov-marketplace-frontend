import { useContext } from "react";
import {
    BATCH_OPERATION_MAX_COUNT,
    BATCH_UPDATE_PRICE_TARGET_ID,
} from "../../../constants/batchSelect";
import useBatchSelectValidators from "../../../hooks/useBatchSelectValidators";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchUpdatePrice } from "../ModalBatchUpdatePrice";

export const UpdateToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);
    const validators = useBatchSelectValidators();

    const selectionTarget = {
        id: BATCH_UPDATE_PRICE_TARGET_ID,
        validate: validators[BATCH_UPDATE_PRICE_TARGET_ID],
        ModalContent: ModalBatchUpdatePrice,
        submitLabel: "Update Prices",
        onSubmit: () => {},
        maxSelectedCount: BATCH_OPERATION_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Update Prices"
            context={tokenContext}
            {...props}
        />
    );
};
