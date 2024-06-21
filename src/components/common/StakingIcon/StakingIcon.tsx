import { FC } from "react";
import { FaLock } from "react-icons/fa";
import { ImStack } from "react-icons/im";
import styled, { useTheme } from "styled-components";

interface StakingIconProps {
    /**
     * Icon size
     */
    size: number;
}

export const StakingIcon: FC<StakingIconProps> = ({ size }) => {
    const theme = useTheme();

    const topBase = (1 / 10) * size;
    const stackIconSize = (4 / 5) * size;
    const faIconSize = (2 / 5) * size;

    return (
        <Relative size={size}>
            <AbsImStack
                size={stackIconSize}
                top={topBase}
                color={theme.colors.accent}
            />
            <AbsFaLock
                size={faIconSize}
                top={(35 / 100) * size + topBase}
                left={(61 / 100) * size}
                color={theme.colors.gold}
            />
        </Relative>
    );
};

const Relative = styled.div<{ size: number }>`
    position: relative;
    height: ${({ size }) => size}px;
    width: ${({ size }) => size}px;
`;

const AbsImStack = styled(ImStack)<{ top: number }>`
    position: absolute;
    top: ${({ top }) => top}px;
`;

const AbsFaLock = styled(FaLock)<{ top: number; left: number }>`
    position: absolute;
    top: ${({ top }) => top}px;
    left: ${({ left }) => left}px;
`;
