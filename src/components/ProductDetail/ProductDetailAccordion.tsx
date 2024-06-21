import { ReactNode, useMemo, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import { IOfferData, OfferData } from "../../types/OfferData";
import CircleButton from "../CircleButton";
import { Text } from "../common/Text";

const { dark } = mixins;
const { colors, typography, breakpoints, fonts } = variables;
const { neutrals } = colors;

export interface ProductDetailAccordionProps {
    title: string;
    count?: number;
    children: ReactNode;
    className?: string;
    offers?: IOfferData[];
}

export default function ProductDetailAccordion({
    title,
    count,
    children,
    className,
    offers,
}: ProductDetailAccordionProps) {
    const [isOpen, setOpen] = useState(false);

    const hasCount = typeof count === "number";
    const bestOffer = useMemo(
        () => (offers ? new OfferData(offers[0]) : null),
        [offers]
    );

    return (
        <Container className={className}>
            <TitleBar onClick={() => setOpen(!isOpen)}>
                {title}
                <Count>{count != undefined && `(${count})`}</Count>
                {bestOffer && !!count && (
                    <div>
                        <Text variant="caption2" color="neutral">
                            Top&nbsp;Offer
                        </Text>
                        <Text color="accent">{bestOffer.formattedPrice}</Text>
                    </div>
                )}
                <CircleButton small outline>
                    <ArrowDownIcon open={isOpen} />
                </CircleButton>
            </TitleBar>
            <Accordion open={isOpen}>{children}</Accordion>
        </Container>
    );
}

const ArrowDownIcon = styled(FaAngleDown)<{ open: boolean }>`
    transition: transform 200ms ease-in-out;
    transform: ${(props) => (props.open ? "rotate(180deg)" : null)};
`;

const Accordion = styled.div<{ open: boolean }>`
    opacity: ${(props) => (props.open ? null : 0)};
    max-height: ${(props) => (!props.open ? 0 : "384px")};
    transition: all 200ms ease-in-out;
    overflow: auto;

    ${dark`
        border-color: ${neutrals[3]};
    `}
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid ${neutrals[6]};
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    ${dark`
        border-color: ${neutrals[3]};
    `};
`;

const TitleBar = styled.div`
    display: flex;
    font-size: 16px;
    font-weight: 600;
    padding-inline: 16px;
    padding-block: 8px;
    display: flex;
    gap: 16px;
    align-items: center;
`;

const Count = styled.span`
    color: ${neutrals[3]};
    flex-grow: 1;

    ${dark`
        color: ${neutrals[5]};
    `};
`;
