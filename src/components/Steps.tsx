import { useMediaQuery } from "@react-hook/media-query";
import { Fragment } from "react";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";
import variables from "../styles/_variables";

const { colors, typography } = variables;
const { neutrals } = colors;

export interface Step {
    label: string;
    /** Not yet implemented. */
    description?: string;
}

export interface StepsProps {
    steps: Step[];
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    /**
     * Size where the component will switch to vertical orientation.
     */
    wrapWidth?: string;
    className?: string;
    completed?: boolean;
}

export default function Steps({
    steps,
    value,
    onChange,
    disabled,
    wrapWidth = `${Number.MAX_SAFE_INTEGER}px`, // default to never wrapping
    className,
    completed,
}: StepsProps) {
    const isVertical = useMediaQuery(`(max-width: ${wrapWidth})`);
    const currentValue = completed ? steps.length : value;

    return (
        <Container
            className={className}
            isDisabled={disabled}
            isVertical={isVertical}
        >
            {steps.map((step, index) => (
                <Fragment key={index}>
                    <LabelContainer>
                        <Indicator
                            onClick={() => onChange?.(index)}
                            isCurrent={index === currentValue}
                            isActive={
                                typeof currentValue === "number" &&
                                index <= currentValue
                            }
                        >
                            {currentValue && index < currentValue ? (
                                <FaCheck color={colors.blue} />
                            ) : (
                                index + 1
                            )}
                        </Indicator>
                        <Label isCurrent={index === value}>{step.label}</Label>
                    </LabelContainer>
                    {index < steps.length - 1 && (
                        <Separator
                            isVertical={isVertical}
                            isHighlighted={
                                typeof currentValue === "number" &&
                                index < currentValue
                            }
                        />
                    )}
                </Fragment>
            ))}
        </Container>
    );
}

const Container = styled.div<{ isDisabled?: boolean; isVertical?: boolean }>(
    ({ isDisabled, isVertical }) => `
    pointer-events: ${isDisabled ? "none" : null};
    display: flex;
    flex-direction: ${isVertical ? "column" : "row"};
    align-items:  ${isVertical ? "flex-start" : "center"};
    gap: 8px;
    `
);

const LabelContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Indicator = styled.div<{ isActive?: boolean; isCurrent?: boolean }>(
    ({ isActive, isCurrent }) => `
    ${typography.body1}
    border: 1px solid ${neutrals[4]};
    border-radius: 50%;
    cursor: pointer;
    border-color: ${isCurrent || isActive ? colors.blue : null};
    border-width: ${isCurrent ? "2px" : null};
    pointer-events: ${!isActive ? "none" : null};
    height: 48px;
    width: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    `
);

const Label = styled.span<{ isCurrent?: boolean }>`
    ${typography.body2}
    color: ${(props) => (props.isCurrent ? colors.blue : null)};
    transition: all 250ms ease-in-out;
`;

const Separator = styled.div<{ isHighlighted?: boolean; isVertical?: boolean }>(
    ({ isHighlighted, isVertical }) => `
    border-${isVertical ? "left" : "top"}: 2px solid ${neutrals[4]};
    border-color: ${isHighlighted ? colors.blue : null};
    min-height: ${isVertical ? "24px" : null};
    margin-left: ${isVertical ? "24px" : null};
    flex-grow: 1;
    transition: border-color 250ms ease-in-out;
    `
);
