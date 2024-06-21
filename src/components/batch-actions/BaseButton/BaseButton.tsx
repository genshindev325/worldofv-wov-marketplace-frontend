import { useUserData } from "@/hooks/useUserData";
import { FC } from "react";
import styled from "styled-components";
import useRedirectAnonymous from "../../../hooks/useRedirectAnonymous";
import {
    BatchSelectContext,
    SelectionTarget,
} from "../../../providers/BatchSelectProvider";
import { Button } from "../../common/Button";

export interface BaseButtonProps<T> {
    selectionTarget?: SelectionTarget<T>;
    label: string;
    context: Pick<
        BatchSelectContext<T>,
        "setSelecting" | "setSelectionTarget" | "isSelecting"
    >;
    small?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    delegationInfo?: Record<string, any>;
    collectionName?: string;
}

export const BaseButton: FC<BaseButtonProps<any>> = ({
    selectionTarget,
    label,
    context,
    small = true,
    fullWidth = false,
    onClick = () => {},
    disabled,
}) => {
    const { redirectAnonymous } = useRedirectAnonymous();
    const { setSelecting, setSelectionTarget, isSelecting } = context;
    const { user } = useUserData();

    return (
        <StyledButton
            small={small}
            disabled={isSelecting || user?.blacklisted || disabled}
            fullWidth={fullWidth}
            onClick={redirectAnonymous(() => {
                if (selectionTarget != null) {
                    setSelectionTarget(selectionTarget);
                    setSelecting(true);
                }
                onClick();
            })}
        >
            {label}
        </StyledButton>
    );
};

const StyledButton = styled(Button)<{ fullWidth: boolean }>`
    width: ${(props) => (props.fullWidth ? "100%" : "auto")};
    min-width: ${(props) => (props.fullWidth ? "100%" : "auto")};
`;

export type ActionButtonProps<T> = FC<
    Pick<
        BaseButtonProps<T>,
        | "onClick"
        | "fullWidth"
        | "small"
        | "disabled"
        | "delegationInfo"
        | "collectionName"
    >
>;
