import clsx from "clsx";
import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { FormInputProps } from "./Form";

const { dark } = mixins;
const {
    colors: { blue, neutrals },
} = variables;

interface SwitchProps extends FormInputProps {
    small?: boolean;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const Switch: React.FC<SwitchProps> = ({ small, inputProps, register }) => (
    <Container className={clsx("switch", { small })}>
        <Input
            type="checkbox"
            {...inputProps}
            {...(register ? register(inputProps?.name!) : {})}
        />

        <SwitchInner>
            <SwitchBox />
        </SwitchInner>
    </Container>
);

const SwitchInner = styled.span`
    position: relative;
    display: inline-block;
    transition: all 0.2s;
`;

const SwitchBox = styled.span<SwitchProps>`
    position: relative;
    display: block;
    width: 48px;
    height: 24px;
    background: ${neutrals[6]};
    border-radius: ${({ theme }) => theme.radii[3]}px;
    transition: all 0.2s;

    ${dark`
        background: ${neutrals[3]};
    `}

    &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 4px;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${blue};
        transition: all 0.2s;
    }
`;

const Input = styled.input`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;

    &:checked + ${SwitchInner} ${SwitchBox} {
        background: ${blue};

        &::before {
            transform: translate(24px, -50%);
            background: ${neutrals[8]};
        }
    }
`;

const Container = styled.label`
    display: inline-block;
    position: relative;
    user-select: none;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-size: 0;

    &.small {
        ${SwitchBox} {
            width: 40px;
            height: 20px;

            &::before {
                width: 12px;
                height: 12px;
            }
        }

        ${Input} {
            &:checked + ${SwitchInner} ${SwitchBox} {
                &::before {
                    transform: translate(20px, -50%);
                }
            }
        }
    }
`;

export default Switch;
