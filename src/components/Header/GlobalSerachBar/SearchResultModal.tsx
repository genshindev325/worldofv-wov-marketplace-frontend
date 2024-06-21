import ConditionalWrapper from "@/components/HOC/ConditionalWrapper";
import Link from "@/components/Link";
import React from "react";
import styled from "styled-components";
import Web3 from "web3";
import { SearchByStringQueryResult } from "../../../generated/graphql";
import FlatLoader from "../../FlatLoader";
import SearchItem from "./SearchItem";

interface SearchResultModalProps {
    isOpen: boolean;
    isLoading: boolean;
    isGlobalSearch?: boolean;
    searchResult: SearchByStringQueryResult["searchByString"];
    searchText: string;
    setValue: (address: string) => void;
    setIsSearchBarOpen?: (newState: boolean) => void;
}

const SearchResultModal: React.FC<SearchResultModalProps> = ({
    isOpen,
    isLoading,
    isGlobalSearch,
    searchResult,
    searchText,
    setValue,
    setIsSearchBarOpen,
}) => {
    const { collections, tokens, users } = searchResult;
    const screenWidth = `${window.innerWidth - 10}px`;

    if (!isOpen) {
        return null;
    }

    return (
        <Container screenWidth={screenWidth}>
            {users && (
                <Category>
                    {isGlobalSearch && <Title>USERS</Title>}
                    {users.map(
                        ({
                            customUrl,
                            address,
                            assets,
                            name,
                            verified,
                            verifiedLevel,
                        }) => (
                            <ConditionalWrapper
                                isRendered={!!isGlobalSearch}
                                key={address}
                                wrapper={(children) => (
                                    <Link
                                        passHref
                                        href={`/profile/${
                                            customUrl || address
                                        }`}
                                    >
                                        <a>{children}</a>
                                    </Link>
                                )}
                            >
                                <StyledSearchItem
                                    setValue={setValue}
                                    userAddress={address}
                                    name={name}
                                    isVerified={verified}
                                    verifiedLevel={verifiedLevel}
                                    image={assets?.[0]?.url}
                                    setIsSearchBarOpen={setIsSearchBarOpen}
                                    isGlobalSearch={isGlobalSearch}
                                />
                            </ConditionalWrapper>
                        )
                    )}
                </Category>
            )}
            {!users && Web3.utils.isAddress(searchText) && (
                <ConditionalWrapper
                    isRendered={!!isGlobalSearch}
                    wrapper={(children) => (
                        <Link passHref href={`/profile/${searchText}`}>
                            <a>{children}</a>
                        </Link>
                    )}
                >
                    <StyledSearchItem
                        setValue={setValue}
                        userAddress={searchText}
                        setIsSearchBarOpen={setIsSearchBarOpen}
                    />
                </ConditionalWrapper>
            )}
            {collections && (
                <Category>
                    <Title>COLLECTIONS</Title>
                    {collections.map(
                        ({
                            smartContractAddress,
                            customUrl,
                            collectionId,
                            thumbnailImageUrl,
                            name,
                            isVerified,
                        }) => (
                            <ConditionalWrapper
                                key={smartContractAddress ?? collectionId}
                                isRendered={!!isGlobalSearch}
                                wrapper={(children) => (
                                    <Link
                                        passHref
                                        href={`/collection/${
                                            customUrl || collectionId
                                        }`}
                                    >
                                        <a>{children}</a>
                                    </Link>
                                )}
                            >
                                <StyledSearchItem
                                    setValue={setValue}
                                    name={name}
                                    isVerified={isVerified}
                                    smartContractAddress={smartContractAddress}
                                    image={thumbnailImageUrl}
                                    setIsSearchBarOpen={setIsSearchBarOpen}
                                />
                            </ConditionalWrapper>
                        )
                    )}
                </Category>
            )}
            {tokens && (
                <Category>
                    <Title>ITEMS</Title>
                    {tokens.map(
                        ({
                            smartContractAddress,
                            tokenId,
                            asset,
                            name,
                            collection,
                        }) => (
                            <ConditionalWrapper
                                key={`${smartContractAddress}_${tokenId}`}
                                isRendered={!!isGlobalSearch}
                                wrapper={(children) => (
                                    <Link
                                        passHref
                                        href={`/token/${smartContractAddress}/${tokenId}`}
                                    >
                                        <a>{children}</a>
                                    </Link>
                                )}
                            >
                                <StyledSearchItem
                                    setValue={setValue}
                                    name={name}
                                    isVerified={
                                        collection
                                            ? collection.isVerified
                                            : null
                                    }
                                    smartContractAddress={smartContractAddress}
                                    image={asset ? asset.url : null}
                                    fileType={asset ? asset.mimeType : null}
                                    setIsSearchBarOpen={setIsSearchBarOpen}
                                />
                            </ConditionalWrapper>
                        )
                    )}
                </Category>
            )}
            {isLoading && <StyledFlatLoader size={36} />}
            {!users &&
                !collections &&
                !tokens &&
                !isLoading &&
                !Web3.utils.isAddress(searchText) && (
                    <StyledSearchItem disabled />
                )}
        </Container>
    );
};

const StyledSearchItem = styled(SearchItem)`
    &:first-child {
        border-top: none;
    }
`;

const Container = styled.div<{
    screenWidth: string;
    isGlobalSearch?: boolean;
}>`
    position: absolute;
    width: 100%;
    overflow: hidden;
    z-index: 1;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.colors.muted};
    margin-top: 10px;
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.m}) {
        width: ${(props) =>
            props.isGlobalSearch ? props.screenWidth : "100%"};
        left: ${(props) => (props.isGlobalSearch ? "-40" : "unset")};
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 300px;
    }
`;

const Category = styled.div`
    border-top: 1px solid ${({ theme }) => theme.colors.muted};
    &:first-child {
        border-top: unset;
    }
`;

const Title = styled.h4`
    padding: 10px 20px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
`;

const StyledFlatLoader = styled(FlatLoader)`
    width: 100%;
    margin: 10px auto;
`;

export default SearchResultModal;
