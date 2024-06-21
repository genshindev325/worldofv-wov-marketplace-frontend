import React from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import styled from "styled-components";

export interface FadeTransitionProps {
    components: React.ElementType[];
    selectedIndex: number;
}

export default function FadeTransition({
    components,
    selectedIndex,
}: FadeTransitionProps) {
    const Component = components[selectedIndex];
    return (
        <SwitchTransition>
            <CSSTransition
                key={selectedIndex}
                classNames="fade"
                addEndListener={(node, done) => {
                    node.addEventListener("transitionend", done, false);
                }}
            >
                <ItemContainer>
                    <Component />
                </ItemContainer>
            </CSSTransition>
        </SwitchTransition>
    );
}

const ItemContainer = styled.div`
    &.fade-enter {
        opacity: 0;
    }

    &.fade-exit {
        opacity: 1;
    }

    &.fade-enter-active {
        opacity: 1;
    }

    &.fade-exit-active {
        opacity: 0;
    }

    &.fade-enter-active,
    &.fade-exit-active {
        transition: 200ms cubic-bezier(0.5, 0, 0, 0.5);
    }
`;
