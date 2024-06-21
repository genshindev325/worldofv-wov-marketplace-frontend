import { ReactNode } from "react";
import styled from "styled-components";
import { Text } from "../components/common/Text";

export interface ActionCardProps {
    description: ReactNode;
    children?: ReactNode;
}

export default function ActionCard({ description, children }: ActionCardProps) {
    if (!children) return null;

    return (
        <Container>
            <Text variant="caption1" textAlign="center">
                {description}
            </Text>
            <ActionContent>{children}</ActionContent>
        </Container>
    );
}

const Container = styled.div`
    position: relative;
    box-shadow: 0px 40px 32px -24px rgba(15, 15, 15, 0.12);
    border-radius: ${({ theme }) => theme.radii[4]}px;
    border: ${({ theme }) => `1px solid ${theme.colors.muted}`};
    background: ${({ theme }) => theme.colors.highlight};
    padding: 16px 28px 24px;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    row-gap: 16px;
    grid-gap: 16px;
`;

const ActionContent = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
    align-items: center;
    white-space: nowrap;
    width: calc(100% + 16px);

    & > * {
        flex: 1;
        margin: 8px;
    }
`;
