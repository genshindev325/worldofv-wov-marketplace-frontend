import React from "react";
import styled from "styled-components";
import variables from "../../styles/_variables";
import { FormInputProps } from "./Form";
import Switch from "./Switch";

const {
    colors: { neutrals },
    typography: { bodyBold2, caption2 },
} = variables;

interface SwitchFieldProps extends FormInputProps {
    label: string;
    description?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    className?: string;
}

const SwitchField: React.FC<SwitchFieldProps> = ({
    label,
    description,
    inputProps,
    register,
    className,
}) => (
    <Container className={className}>
        <TextContainer>
            <Label>{label}</Label>

            {description && <Description>{description}</Description>}
        </TextContainer>

        <Switch {...{ inputProps, register }} />
    </Container>
);

const Container = styled.div`
    display: flex;
    align-items: center;

    &:not(:last-child) {
        margin-bottom: 32px;
    }

    .switch {
        margin-left: 24px;
    }
`;

const TextContainer = styled.div`
    flex-grow: 1;
`;

const Label = styled.div`
    ${bodyBold2}
`;

const Description = styled.div`
    margin-top: 4px;
    ${caption2}
    color: ${neutrals[4]};
    white-space: pre-line;
`;

export default SwitchField;
