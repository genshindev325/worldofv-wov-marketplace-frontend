import styled from "styled-components";
import { Box } from "../Box";
import { Flex, FlexProps } from "../Flex";
import { Text } from "../Text";

const BORDER_RADIUS = 4;

export type ProgressBarProps = FlexProps & {
    /** Scale 0 to 100 */
    percentage: number;
};

export const ProgressBar = ({ percentage, ...flexProps }: ProgressBarProps) => (
    <Flex borderRadius={BORDER_RADIUS} bg="muted" {...flexProps}>
        <StyledBox
            py={2}
            px={percentage > 0 ? 3 : 0}
            borderRadius={BORDER_RADIUS}
            width={`${percentage}%`}
        >
            {percentage > 0 && (
                <Text
                    variant="bodyBold2"
                    fontWeight="semibold"
                    fontSize={{ _: 3, m: 4 }}
                    color="white"
                    textAlign="right"
                >
                    {percentage} %
                </Text>
            )}
        </StyledBox>
    </Flex>
);

const StyledBox = styled(Box)`
    background-image: linear-gradient(
        to right,
        rgb(255, 218, 220),
        rgb(255, 0, 24)
    );
`;
