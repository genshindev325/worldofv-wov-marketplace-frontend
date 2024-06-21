import { darken } from "polished";
import React from "react";
import Clamp from "react-multiline-clamp";
import styled from "styled-components";
import variables from "../styles/_variables";

const {
    colors: { blue },
} = variables;

// https://www.npmjs.com/package/react-multiline-clamp
export interface ReactMultilineClampProps {
    /** The number of lines we want the text to be truncated to */
    lines?: number;

    /** The maximum number of lines we want to show after clicking on showMore button */
    maxLines?: number;

    /** Indicates if we want the text to have a tooltip title */
    withTooltip?: boolean;

    /** Indicates if we want to have the show more/less actions */
    withToggle?: boolean;

    /** Element that triggers the show more action */
    showMoreElement?: Element;

    /** Element that triggers the show less action */
    showLessElement?: Element;

    /** A callback function that gets calls every time we click on the show more/less buttons. It returns whether the text is expanded or not (Boolean) */
    onShowMore?: (isExpanded?: boolean) => boolean;
}

const ReadMore: React.FC<React.PropsWithChildren<ReactMultilineClampProps>> = ({
    children,
    lines = 1,
    maxLines = Number.MAX_SAFE_INTEGER,
    withTooltip = false,
    withToggle = false,
    showMoreElement,
    showLessElement,
}) =>
    children ? (
        <Clamp
            {...{ lines, maxLines, withTooltip, withToggle }}
            showMoreElement={
                showMoreElement
                    ? showMoreElement
                    : ({ toggle }: any) => (
                          <TextButton onClick={toggle}>Read more</TextButton>
                      )
            }
            showLessElement={
                showLessElement
                    ? showLessElement
                    : ({ toggle }: any) => (
                          <TextButton onClick={toggle}>Show less</TextButton>
                      )
            }
        >
            {children}
        </Clamp>
    ) : null;

const TextButton = styled.button`
    cursor: pointer;
    color: ${blue};
    font-weight: bold;
    transition: color 0.1s;

    &:hover {
        color: ${darken(0.1, blue)};
    }
`;

export default ReadMore;
