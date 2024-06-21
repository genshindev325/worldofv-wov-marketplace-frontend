import { Card } from "@/components/cards/CardV2";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { TokenBatchSelectContext } from "../../../providers/BatchSelectProvider";
import mixins from "../../../styles/_mixins";
import variables from "../../../styles/_variables";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

// TODO inherit card props
export type BatchSelectCardProps = any;

export function BatchSelectCard({
    className,
    ...cardProps
}: BatchSelectCardProps) {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const {
        isSelecting,
        selectedItems,
        selectItem,
        deselectItem,
        validate,
        maxSelectedCount,
    } = useContext(TokenBatchSelectContext);

    const isSelected = selectedItems.has(cardProps.tokenId);

    useEffect(
        () => {
            const errorMessage = isSelecting ? validate(cardProps) : undefined;
            setErrorMessage(errorMessage);
        },
        [isSelecting] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const onClick = () => {
        if (!isSelected) {
            selectItem(cardProps);
        } else {
            deselectItem(cardProps.tokenId);
        }
    };

    const wrapperProps = {
        isSelecting,
        isSelected,
        hasError: !!errorMessage,
        isSelectable:
            isSelecting &&
            !errorMessage &&
            (selectedItems.size < maxSelectedCount || isSelected),
    };

    return (
        <Wrapper
            {...wrapperProps}
            onClick={isSelecting && !errorMessage ? onClick : undefined}
        >
            <ErrorContainer>
                <ErrorBanner isOpen={!!errorMessage}>
                    <p>{errorMessage}</p>
                </ErrorBanner>
            </ErrorContainer>
            <CardContainer {...wrapperProps}>
                <Card {...cardProps} />
            </CardContainer>
        </Wrapper>
    );
}

interface WrapperProps {
    isSelecting?: boolean;
    isSelected?: boolean;
    hasError?: boolean;
    isSelectable?: boolean;
}

const Wrapper = styled.div<WrapperProps>`
    overflow: hidden;
    border-radius: 16px;
    outline-offset: 1px;
    outline: ${(props) =>
        props.isSelected ? `2px solid ${neutrals[4]}` : null};
    cursor: ${(props) => (props.isSelectable ? "pointer" : null)};
    box-shadow: 0px 10px 16px rgba(31, 47, 69, 0.12);

    ${dark`
        outline-color: ${neutrals[5]}
    `}
`;

const CardContainer = styled.div<WrapperProps>`
    opacity: ${(props) =>
        props.isSelecting && !props.isSelected ? "0.5" : null};

    transition: opacity 200ms ease-in-out;

    :hover {
        opacity: ${(props) =>
            !props.isSelected && props.isSelectable ? "0.75" : null};
    }

    > * {
        pointer-events: ${(props) => (props.isSelecting ? "none" : null)};
    }
`;

const ErrorContainer = styled.div`
    position: relative;
    height: 0;
    width: 100%;
`;

const ErrorBanner = styled.div<{ isOpen?: boolean }>`
    ${typography.caption1}
    overflow: hidden;
    position: absolute;
    max-height: ${(props) => (props.isOpen ? "128px" : 0)};
    color: ${neutrals[2]};
    background-color: ${colors.yellow};
    transition: max-height 200ms ease-in-out;
    text-align: center;
    width: 100%;
    z-index: 1;

    p {
        padding: 8px;
    }
`;
