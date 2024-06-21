import React from "react";
import styled from "styled-components";
import AccordionItem from "./AccordionItem";

interface AccordionProps {
    defaultOpen?: string;
    className?: string;
    style?: React.CSSProperties;
}

const Accordion: React.FC<React.PropsWithChildren<AccordionProps>> = ({
    defaultOpen,
    children,
    className,
    style,
}) => {
    const [active, setActive] = React.useState<string | undefined>(defaultOpen);

    return (
        <Container {...{ className, style }}>
            {React.Children.map(children, (child: any, i) => {
                if (
                    [AccordionItem.name, AccordionItem.displayName].indexOf(
                        child?.type.name
                    ) !== -1
                ) {
                    return React.createElement(child.type, {
                        ...child.props,
                        isOpen: active === child.props.title,
                        onClick: (title: string, isOpen: boolean) =>
                            setActive((prev) =>
                                prev === title
                                    ? isOpen
                                        ? undefined
                                        : title
                                    : title
                            ),
                    });
                }
            })}
        </Container>
    );
};

const Container = styled.div`
    margin-bottom: 32px;
`;

export default Accordion;
