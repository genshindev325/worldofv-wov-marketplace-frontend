import { useContext } from "react";
import {
    BATCH_STAKE_MAX_COUNT,
    BATCH_UNSTAKE_TARGET_ID,
} from "../../../constants/batchSelect";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import { ActionButtonProps, BaseButton } from "../BaseButton";
import { ModalBatchUnstake } from "../ModalBatchUnstake";

export const UnstakeToken: ActionButtonProps<any> = (props) => {
    const tokenContext = useContext(TokenBatchSelectContext);

    const selectionTarget = {
        id: BATCH_UNSTAKE_TARGET_ID,
        validate: () => undefined,
        ModalContent: ModalBatchUnstake,
        submitLabel: "Unstake",
        onSubmit: () => {},
        maxSelectedCount: BATCH_STAKE_MAX_COUNT,
    };

    return (
        <>
            <BaseButton
                selectionTarget={selectionTarget}
                label="Unstake"
                context={tokenContext}
                {...props}
                fullWidth
            />
        </>
    );
};
