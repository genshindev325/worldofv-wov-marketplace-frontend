import styled from "styled-components";
import {
    border,
    BorderProps,
    color,
    ColorProps,
    flexbox,
    FlexboxProps,
    gridColumn,
    GridColumnProps,
    gridRow,
    GridRowProps,
    layout,
    LayoutProps,
    position,
    PositionProps,
    shadow,
    ShadowProps,
    space,
    SpaceProps,
} from "styled-system";

export type BoxProps = React.HTMLAttributes<HTMLDivElement> &
    SpaceProps &
    LayoutProps &
    ColorProps &
    BorderProps &
    FlexboxProps &
    PositionProps &
    GridColumnProps &
    GridRowProps &
    ShadowProps & {
        /**
         * Add border (debug purposes only)
         */
        debug?: boolean;
    };

export const Box = styled.div<BoxProps>`
    border: ${(props) =>
        props.debug ? `1px solid ${props.theme.colors.error}` : "unset"};
    cursor: ${(props) => (props.onClick != null ? "pointer" : "inherit")};

    ${space}
    ${layout}
    ${color}
    ${flexbox}
    ${position}
    ${gridColumn}
    ${gridRow}
    ${shadow}
    ${border}
`;
