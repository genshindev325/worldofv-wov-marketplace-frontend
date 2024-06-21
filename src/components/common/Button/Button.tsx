import clsx from "clsx";
import styled, { css } from "styled-components";
import Loader from "../../Loader";

interface ButtonProps {
    small?: boolean;
    outline?: boolean;
    error?: boolean;
    warning?: boolean;
    impact?: boolean;
    loader?: boolean;
    fullWidth?: boolean;
}

export const Button_Style1 = css`
    font-family: ${({ theme }) => theme.fonts.DM_Sans};
    font-size: 16px;
    line-height: 1;
    font-weight: 700;
`;

export const Button_Style2 = css`
    font-family: ${({ theme }) => theme.fonts.DM_Sans};
    font-size: 14px;
    line-height: ${16 / 14};
    font-weight: 700;
`;

const ButtonOutline = css`
    background: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.muted} inset;
    color: ${({ theme }) => theme.colors.accent};

    .icon {
        color: ${({ theme }) => theme.colors.accent};
        transition: color 0.2s;
    }

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary} inset;
        color: ${({ theme }) => theme.colors.white};

        .icon {
            color: ${({ theme }) => theme.colors.white};
        }
    }
`;

const ButtonSmall = css`
    height: 40px;
    border-radius: 20px;
    padding: 0 16px;
    font-size: 14px;
`;

export const Button = styled.button.attrs<ButtonProps>(
    ({
        type,
        small,
        outline,
        error,
        warning,
        impact,
        loader,
        fullWidth,
        children,
    }) => ({
        type: type || "button",
        className: clsx({
            small,
            outline,
            error,
            warning,
            impact,
            loader,
            fullWidth,
        }),
        children: loader ? <Loader /> : children,
    })
)<ButtonProps>`
    appearance: none !important;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    padding: 0 24px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 24px;
    ${Button_Style1};
    text-align: center;
    color: ${({ theme }) => theme.colors.white};
    transition: all 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.primaryDark10};
    }

    &:disabled,
    &.disabled,
    &.loader {
        opacity: 0.5;
        pointer-events: none;
    }

    &.done {
        background: ${({ theme }) => theme.colors.neutral};
    }

    &.loader {
        ${Loader} {
            margin: -4px;
        }
    }

    &.fullWidth {
        width: 100%;
    }

    &.small {
        ${ButtonSmall};
    }

    &.outline {
        ${ButtonOutline}
    }

    &.error {
        background: none !important;
        color: ${({ theme }) => theme.colors.error} !important;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.error} inset !important;

        &:hover {
            color: ${({ theme }) => theme.colors.white} !important;
            background-color: ${({ theme }) => theme.colors.error} !important;
        }
    }

    &.warning {
        background: none !important;
        color: ${({ theme }) => theme.colors.warningDark15} !important;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.warningDark15} inset !important;

        &:hover {
            color: ${({ theme }) => theme.colors.white} !important;
            background-color: ${({ theme }) =>
                theme.colors.warningDark15} !important;
        }
    }

    &.impact {
        background: ${({ theme }) => theme.colors.text} !important;
        color: ${({ theme }) => theme.colors.background} !important;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.text} inset !important;
    }

    .icon {
        color: ${({ theme }) => theme.colors.white};

        &:first-child {
            margin-right: 15px;
        }

        &:last-child {
            margin-left: 15px;
        }
    }
`;
