import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { FormInputProps } from "./Form";

const { dark } = mixins;
const {
    colors: { neutrals, blue },
    typography: { caption2 },
} = variables;

interface CheckboxProps extends FormInputProps {
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const Checkbox: React.FC<React.PropsWithChildren<CheckboxProps>> = ({
    register,
    inputProps,
    children,
}) => (
    <Container className="checkbox">
        <Input
            type="checkbox"
            {...inputProps}
            {...(register ? register(inputProps?.name!) : {})}
        />

        <ContainerInner>
            <CheckboxSquare />

            <CheckboxText>{children}</CheckboxText>
        </ContainerInner>
    </Container>
);

const Container = styled.label`
    display: inline-block;
    position: relative;
    cursor: pointer;
`;

const CheckboxSquare = styled.span`
    position: relative;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-right: 12px;
    border-radius: 4px;
    border: 2px solid ${neutrals[6]};
    transition: all 0.2s;

    ${dark`
        background: none;
        border-color: ${neutrals[3]};
    `}

    &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 10px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='10' fill='none' viewBox='0 0 14 10'%3E%3Cpath fill-rule='evenodd' d='M13.707.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L5 7.586 12.293.293a1 1 0 0 1 1.414 0z' fill='%23fcfcfd'/%3E%3C/svg%3E")
            no-repeat 50% 50% / 100% auto;
        opacity: 0;
        transition: opacity 0.2s;
    }
`;

const ContainerInner = styled.span`
    display: flex;

    &:hover {
        > ${CheckboxSquare} {
            border-color: ${blue};
        }
    }
`;

const Input = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;

    &:checked + ${ContainerInner} ${CheckboxSquare} {
        background: ${blue};
        border-color: ${blue};

        &:before {
            opacity: 1;
        }
    }
`;

const CheckboxText = styled.span`
    ${caption2}
    color: ${neutrals[4]};

    a,
    span,
    strong {
        font-weight: 600;
        color: ${neutrals[2]};
        transition: color 0.2s;

        ${dark`
            color: ${neutrals[8]};
        `}

        &:hover {
            color: ${blue} !important;
        }
    }

    a {
        cursor: pointer;
    }
`;

export default Checkbox;
