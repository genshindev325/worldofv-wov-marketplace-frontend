import { FC, ReactElement, useRef } from "react";
import styled from "styled-components";

interface ScrollTopProps {
    className?: string;
    children(scrollTop: () => void): ReactElement;
}

export const ScrollTop: FC<ScrollTopProps> = ({ className, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    const scrollTop = () => {
        if (ref?.current != null) {
            ref.current.scrollIntoView({
                block: "start",
                inline: "nearest",
                // behavior: "smooth", // not working
            });
        }
    };

    return (
        <StyledDiv className={className} ref={ref}>
            {children(scrollTop)}
        </StyledDiv>
    );
};

const StyledDiv = styled.div`
    width: 100%;
`;
