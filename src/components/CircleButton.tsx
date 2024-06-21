import clsx from "clsx";
import { darken } from "polished";
import styled, { css } from "styled-components";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";

const { dark } = mixins;
const {
    colors: { blue, neutrals },
} = variables;

interface CircleButtonProps {
    small?: boolean;
    outline?: boolean;
    ui?: boolean;
    button?: boolean;
    borderless?: boolean;
}

const CircleButtonOutline = css`
    box-shadow: 0 0 0 2px ${neutrals[6]} inset;
    background: transparent;

    &,
    .icon {
        color: ${neutrals[4]};
    }

    &:hover {
        background: ${blue};
        box-shadow: 0 0 0 2px ${blue} inset;

        &,
        .icon {
            color: ${neutrals[8]};
        }
    }

    ${dark`
        box-shadow: 0 0 0 2px ${neutrals[3]} inset;

        &:hover {
            background: ${neutrals[3]};
        }
    `}
`;

const CircleButtonSmall = css`
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
`;

const CircleButtonBorderless = css`
    box-shadow: none !important;
`;

const CircleButton = styled.button.attrs<CircleButtonProps>(
    ({ small, outline, ui, button, borderless }) => ({
        className: clsx({ small, outline, borderless }),
    })
)<CircleButtonProps>`
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
    background: ${blue};
    color: ${neutrals[8]};
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    .icon {
        margin: 0;
        color: ${neutrals[8]};
    }

    &:hover {
        background: ${darken(0.1, blue)};
    }

    &:disabled,
    .disabled {
        opacity: 0.5;
        pointer-events: none;
    }
    &.outline {
        ${CircleButtonOutline}
    }

    &.small {
        ${CircleButtonSmall};
    }

    &.borderless {
        ${CircleButtonBorderless}
    }
`;

export default CircleButton;
