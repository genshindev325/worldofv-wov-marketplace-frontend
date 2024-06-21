import { isNumber } from "lodash";
import React, { FC } from "react";
import styled, {
    css,
    FlattenSimpleInterpolation,
    useTheme,
} from "styled-components";
import {
    color,
    ColorProps,
    compose,
    flexBasis,
    FlexBasisProps,
    flexbox,
    FlexboxProps,
    layout,
    LayoutProps,
    shadow,
    ShadowProps,
    space,
    SpaceProps,
    typography,
    TypographyProps,
} from "styled-system";
import { typo2tag, typography as typo } from "../../../styles/theme";

export type TextProps = React.HTMLAttributes<
    HTMLParagraphElement | HTMLAnchorElement
> &
    LayoutProps &
    TypographyProps &
    SpaceProps &
    ColorProps &
    ShadowProps &
    FlexboxProps &
    FlexBasisProps & {
        /**
         * Typography type.
         * Default variant is caption1.
         */
        variant?: keyof typeof typo;
        /**
         * Use a different tag element for the selected variant
         */
        as?: "h1" | "h2" | "h3" | "p" | "span" | "a" | "strong";
        /**
         * The text-overflow property specifies how overflowed content that is not displayed should be
         * signaled to the user. It can be clipped, display an ellipsis (...), or display a custom string.
         * clip 	Default value. The text is clipped and not accessible
         * ellipsis 	Render an ellipsis ("...") to represent the clipped text
         * string 	Render the given string to represent the clipped text
         * initial 	Sets this property to its default value.
         * inherit 	Inherits this property from its parent element.
         * Both of the following are required for text-overflow:
         * white-space: nowrap;
         * overflow: hidden;
         */
        textOverflow?: "clip" | "ellipsis" | "string" | "initial" | "inherit";
        /**
         * The overflow property specifies whether to clip the content or to add scrollbars when the
         * content of an element is too big to fit in the specified area.
         * The overflow property has the following values:
         * visible - Default. The overflow is not clipped. The content renders outside the element's box
         * hidden - The overflow is clipped, and the rest of the content will be invisible
         * scroll - The overflow is clipped, and a scrollbar is added to see the rest of the content
         * auto - Similar to scroll, but it adds scrollbars only when necessary
         */
        overflow?: "visible" | "hidden" | "scroll" | "auto";
        /**
         *  Width
         */
        width?: number | string | object;
        /**
         * Text underline
         */
        underline?: boolean;
        /**
         * Transform text to uppercase
         */
        uppercase?: boolean;
        /**
         * Transform text to italic 💪
         */
        italic?: boolean;
        /**
         * The white-space property specifies how white-space inside an element is handled.
         * normal 	Sequences of whitespace will collapse into a single whitespace. Text will wrap when necessary. This is default
         * nowrap 	Sequences of whitespace will collapse into a single whitespace. Text will never wrap to the next line. The text continues on the same line until a <br> tag is encountered
         * pre 	Whitespace is preserved by the browser. Text will only wrap on line breaks. Acts like the <pre> tag in HTML
         * pre-line 	Sequences of whitespace will collapse into a single whitespace. Text will wrap when necessary, and on line breaks
         * pre-wrap 	Whitespace is preserved by the browser. Text will wrap when necessary, and on line breaks
         * initial 	Sets this property to its default value.
         * inherit 	Inherits this property from its parent element.
         */
        whiteSpace?:
            | "normal"
            | "nowrap"
            | "pre"
            | "pre-line"
            | "pre-wrap"
            | "initial"
            | "inherit";
        /**
         * The word-break property specifies how words should break when reaching the end of a line.
         * normal 	Default value. Uses default line break rules
         * break-all 	To prevent overflow, word may be broken at any character
         * keep-all  	Word breaks should not be used for Chinese/Japanese/Korean (CJK) text. Non-CJK text behavior is the same as value "normal"
         * break-word 	To prevent overflow, word may be broken at arbitrary points
         * initial 	Sets this property to its default value.
         * inherit 	Inherits this property from its parent element.
         */
        wordBreak?:
            | "normal"
            | "break-all"
            | "keep-all"
            | "break-word"
            | "initial"
            | "inherit";
    };

export const Text: FC<TextProps> = ({
    variant = "caption1",
    as,
    textOverflow = "clip",
    overflow = "visible",
    underline = false,
    uppercase = false,
    italic = false,
    whiteSpace = "normal",
    wordBreak = "normal",
    width,
    ...rest
}) => {
    const theme = useTheme();

    const baseCss = theme.typography[variant];
    // ^ `font-size: ..., line-height: ...`

    let style = css`
        ${baseCss}
        white-space: ${whiteSpace};
        word-break: ${wordBreak};
        text-overflow: ${textOverflow};
        overflow: ${overflow};
    `;

    if (underline) {
        style = css`
            ${style}
            text-decoration-line: underline;
            text-decoration-style: solid;
            text-decoration-color: ${rest.color};
        `;
    }

    if (uppercase) {
        style = css`
            ${style}
            text-transform: uppercase;
        `;
    }

    if (italic) {
        style = css`
            ${style}
            font-style: italic;
        `;
    }

    if (width != null) {
        if (isNumber(width) || typeof width === "string") {
            style = css`
                ${style}
                width: ${isNumber(width) ? `${width}px` : width};
            `;
        } else {
            // width is a responsive object. Ex: {{ _: 2, s: 3 }}
            const entries = Object.entries(width) as unknown as [
                "s" | "p" | "a" | "m" | "f" | "t" | "d" | "x" | "w" | "z",
                number
            ][];

            // Mobile first
            style = css`
                ${style}
                width: ${isNumber(entries[0][1])
                    ? `${entries[0][1]}px`
                    : entries[0][1]};
            `;

            entries.slice(1).forEach(([key, value]) => {
                if (theme.breakpoints[key] != null) {
                    style = css`
                        ${style}
                        @media screen and (min-width: ${theme.breakpoints[
                            key
                        ]}) {
                            width: ${isNumber(value) ? `${value}px` : value};
                        }
                    `;
                }
            });
        }
    }

    const props = {
        styl: style,
        variant,
        ...rest,
    };

    switch (as != null ? as : typo2tag[variant]) {
        case "h1":
            return <StyledH1 {...props} />;
        case "h2":
            return <StyledH2 {...props} />;
        case "h3":
            return <StyledH3 {...props} />;
        case "h4":
            return <StyledH4 {...props} />;
        case "a":
            return <StyledA {...props} />;
        case "span":
            return <StyledSpan {...props} />;
        case "strong":
            return <StyledStrong {...props} />;
        default:
            return <StyledP {...props} />;
    }
};

interface StyledTextProps extends TextProps {
    variant: keyof typeof typo;
    styl: FlattenSimpleInterpolation;
}

const StyledP = styled.p<StyledTextProps>(
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
const StyledH1 = styled.h1<StyledTextProps>(
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
const StyledH2 = styled.h2<StyledTextProps>(
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
const StyledH3 = styled.h3<StyledTextProps>(
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
const StyledH4 = styled.h4<StyledTextProps>(
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
const StyledSpan = styled.span<StyledTextProps>(
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
const StyledStrong = styled.strong<StyledTextProps>(
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
const StyledA = styled.a<StyledTextProps>(
    (props) => css`
        cursor: pointer;
        &:hover {
            color: ${props.theme.colors.primary};
        }
    `,
    (props) => props.styl,
    compose(typography, space, color, shadow, flexbox, flexBasis, layout)
);
