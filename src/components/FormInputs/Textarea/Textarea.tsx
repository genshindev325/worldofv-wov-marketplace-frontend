import React from "react";
import styled from "styled-components";
import { Field } from "../Field";
import { FormInputProps } from "../Form";

interface InputProps extends FormInputProps {
    label?: string;
    inputProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

export const Textarea: React.FC<InputProps> = ({
    label,
    inputProps,
    register,
}) => (
    <StyledField {...{ label }} inputStyle={{ paddingRight: 0 }}>
        <FieldTextarea
            {...inputProps}
            {...(register ? register(inputProps?.name!) : {})}
        />
    </StyledField>
);

const StyledField = styled(Field)`
    textarea {
        border-radius: ${({ theme }) => theme.radii[3]}px;
        border: 2px solid ${({ theme }) => theme.colors.muted};
        padding: 10px 14px;
    }
`;
const FieldTextarea = styled.textarea`
    height: 96px;
    padding-right: 14px;
    resize: none;
`;
