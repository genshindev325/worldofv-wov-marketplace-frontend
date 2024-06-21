import { reset } from "linkifyjs";
import React from "react";
import styled from "styled-components";
import Accordion from "../components/Accordion/Accordion";
import AccordionItem from "../components/Accordion/AccordionItem";
import { Button } from "../components/common/Button";
import Icon from "../components/Icon";
import { TokenAttributesFragment } from "../generated/graphql";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import { ISelectedTokenAttributes } from "../types/TokenData";
import AnimatedModal from "./AnimatedModal";

const { dark } = mixins;
const {
    colors: { neutrals, blue },
    typography: { captionBold1 },
} = variables;

export interface ModalCollectionPropertiesProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    options: TokenAttributesFragment[] | null | undefined;
    selectedProperties?: ISelectedTokenAttributes;
    onSelectProperties?: (value: ISelectedTokenAttributes | undefined) => void;
}

const ModalCollectionProperties: React.FC<ModalCollectionPropertiesProps> = ({
    isOpen,
    setIsOpen,
    options,
    selectedProperties,
    onSelectProperties,
}) => {
    const [properties, setProperties] = React.useState<
        ISelectedTokenAttributes | undefined
    >(selectedProperties);

    const toggleProperty = (key: string, value: string) => {
        const prevProps: ISelectedTokenAttributes = { ...properties };

        if (!prevProps[key]) {
            prevProps[key] = [];
        }

        if (prevProps[key].indexOf(value) !== -1) {
            prevProps[key] = prevProps[key].filter(
                (el: string) => el !== value
            );

            if (prevProps[key].length === 0) {
                delete prevProps[key];
            }
        } else {
            prevProps[key].push(value);
        }

        setProperties(() => ({ ...prevProps }));
    };

    const isActive = React.useCallback(
        (key: string, value: string) =>
            properties?.hasOwnProperty(key)
                ? properties[key].indexOf(value) !== -1
                : false,
        [properties]
    );

    const getActiveProperties = (key: string) =>
        properties?.hasOwnProperty(key)
            ? properties[key].join(", ")
            : undefined;

    const onClear = async () => {
        reset();
        setProperties(undefined);
        onSelectProperties?.(undefined);
    };

    const onApply = () => {
        onSelectProperties?.(properties);
        setIsOpen(false);
    };

    return (
        <AnimatedModal
            small
            title="Properties"
            {...{ isOpen, setIsOpen }}
            renderFooter={
                <ModalFooter>
                    <Button outline onClick={onClear}>
                        Clear all
                    </Button>

                    <Button onClick={onApply}>Apply</Button>
                </ModalFooter>
            }
        >
            {options?.length ? (
                <StyledAccordion>
                    {options.map(({ key, values }) => (
                        <AccordionItem
                            key={key}
                            title={key}
                            description={getActiveProperties(key)}
                        >
                            <AccordionItemBody>
                                {values.map(({ value, count }) => (
                                    <ItemWrapper
                                        key={value}
                                        isActive={isActive(key, value)}
                                        onClick={() =>
                                            toggleProperty(key, value)
                                        }
                                    >
                                        <ItemLabel>{value}</ItemLabel>

                                        <ItemRightContainer>
                                            <ItemCount>{count}</ItemCount>
                                            <Icon
                                                icon="check"
                                                color={blue}
                                                size={12}
                                            />
                                        </ItemRightContainer>
                                    </ItemWrapper>
                                ))}
                            </AccordionItemBody>
                        </AccordionItem>
                    ))}
                </StyledAccordion>
            ) : (
                <div>No properties found for this collection</div>
            )}
        </AnimatedModal>
    );
};

const ModalFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > * {
        flex: 1;
        margin: 0 8px;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }
`;

const StyledAccordion = styled(Accordion)`
    margin-top: -32px;
    margin-bottom: 0;

    & > :last-child {
        border-bottom: 0;
    }
`;

const AccordionItemBody = styled.div`
    display: flex;
    flex-direction: column;
`;

const ItemWrapper = styled.div<{ isActive: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 12px;
    border-radius: 6px;
    transition: all 0.12s ease-in-out 0s;

    &:hover {
        background-color: ${neutrals[8]};

        ${dark`
            background-color: ${neutrals[2]};
        `}
    }

    .icon {
        opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    }
`;

const ItemLabel = styled.div`
    ${captionBold1};
    color: ${neutrals[2]};

    ${dark`
        color: ${neutrals[7]};
    `};
`;

const ItemRightContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
        transition: all 0.12s ease-in-out 0s;
        margin-left: 16px;
    }
`;

const ItemCount = styled.div`
    ${captionBold1};
`;

export default ModalCollectionProperties;
