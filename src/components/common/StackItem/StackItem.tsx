import { FC } from "react";
import styled from "styled-components";
import Icon from "../../Icon";
import { Flex } from "../Flex";
import { Spacer } from "../Spacer";
import { Text } from "../Text";

interface StackItemProps {
    open?: boolean;
    text: string;
    onClick?: () => void;
}

export const StackItem: FC<StackItemProps> = ({
    open = false,
    text,
    onClick = () => {},
}) => (
    <StyledFlex alignItems="center" py={3} px={2} onClick={onClick}>
        {open && (
            <>
                <Spacer size={2} />
                <Icon icon="arrow-left" />
                <Spacer size={2} />
            </>
        )}
        <div style={{ flex: 1 }}>
            <Text variant="bodyBold1">{text}</Text>
        </div>
        {!open && (
            <>
                <Spacer size={2} />
                <Icon icon="arrow-right" />
            </>
        )}
    </StyledFlex>
);

const StyledFlex = styled(Flex)`
    color: ${({ theme }) => theme.colors.accent};
    min-height: 69px;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
