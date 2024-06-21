import React, { Fragment } from "react";
import styled from "styled-components";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import AnimatedModal from "./AnimatedModal";

const { media, dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

interface Option {
    label: string;
    value: string;
}

interface ModalSortProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void;
    options: Option[];
    selectedOption: Option;
    setSelectedOption: (selectedOption: Option) => void;
}

const ModalSort: React.FC<ModalSortProps> = ({
    isOpen,
    setIsOpen,
    options,
    selectedOption,
    setSelectedOption,
}) => {
    const onSelect = (e: any) => {
        setSelectedOption(options.find((o) => o.value === e.target.value)!);
        setIsOpen(false);
    };

    return (
        <AnimatedModal title="Sort by" small {...{ isOpen, setIsOpen }}>
            <Container onChange={onSelect}>
                {options.map((o) => (
                    <Fragment key={o.value}>
                        <Radio
                            name="collection-tab-sort"
                            value={o.value}
                            checked={o.value === selectedOption.value}
                        />
                        <RadioLabel>{o.label}</RadioLabel>
                    </Fragment>
                ))}
            </Container>
        </AnimatedModal>
    );
};

export default ModalSort;

const Container = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr;
    grid-gap: 8px; /* Safari 10-11 */
    gap: 8px; /* Safari 12+ */
`;

const Radio = styled.input.attrs({ type: "radio" })`
    width: 20px;
    height: 20px;
`;

const RadioLabel = styled.span`
    ${typography.body2}
`;
