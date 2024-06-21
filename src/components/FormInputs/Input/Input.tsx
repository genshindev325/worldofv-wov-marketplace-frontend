import _ from "lodash";
import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import styled from "styled-components";
import CircleButton from "../../CircleButton";
import { Box } from "../../common/Box";
import Icon from "../../Icon";
import { Field } from "../Field";
import { FormInputProps } from "../Form";

export interface InputProps<T extends object = any> extends FormInputProps {
    label?: string;
    description?: string;
    rightLabel?: string;
    buttonIcon?: string;
    rightDecoration?: React.ReactNode;
    register?: UseFormRegister<T>;
    errors?: FieldErrors<T>;
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
    onButtonClick?: Function;
    setIsFocus?: (value: boolean) => void | undefined;
    borderRadius?: number;
}

export const Input: React.FC<InputProps> = ({
    label,
    description,
    rightLabel,
    buttonIcon,
    rightDecoration,
    register,
    errors,
    inputProps,
    onButtonClick,
    setIsFocus,
    borderRadius = 3,
}) => {
    const handleClick = (e: any) => {
        if (typeof onButtonClick === "function") {
            onButtonClick();
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            handleClick(e);
        }
    };
    const handleBlur = () => {
        if (setIsFocus) setTimeout(() => setIsFocus(false), 200);
    };
    const handleFocus = () => {
        if (setIsFocus) setIsFocus(true);
    };
    return (
        <StyledField
            {...{ label, description, rightLabel, buttonIcon }}
            readOnly={inputProps?.readOnly}
            error={_.get(errors, inputProps.name!)?.message}
            borderRadius={borderRadius}
        >
            {inputProps.prefix && (
                <FieldPrefix>{inputProps.prefix}</FieldPrefix>
            )}

            <input
                onKeyPress={buttonIcon ? handleKeyPress : undefined}
                {...inputProps}
                {...(register != null
                    ? register(inputProps.name!, {
                          valueAsNumber: inputProps?.type === "number",
                      })
                    : {})}
                onBlur={handleBlur}
                onFocus={handleFocus}
            />

            <Box position="absolute" right={2}>
                {rightDecoration}
            </Box>

            {buttonIcon && (
                <CircleButton outline borderless small onClick={handleClick}>
                    <Icon icon={buttonIcon} />
                </CircleButton>
            )}
        </StyledField>
    );
};

const StyledField = styled(Field)<{ borderRadius: number }>`
    position: relative;
    width: 100%;

    input {
        border-radius: ${({ theme, borderRadius }) =>
            borderRadius < theme.radii.length
                ? theme.radii[borderRadius]
                : borderRadius}px;
        border: 2px solid ${({ theme }) => theme.colors.muted};
        padding: 10px 14px;
        height: 100%;
        padding-right: ${({ buttonIcon }) => (buttonIcon ? "48px" : "initial")};
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            appearance: none !important;
        }

        &[type="number"] {
            -moz-appearance: textfield;
        }
        &:focus-within {
            border-color: ${({ theme }) => theme.colors.accent};
        }
    }

    ${CircleButton} {
        position: absolute;
        width: 32px;
        height: 32px;
        flex: 0 0 32px;

        right: 8px;
    }
`;

const FieldPrefix = styled.span`
    white-space: nowrap;
`;
