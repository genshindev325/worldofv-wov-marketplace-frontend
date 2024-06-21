/* eslint-disable react-hooks/exhaustive-deps */
import { useUserData } from "@/hooks/useUserData";
import { useMediaQuery } from "@react-hook/media-query";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import styled, { useTheme } from "styled-components";
import { Flex } from "../../components/common/Flex";
import { Spacer } from "../../components/common/Spacer";
import ModalExchange from "../../modals/ModalExchange";
import common from "../../styles/_common";
import variables from "../../styles/_variables";
import { Button } from "../common/Button";
import { Divider } from "../common/Divider";
import { Text } from "../common/Text";
import Link from "../Link";
import { Banner } from "./Banner";
import { BurgerButton } from "./BurgerButton";
import { CreateItem } from "./CreateItem";
import { GlobalSearchBar } from "./GlobalSerachBar/GlobalSearchBar";
import HeaderSearchIcon from "./GlobalSerachBar/HeaderSearchIcon";
import HeaderOffersButton from "./HeaderOffersButton";
import { Nav } from "./Nav";
import { Sync1Banner } from "./Sync1Banner";
import { ThemeButton } from "./ThemeButton";
import { UserItem } from "./UserItem";

const { containerFluid } = common;
const {
    colors: { neutrals },
} = variables;

const Header = () => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.m})`);
    const isMediumScreen = useMediaQuery(`(max-width: ${theme.breakpoints.x})`);
    const router = useRouter();

    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
    const [isSearchBarOpen, setIsSearchBarOpen] = React.useState(false);

    const { user: userData } = useUserData();

    const closePopup = React.useCallback(() => setMobileNavOpen(false), []);

    React.useEffect(() => {
        router.events.on("routeChangeStart", closePopup);

        return () => {
            router.events.off("routeChangeStart", closePopup);
        };
    }, []);

    return (
        <Container>
            {router.asPath === "/" ? (
                <Sync1Banner />
            ) : (
                !router.asPath.startsWith("/business") && <Banner />
            )}
            <InnerContainer>
                <Flex width={900}>
                    <Link href="/" passHref>
                        <HeaderBrand>
                            <HeaderLogo>
                                <img src="/img/wov-logo.svg" alt="World of V" />
                            </HeaderLogo>

                            {!isSmallScreen && (
                                <div>
                                    <Text
                                        fontSize={18}
                                        fontWeight="bold"
                                        color="text"
                                        as="span"
                                        ml={2}
                                        mr={4}
                                    >
                                        World of V
                                    </Text>
                                    <Divider x />
                                </div>
                            )}
                        </HeaderBrand>
                    </Link>

                    {!isSmallScreen && !mobileNavOpen && (
                        <>
                            <GlobalSearchBar />
                            <Spacer size={3} />
                        </>
                    )}
                </Flex>
                <Flex justifyContent="flex-end">
                    <HeaderWrapper {...{ active: mobileNavOpen }}>
                        <Nav loggedIn={userData != null} />

                        {!isSmallScreen && <Spacer size={3} />}

                        {isSmallScreen && (
                            <HeaderFooter>
                                {userData != null ? (
                                    <CreateItem variant="mobile" />
                                ) : (
                                    <Link href="/login" passHref>
                                        <Button>Connect</Button>
                                    </Link>
                                )}
                                <ThemeButton />
                            </HeaderFooter>
                        )}
                    </HeaderWrapper>

                    <Flex rowGap={{ _: 2, s: 3 }}>
                        {!isSmallScreen &&
                            !mobileNavOpen &&
                            userData != null && (
                                <CreateItem variant="desktop" />
                            )}
                        {!mobileNavOpen && (
                            <>
                                {isSmallScreen && (
                                    <HeaderSearchIcon
                                        isSearchBarOpen={isSearchBarOpen}
                                        setIsSearchBarOpen={setIsSearchBarOpen}
                                    />
                                )}
                                {userData ? (
                                    <>
                                        <ModalExchange />
                                        <HeaderOffersButton />
                                        <UserItem />
                                    </>
                                ) : (
                                    <>
                                        <ThemeButton variant="circle" />

                                        <Link href="/login" passHref>
                                            <Button small>Connect</Button>
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </Flex>

                    {isMediumScreen && (
                        <>
                            <Spacer size={isSmallScreen ? 2 : 3} />
                            <BurgerButton
                                // @ts-ignore
                                open={mobileNavOpen}
                                onClick={() =>
                                    setMobileNavOpen((prev) => !prev)
                                }
                            />
                        </>
                    )}
                </Flex>
            </InnerContainer>

            {isSmallScreen && isSearchBarOpen && !mobileNavOpen && (
                <GlobalSearchBar setIsSearchBarOpen={setIsSearchBarOpen} />
            )}
        </Container>
    );
};

const Container = styled.header`
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 20;
    padding: 0;
    background: ${({ theme }) => theme.colors.background};
    border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
    height: auto;
`;

const InnerContainer = styled.div`
    display: flex;
    align-items: center;
    ${containerFluid};
    height: 81px;
    justify-content: space-between;
    > ${Button} {
        @media screen and (max-width: ${({ theme }) => theme.breakpoints.x}) {
            display: none;
        }

        &:first-of-type {
            margin-right: 12px !important;
        }
    }
`;

const HeaderBrand = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const HeaderLogo = styled.div`
    position: relative;
    z-index: 12;

    // START OF STANDARD
    // height: 40.5px;
    // width: 40.5px;
    // END OF STANDARD

    // START OF CHRISTMAS
    height: 50.5px;
    width: 50.5px;
    margin-top: -10px;
    // END OF CHRISTMAS

    img {
        position: relative;
        width: 100%;
    }
`;

const HeaderWrapper = styled.div.attrs<{ active?: boolean }>(({ active }) => ({
    className: clsx({ active }),
}))`
    display: flex;
    align-items: center;
    z-index: 3;
    @media screen and (max-width: ${({ theme }) => theme.breakpoints.x}) {
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
        flex-direction: column;
        align-items: stretch;
        height: calc(var(--app-height) - 80px);
        margin: 0;
        padding: 24px 32px 40px;
        box-shadow: 0px 64px 64px rgba(31, 47, 70, 0.2);
        background: ${neutrals[8]};
        visibility: hidden;
        opacity: 0;
        transition: all 0.2s;
        overflow: scroll;
        background-color: ${({ theme }) => theme.colors.background};

        &.active {
            visibility: visible;
            opacity: 1;
        }
    }
`;

const HeaderFooter = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin-top: auto;
    gap: 16px;

    ${Button} {
        flex: 1;
        white-space: nowrap;
    }
`;

export default Header;
