import { Box } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import styled from "styled-components";

interface FaqCardProps {
    question: string;
    answer: string;
}

export const FaqCard: React.FC<FaqCardProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <StyledButton type="button" onClick={() => setIsOpen(!isOpen)}>
            <StyledBox
                p={3}
                border="1px solid"
                borderColor="muted"
                borderRadius={1}
                isOpen={isOpen}
                backgroundColor="highlight"
            >
                <Flex alignItems="center" rowGap={2}>
                    {isOpen ? <FaMinus /> : <FaPlus />}
                    <Text
                        variant="captionBold1"
                        fontWeight={600}
                        textAlign="left"
                    >
                        {question}
                    </Text>
                </Flex>
                <Box display={isOpen ? "block" : "none"}>
                    <Text textAlign="left" mt={2}>
                        {answer}
                    </Text>
                </Box>
            </StyledBox>
        </StyledButton>
    );
};

const StyledButton = styled.button`
    color: ${({ theme }) => theme.colors.text};
`;

const StyledBox = styled(Box)<{ isOpen: boolean }>`
    box-shadow: rgb(31 47 69 / 12%) 0px 10px 16px;
`;
