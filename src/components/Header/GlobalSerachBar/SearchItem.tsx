import { Box } from "@/components/common/Box";
import { Flex } from "@/components/common/Flex";
import { Text } from "@/components/common/Text";
import { formatUsername } from "@/utils/formatUsername";
import picasso from "@vechain/picasso";
import React from "react";
import styled from "styled-components";
import { VerifiedStatus } from "../../../generated/graphql";

interface SearchItemProps {
    name?: string | null;
    setValue?: (address: string) => void;
    setIsSearchBarOpen?: (newState: boolean) => void;
    isVerified?: boolean | null;
    smartContractAddress?: string | null;
    userAddress?: string | null;
    verifiedLevel?: string | null;
    image?: string | null;
    fileType?: string | null;
    disabled?: boolean;
    isGlobalSearch?: boolean;
    className?: string;
}

const SearchItem: React.FC<SearchItemProps> = ({
    isVerified,
    isGlobalSearch,
    setValue,
    setIsSearchBarOpen,
    smartContractAddress,
    userAddress,
    verifiedLevel,
    name,
    image,
    fileType,
    disabled,
    className,
}) => {
    const svg = React.useMemo(() => {
        let address = "0x0000000000000000000000000000000000000000";
        if (userAddress) address = userAddress;
        if (smartContractAddress) address = smartContractAddress;

        const svg = picasso(address);
        return `data:image/svg+xml;utf8,${svg}`;
    }, [smartContractAddress, userAddress]);

    if (!disabled) {
        return (
            <Container className={className}>
                <Flex
                    position="relative"
                    alignItems="center"
                    p={2}
                    onClick={() => {
                        if (setValue)
                            isGlobalSearch
                                ? setValue("")
                                : setValue(userAddress ?? "");
                        if (setIsSearchBarOpen) setIsSearchBarOpen(false);
                    }}
                >
                    <Box>
                        {isVerified && (
                            <Verified
                                verifiedLevel={
                                    verifiedLevel
                                        ? verifiedLevel
                                        : VerifiedStatus.Verified
                                }
                            />
                        )}
                        {image ? (
                            fileType && fileType?.startsWith("video") ? (
                                <ThumbnailVideo
                                    preload="metadata"
                                    src={`${image}#t=0.001`}
                                />
                            ) : (
                                <Thumbnail thumbnail={image} />
                            )
                        ) : (
                            <ThumbnailSvg src={svg} />
                        )}
                    </Box>

                    <Box>
                        <Text>{name ?? userAddress}</Text>
                        {!isGlobalSearch && (
                            <Text>{formatUsername(userAddress!)}</Text>
                        )}
                    </Box>
                </Flex>
            </Container>
        );
    }
    return (
        <Container
            onClick={() =>
                setIsSearchBarOpen ? setIsSearchBarOpen(false) : null
            }
            className={className}
            disabled
        >
            <Flex position="relative" alignItems="center" p={2}>
                <Text m="0 auto">No entries with that name exist</Text>
            </Flex>
        </Container>
    );
};

const Container = styled.div<{ disabled?: boolean }>`
    border-top: 1px solid ${({ theme }) => theme.colors.muted};
    &:hover {
        background-color: ${(props) =>
            props.disabled ? "unset" : props.theme.colors.muted};
    }
`;

const Thumbnail = styled.div<{ thumbnail: string }>`
    background-image: ${(props) => `url(${props.thumbnail})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 20px;
`;

const ThumbnailSvg = styled.img`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 20px;
`;

const ThumbnailVideo = styled.video`
    height: 30px;
    width: 30px;
    border-radius: 50%;
    margin-right: 20px;
`;

const Verified = styled.div<{ verifiedLevel?: string | null }>`
    background: ${({ verifiedLevel }) =>
        `url(${
            verifiedLevel === VerifiedStatus.Verified
                ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzI5MzoyNDM5KSI+CjxwYXRoIGQ9Ik02IDZIMzBWMzBINlY2WiIgZmlsbD0iI0ZDRkNGRCIvPgo8cGF0aCBkPSJNMzUuMzgyNCAyMC4zODIxQzM0Ljc4MjYgMTguOTAyNSAzNC43ODI2IDE3LjI2MjkgMzUuMzgyNCAxNS44MjMyTDM1LjU4MjMgMTUuMzQzNEMzNi44NjE4IDEyLjMwNDEgMzUuMzgyNCA4Ljc4NDk3IDMyLjM0MzUgNy41MDUyOEwzMS45MDM3IDcuMzA1MzNDMzAuNDI0MyA2LjcwNTQ4IDI5LjI2NDcgNS41NDU3NiAyOC42NjUgNC4wNjYxMkwyOC41MDUgMy42NjYyMkMyNy4xODU1IDAuNjI2OTY3IDIzLjcwNjkgLTAuODEyNjggMjAuNjI4IDAuNDI3MDE2TDIwLjIyODIgMC41ODY5NzdDMTguNzQ4OCAxLjE4NjgzIDE3LjEwOTQgMS4xODY4MyAxNS42MyAwLjU4Njk3N0wxNS4yNzAxIDAuNDI3MDE2QzEyLjI3MTMgLTAuODEyNjggOC43NTI2MiAwLjY2Njk1OCA3LjQ3MzExIDMuNzA2MjFMNy4zMTMxNyA0LjAyNjEzQzYuNzEzNCA1LjUwNTc3IDUuNTUzODUgNi42NjU0OSA0LjA3NDQyIDcuMjY1MzRMMy43MTQ1NSA3LjQyNTNDMC43MTU3MDggOC43MDQ5OSAtMC43NjM3MjMgMTIuMjI0MSAwLjUxNTc4NSAxNS4yNjM0TDAuNjc1NzI0IDE1LjYyMzNDMS4yNzU0OSAxNy4xMDI5IDEuMjc1NDkgMTguNzQyNSAwLjY3NTcyNCAyMC4xODIyTDAuNTE1Nzg1IDIwLjYyMjFDLTAuNzYzNzIzIDIzLjY2MTMgMC42NzU3MjQgMjcuMTgwNSAzLjc1NDU0IDI4LjQyMDFMNC4xNTQzOSAyOC41ODAxQzUuNjMzODIgMjkuMTggNi43OTMzNyAzMC4zMzk3IDcuMzkzMTQgMzEuODE5M0w3LjU5MzA2IDMyLjI1OTJDOC44MzI1OSAzNS4zMzg0IDEyLjM1MTIgMzYuNzc4MSAxNS4zOTAxIDM1LjUzODRMMTUuODI5OSAzNS4zMzg1QzE3LjMwOTMgMzQuNzM4NiAxOC45NDg3IDM0LjczODYgMjAuNDI4MSAzNS4zMzg1TDIwLjc4OCAzNS40OTg0QzIzLjgyNjggMzYuNzc4MSAyNy4zNDU1IDM1LjI5ODUgMjguNjI1IDMyLjI1OTJMMjguNzg0OSAzMS45MzkzQzI5LjM4NDcgMzAuNDU5NiAzMC41NDQyIDI5LjI5OTkgMzIuMDIzNyAyOC43MDAxTDMyLjM0MzUgMjguNTgwMUMzNS40MjI0IDI3LjMwMDQgMzYuODYxOCAyMy44MjEzIDM1LjU4MjMgMjAuNzQyTDM1LjM4MjQgMjAuMzgyMVpNMTYuMzQ5NyAyNS43ODA4TDguNTUyNjkgMTkuMjIyNEwxMC45NTE4IDE2LjM4MzFMMTUuOTA5OSAyMC41ODIxTDI0LjY2NjUgMTAuMTg0NkwyNy41MDU0IDEyLjU4NEwxNi4zNDk3IDI1Ljc4MDhaIiBmaWxsPSIjMzc3MkZGIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMjkzOjI0MzkiPgo8cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="
                : verifiedLevel === VerifiedStatus.Curated
                ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAzNiAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEwNl8yKSI+CjxwYXRoIGQ9Ik02IDZIMzBWMzBINlY2WiIgZmlsbD0iI0ZDRkNGRCIvPgo8cGF0aCBkPSJNMzUuMzgyNCAyMC4zODIxQzM0Ljc4MjYgMTguOTAyNSAzNC43ODI2IDE3LjI2MjkgMzUuMzgyNCAxNS44MjMyTDM1LjU4MjMgMTUuMzQzNEMzNi44NjE4IDEyLjMwNDEgMzUuMzgyNCA4Ljc4NDk3IDMyLjM0MzUgNy41MDUyOEwzMS45MDM3IDcuMzA1MzNDMzAuNDI0MyA2LjcwNTQ4IDI5LjI2NDcgNS41NDU3NiAyOC42NjUgNC4wNjYxMkwyOC41MDUgMy42NjYyMkMyNy4xODU1IDAuNjI2OTY3IDIzLjcwNjkgLTAuODEyNjggMjAuNjI4IDAuNDI3MDE2TDIwLjIyODIgMC41ODY5NzdDMTguNzQ4OCAxLjE4NjgzIDE3LjEwOTQgMS4xODY4MyAxNS42MyAwLjU4Njk3N0wxNS4yNzAxIDAuNDI3MDE2QzEyLjI3MTMgLTAuODEyNjggOC43NTI2MiAwLjY2Njk1OCA3LjQ3MzExIDMuNzA2MjFMNy4zMTMxNyA0LjAyNjEzQzYuNzEzNCA1LjUwNTc3IDUuNTUzODUgNi42NjU0OSA0LjA3NDQyIDcuMjY1MzRMMy43MTQ1NSA3LjQyNTNDMC43MTU3MDggOC43MDQ5OSAtMC43NjM3MjMgMTIuMjI0MSAwLjUxNTc4NSAxNS4yNjM0TDAuNjc1NzI0IDE1LjYyMzNDMS4yNzU0OSAxNy4xMDI5IDEuMjc1NDkgMTguNzQyNSAwLjY3NTcyNCAyMC4xODIyTDAuNTE1Nzg1IDIwLjYyMjFDLTAuNzYzNzIzIDIzLjY2MTMgMC42NzU3MjQgMjcuMTgwNSAzLjc1NDU0IDI4LjQyMDFMNC4xNTQzOSAyOC41ODAxQzUuNjMzODIgMjkuMTggNi43OTMzNyAzMC4zMzk3IDcuMzkzMTQgMzEuODE5M0w3LjU5MzA2IDMyLjI1OTJDOC44MzI1OSAzNS4zMzg0IDEyLjM1MTIgMzYuNzc4MSAxNS4zOTAxIDM1LjUzODRMMTUuODI5OSAzNS4zMzg1QzE3LjMwOTMgMzQuNzM4NiAxOC45NDg3IDM0LjczODYgMjAuNDI4MSAzNS4zMzg1TDIwLjc4OCAzNS40OTg0QzIzLjgyNjggMzYuNzc4MSAyNy4zNDU1IDM1LjI5ODUgMjguNjI1IDMyLjI1OTJMMjguNzg0OSAzMS45MzkzQzI5LjM4NDcgMzAuNDU5NiAzMC41NDQyIDI5LjI5OTkgMzIuMDIzNyAyOC43MDAxTDMyLjM0MzUgMjguNTgwMUMzNS40MjI0IDI3LjMwMDQgMzYuODYxOCAyMy44MjEzIDM1LjU4MjMgMjAuNzQyTDM1LjM4MjQgMjAuMzgyMVpNMTYuMzQ5NyAyNS43ODA4TDguNTUyNjkgMTkuMjIyNEwxMC45NTE4IDE2LjM4MzFMMTUuOTA5OSAyMC41ODIxTDI0LjY2NjUgMTAuMTg0NkwyNy41MDU0IDEyLjU4NEwxNi4zNDk3IDI1Ljc4MDhaIiBmaWxsPSIjRjhCMjQ5Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTA2XzIiPgo8cmVjdCB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="
                : null
        })`};
    width: 14px;
    height: 14px;
    background-size: contain;
    position: absolute;
    bottom: 7px;
    left: 28px;
`;

export default SearchItem;
