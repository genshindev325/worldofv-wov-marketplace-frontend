import { FC } from "react";
import styled from "styled-components";
import { size2px } from "../../../styles/size2px";

export interface SpacerProps {
    /**
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
    size: number;
    /**
     * y = vertical space. Default is horizontal.
     */
    y?: boolean;
    /**
     * Add border (debug purposes only)
     */
    debug?: boolean;
}

/**
 * Component to add consistent space between components to avoid
 * using margins.
 * @see {@link https://www.joshwcomeau.com/react/modern-spacer-gif/}
 * @see {@link https://mxstbr.com/thoughts/margin/}
 */
export const Spacer: FC<SpacerProps> = ({ size, y = false, debug = false }) => {
    const pixels = size2px(size);

    const display = !y ? "inline-block" : "block";
    const width = !y ? pixels : 1;
    const height = y ? pixels : 1;

    return (
        <Span display={display} width={width} height={height} debug={debug} />
    );
};

interface SpanProps {
    display: string;
    width: number;
    height: number;
    debug: boolean;
}

const Span = styled.span<SpanProps>`
    display: ${(props) => props.display};
    background-color: transparent;
    width: ${(props) => props.width}px;
    min-width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    min-height: ${(props) => props.height}px;
    border: ${(props) =>
        props.debug ? `1px solid ${props.theme.colors.error}` : "none"};
`;
