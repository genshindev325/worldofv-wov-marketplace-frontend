import { FC } from "react";
import styled from "styled-components";
import { Field } from "./Field";

export type PropertiesInputProps = {
    onClick?: () => void;
};

export const PropertiesInput: FC<PropertiesInputProps> = ({
    onClick = () => {},
}) => <StyledField onClick={onClick}>Properties</StyledField>;

const StyledField = styled(Field)`
    cursor: pointer;
    position: relative;

    border-radius: ${({ theme }) => theme.radii[3]}px;
    border: 2px solid ${({ theme }) => theme.colors.muted};
    padding: 0px 14px;
    height: 48px;

    &::before {
        content: "\\e918";
        font-family: "wov-icons";
        position: absolute;
        top: 50%;
        right: 8px;
        width: 32px;
        height: 32px;
        transform: translateY(-50%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        color: ${({ theme }) => theme.colors.text};
        box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.muted};
    }
`;
