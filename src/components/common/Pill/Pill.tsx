import { FC } from "react";
import { colors } from "../../../styles/theme";
import { Box } from "../Box";
import { Flex, FlexProps } from "../Flex";
import { Text } from "../Text";

const BORDER_RADIUS = 1;

export interface PillProps extends Omit<FlexProps, "border"> {
    left: string | number;
    right: string | number;
    bg: keyof typeof colors;
    color: keyof typeof colors;
    border?: boolean;
}

export const Pill: FC<PillProps> = ({
    left,
    right,
    bg,
    color,
    border = false,
    ...flexProps
}) => (
    <Flex alignItems="stretch" {...flexProps}>
        <Box
            bg="silver"
            p={2}
            border="2px solid"
            borderColor="silver"
            borderTopLeftRadius={BORDER_RADIUS}
            borderBottomLeftRadius={BORDER_RADIUS}
            flex={5}
        >
            <Text
                variant="bodyBold2"
                fontSize={{ _: 3, m: 4 }}
                color="white"
                textAlign="center"
            >
                {left}
            </Text>
        </Box>
        <Box
            bg={bg}
            p={2}
            border="2px solid"
            borderColor={border ? "silver" : bg}
            borderTopRightRadius={BORDER_RADIUS}
            borderBottomRightRadius={BORDER_RADIUS}
            flex={2}
        >
            <Text
                variant="bodyBold2"
                fontSize={{ _: 3, m: 4 }}
                color={color}
                textAlign="center"
            >
                {right}
            </Text>
        </Box>
    </Flex>
);
