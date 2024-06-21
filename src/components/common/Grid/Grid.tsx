import styled from "styled-components";
import {
    border,
    BorderProps,
    color,
    ColorProps,
    flex,
    flexBasis,
    FlexBasisProps,
    FlexProps,
    grid,
    GridProps as StyledSystemGridProps,
    justifyContent,
    JustifyContentProps,
    justifyItems,
    JustifyItemsProps,
    layout,
    LayoutProps,
    space,
    SpaceProps,
} from "styled-system";

export interface GridProps
    extends StyledSystemGridProps,
        SpaceProps,
        LayoutProps,
        ColorProps,
        BorderProps,
        FlexBasisProps,
        FlexProps,
        JustifyContentProps,
        JustifyItemsProps {}

export const Grid = styled.div<GridProps>`
    display: grid;
    ${grid}
    ${space}
    ${layout}
    ${color}
    ${border}
    ${flexBasis}
    ${flex}
    ${justifyContent}
    ${justifyItems}
`;
