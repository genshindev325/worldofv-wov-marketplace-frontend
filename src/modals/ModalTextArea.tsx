import _ from "lodash";
import { ComponentPropsWithRef, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "../components/common/Button";
import { Field, FieldProps } from "../components/FormInputs/Field";
import { FormInputProps } from "../components/FormInputs/Form";
import mixins from "../styles/_mixins";
import variables from "../styles/_variables";
import AnimatedModal from "./AnimatedModal";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

export interface ModalTextAreaProps {
    title: string;
    inputProps: ComponentPropsWithRef<"textarea">;
    errors?: FormInputProps["errors"];
    className?: string;
    fieldProps?: FieldProps;
}

export default function ModalTextArea({
    title,
    errors,
    className,
    fieldProps,
    inputProps,
}: ModalTextAreaProps) {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    return (
        <Container className={className}>
            <StyledField
                error={_.get(errors, inputProps.name || "")?.message}
                onClick={() => setIsOpen(true)}
                {...fieldProps}
            >
                <Preview>{inputProps.value || inputRef.current?.value}</Preview>
            </StyledField>
            <AnimatedModal
                small
                contentPadding={16}
                title={title}
                {...{ isOpen, setIsOpen }}
            >
                <ModalContainer>
                    <TextArea rows={8} {...inputProps} ref={inputRef} />
                    <Button onClick={() => setIsOpen(false)}>Done</Button>
                </ModalContainer>
            </AnimatedModal>
        </Container>
    );
}

const Container = styled.div``;

const Preview = styled.p`
    ${typography.caption1}
    height: 24px;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const StyledField = styled(Field)`
    cursor: pointer;
    border-radius: ${({ theme }) => theme.radii[3]}px;
    border: 2px solid ${({ theme }) => theme.colors.muted};
    padding: 0px 14px;
    height: 48px;
`;

const TextArea = styled.textarea`
    ${typography.body2}
    resize: none;
    overflow: auto;
    width: 100%;
    height: max-content;
    background: none;
    padding: 12px;
    border: 2px solid ${({ theme }) => theme.colors.muted};
    border-radius: ${({ theme }) => theme.radii[3]}px;
`;
