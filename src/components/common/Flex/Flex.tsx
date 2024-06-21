import { isNumber } from "lodash";
import { FC } from "react";
import styled, {
    css,
    FlattenSimpleInterpolation,
    useTheme,
} from "styled-components";
import {
    RequiredTheme,
    ResponsiveValue,
    Theme,
    ThemeValue,
} from "styled-system";
import { Box, BoxProps } from "../Box";

function gapCss(direction: string, value: number, space: number[]) {
    if (direction.includes("row")) {
        return css`
            > * + * {
                margin-left: ${value < space.length ? space[value] : value}px;
            }
        `;
    }
    if (direction.includes("column")) {
        return css`
            > * + * {
                margin-top: ${value < space.length ? space[value] : value}px;
            }
        `;
    }
    return "";
}

export interface FlexProps<
    ThemeType extends Theme = RequiredTheme,
    TVal = ThemeValue<"space", ThemeType>
> extends BoxProps {
    /**
     * Row gap
     * In case the provided value is within the 0 to 9 range, we
     * use the following formula:
     * size = 0 -> 0 px
     * size = 1 -> 4 px
     * size = 2 -> 8 px
     * size = 3 -> 16 px
     * size = 4 -> 24 px
     * size = 5 -> 32 px
     * size = 6 -> 64 px
     * size = 7 -> 128 px
     * size = 8 -> 256 px
     * size = 9 -> 512 px
     * Otherwise, for size value greater than 9, we use the provided value
     * as the px value
     */
    rowGap?: ResponsiveValue<TVal, ThemeType> | undefined;
    /**
     * Column gap
     * In case the provided value is within the 0 to 9 range, we
     * use the following formula:
     * size = 0 -> 0 px
     * size = 1 -> 4 px
     * size = 2 -> 8 px
     * size = 3 -> 16 px
     * size = 4 -> 24 px
     * size = 5 -> 32 px
     * size = 6 -> 64 px
     * size = 7 -> 128 px
     * size = 8 -> 256 px
     * size = 9 -> 512 px
     * Otherwise, for size value greater than 9, we use the provided value
     * as the px value
     */
    columnGap?: ResponsiveValue<TVal, ThemeType> | undefined;
}

export const Flex: FC<FlexProps> = ({ rowGap, columnGap, ...rest }) => {
    const theme = useTheme();

    let style = css`
        display: flex;
    `;

    if (rowGap != null) {
        const direction = "row";
        if (isNumber(rowGap)) {
            style = css`
                ${style}
                ${gapCss(direction, rowGap, theme.space)}
            `;
        } else {
            // gap is a responsive object. Ex: {{ _: 2, s: 3 }}
            const entries = Object.entries(rowGap) as unknown as [
                "s" | "p" | "a" | "m" | "f" | "t" | "d" | "x" | "w" | "z",
                number
            ][];

            // Mobile first
            style = css`
                ${style}
                ${gapCss(direction, entries[0][1], theme.space)}
            `;

            entries.slice(1).forEach(([key, value]) => {
                if (theme.breakpoints[key] != null) {
                    style = css`
                        ${style}
                        @media screen and (min-width: ${theme.breakpoints[
                            key
                        ]}) {
                            ${gapCss(direction, value, theme.space)}
                        }
                    `;
                }
            });
        }
    }
    if (columnGap != null) {
        const direction = "column";
        if (isNumber(columnGap)) {
            style = css`
                ${style}
                ${gapCss(direction, columnGap, theme.space)}
            `;
        } else {
            // gap is a responsive object. Ex: {{ _: 2, s: 3 }}
            const entries = Object.entries(columnGap) as unknown as [
                "s" | "p" | "a" | "m" | "f" | "t" | "d" | "x" | "w" | "z",
                number
            ][];

            // Mobile first
            style = css`
                ${style}
                ${gapCss(direction, entries[0][1], theme.space)}
            `;

            entries.slice(1).forEach(([key, value]) => {
                if (theme.breakpoints[key] != null) {
                    style = css`
                        ${style}
                        @media screen and (min-width: ${theme.breakpoints[
                            key
                        ]}) {
                            ${gapCss(direction, value, theme.space)}
                        }
                    `;
                }
            });
        }
    }

    return <StyledBox styl={style} {...rest} />;
};

interface StyledBoxProps extends BoxProps {
    styl: FlattenSimpleInterpolation;
}

const StyledBox = styled(Box)<StyledBoxProps>`
    ${(props) => props.styl}
`;
