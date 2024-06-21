import Tippy from "@tippyjs/react";
import styled from "styled-components";
import mixins from "../../../styles/_mixins";

const { dark } = mixins;

export const Popup = styled(Tippy).attrs(() => ({
    arrow: false,
}))<{ rounded?: boolean; width?: number }>`
    background: ${({ theme }) => theme.colors.highlight};
    width: ${({ width }) => (width != null ? `${width}px` : "auto")};
    border-radius: ${({ rounded, theme }) =>
        rounded ? `${theme.radii[4]}px` : 0};
    box-shadow: 0px 16px 64px 0 rgba(31, 47, 70, 0.4);

    ${dark`
        box-shadow: 0px 4px 16px rgba(20, 20, 22, 0.4);
    `}

    & > .tippy-content {
        padding: 0;
        color: ${({ theme }) => theme.colors.text};
    }
`;
