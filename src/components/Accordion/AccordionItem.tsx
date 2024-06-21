import Collapse from "@kunukn/react-collapse";
import clsx from "clsx";
import React from "react";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";

const { dark } = mixins;
const {
    colors: { blue, neutrals },
    typography: { body2, bodyBold2, caption2 },
} = variables;

interface AccordionItemProps {
    title: string;
    description?: string;
    isOpen?: boolean;
    onClick?: (title: string, isOpen?: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
}

const AccordionItem: React.FC<React.PropsWithChildren<AccordionItemProps>> = ({
    title,
    description,
    isOpen,
    onClick,
    children,
    className,
    style,
}) => (
    <AccordionContainer
        className={clsx({ active: isOpen }, className)}
        style={style}
    >
        <AccordionHead
            onClick={() => (onClick ? onClick(title, isOpen) : undefined)}
        >
            <AccordionTitle>{title}</AccordionTitle>

            {description && (
                <AccordionDescription>{description}</AccordionDescription>
            )}
        </AccordionHead>

        <Collapse {...{ isOpen }}>
            <AccordionBody>{isOpen ? children : null}</AccordionBody>
        </Collapse>
    </AccordionContainer>
);

const AccordionTitle = styled.div`
    ${bodyBold2}
    transition: color 0.2s;
`;

const AccordionHead = styled.div`
    position: relative;
    padding: 12px 40px 12px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &:before {
        content: "";
        position: absolute;
        top: 50%;
        right: 8px;
        width: 10px;
        height: 6px;
        transform: translateY(-50%);
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' viewBox='0 0 10 6'%3E%3Cpath fill-rule='evenodd' d='M9.207.793a1 1 0 0 0-1.414 0L5 3.586 2.207.793A1 1 0 1 0 .793 2.207l3.5 3.5a1 1 0 0 0 1.414 0l3.5-3.5a1 1 0 0 0 0-1.414z' fill='%23777e91'/%3E%3C/svg%3E")
            no-repeat 50% 50% / 100% auto;
        transition: transform 0.2s;
    }

    &:hover {
        ${AccordionTitle} {
            color: ${blue};
        }
    }
`;

const AccordionDescription = styled.div`
    margin-top: 4px;
    ${caption2};
    color: ${neutrals[4]};
`;

const AccordionBody = styled.div`
    padding-bottom: 12px;
    ${body2}
    color: ${neutrals[4]};
`;

const AccordionContainer = styled.div`
    border-bottom: 1px solid ${neutrals[6]};

    ${dark`
        border-color: ${neutrals[3]};
    `}

    &.active {
        ${AccordionHead} {
            &:before {
                transform: translateY(-50%) rotate(-180deg);
            }
        }
    }
`;

export default AccordionItem;
