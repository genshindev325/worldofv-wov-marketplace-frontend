import { useContext } from "react";
import {
    BATCH_STAKE_MAX_COUNT,
    BATCH_STAKE_TARGET_ID,
} from "../../../constants/batchSelect";
import useBatchSelectValidators from "../../../hooks/useBatchSelectValidators";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchStake } from "../ModalBatchStake";

export const StakeToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);
    const validators = useBatchSelectValidators();

    const selectionTarget = {
        id: BATCH_STAKE_TARGET_ID,
        validate: validators[BATCH_STAKE_TARGET_ID],
        ModalContent: ModalBatchStake,
        submitLabel: "Stake",
        onSubmit: () => {},
        maxSelectedCount: BATCH_STAKE_MAX_COUNT,
    };

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Stake"
            context={tokenContext}
            {...props}
        />
    );
};
