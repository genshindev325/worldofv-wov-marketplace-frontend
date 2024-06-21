import dynamic from "next/dynamic";
import React from "react";
import { CSSTransition } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";
import styled from "styled-components";
import Modal, { ModalProps } from "./Modal";

export interface AnimatedModalProps extends ModalProps {
    duration?: number;
    transitionProps?: Omit<TransitionProps, "in" | "className" | "classNames">;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
    duration = 200,
    isOpen,
    setIsOpen,
    transitionProps,
    ...modalProps
}) => (
    <CSSTransition
        in={isOpen}
        className={AnimatedModal.name}
        classNames={AnimatedModal.name}
        unmountOnExit
        timeout={duration}
        {...transitionProps}
    >
        <StyledModal {...modalProps} {...{ isOpen, setIsOpen, duration }} />
    </CSSTransition>
);

const StyledModal = styled(Modal)<AnimatedModalProps>`
    &.${AnimatedModal.name}-enter {
        opacity: 0;
    }

    &.${AnimatedModal.name}-enter-active {
        transition: opacity ${({ duration }) => duration}ms;
        opacity: 1;
    }

    &.${AnimatedModal.name}-exit {
        opacity: 1;
    }

    &.${AnimatedModal.name}-exit-active {
        transition: opacity ${({ duration }) => duration}ms;
        opacity: 0;
    }
`;

export default dynamic(() => Promise.resolve(AnimatedModal), { ssr: false });
