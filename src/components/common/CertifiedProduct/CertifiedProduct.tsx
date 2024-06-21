import { GoVerified } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import { IoStopwatchOutline } from "react-icons/io5";
import { useTheme } from "styled-components";
import { Box } from "../Box";
import { Flex } from "../Flex";
import { Spacer } from "../Spacer";
import { Text } from "../Text";

interface CertifiedProductProps {
    isAuthenticated: boolean;
}

export const CertifiedProduct: React.FC<CertifiedProductProps> = ({
    isAuthenticated,
}) => {
    const theme = useTheme();
    return (
        <Box
            border="1px solid"
            borderColor="muted"
            borderRadius={2}
            px={4}
            py={2}
        >
            <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    {isAuthenticated ? (
                        <GoVerified color={theme.colors.primary} size={50} />
                    ) : (
                        <IoStopwatchOutline size={50} />
                    )}
                    <Spacer size={3} />
                    <div>
                        <Text variant="bodyBold2">
                            Product is {isAuthenticated ? "" : "being"}{" "}
                            authenticated
                        </Text>
                        {isAuthenticated && (
                            <Text fontSize={12} color="accent">
                                View Provenance
                            </Text>
                        )}
                    </div>
                </Flex>
                {isAuthenticated && (
                    <Flex
                        p={2}
                        border="1px solid"
                        borderColor="muted"
                        borderRadius={6}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <IoIosArrowForward
                            size={16}
                            color={theme.colors.accent}
                        />
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};
