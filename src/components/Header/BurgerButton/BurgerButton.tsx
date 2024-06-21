import clsx from "clsx";
import styled from "styled-components";

/**
 * @param {boolean} open
 */
export const BurgerButton = styled.button.attrs<{ open?: boolean }>(
    ({ open: active }) => ({
        className: clsx({ active }),
    })
)`
    z-index: 4;
    display: block;
    position: relative;
    width: 32px;
    height: 32px;
    background: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &.active {
        &::before {
            transform: translateY(0) rotate(-45deg);
        }

        &::after {
            transform: translateY(0) rotate(45deg);
        }
    }

    &::before,
    &::after {
        content: "";
        position: absolute;
        top: 16px;
        left: 6px;
        width: 20px;
        height: 2px;
        background: ${({ theme }) => theme.colors.accent};
        border-radius: 2px;
        transition: transform 0.2s;
    }

    &::before {
        transform: translateY(-4px);
    }

    &::after {
        transform: translateY(3px);
    }
`;
