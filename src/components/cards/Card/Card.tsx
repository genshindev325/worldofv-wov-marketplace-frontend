import { Box, BoxProps } from "@/components/common/Box";
import type { PropsWithChildren } from "react";
import styled from "styled-components";

export type CardProps = PropsWithChildren<BoxProps>;

export function Card({ children, ...boxProps }: CardProps) {
    return (
        <StyledBox
            border="1px solid"
            borderColor="muted"
            borderRadius={4}
            backgroundColor="highlight"
            // boxShadow="0 3px 10px 0 black"
            {...boxProps}
        >
            {children}
        </StyledBox>
    );
}

const StyledBox = styled(Box)`
    box-shadow: 0px 10px 16px rgba(31, 47, 69, 0.12);
`;
