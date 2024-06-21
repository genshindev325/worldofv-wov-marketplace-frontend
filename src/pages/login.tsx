import { Flex } from "@/components/common/Flex";
import { Spacer } from "@/components/common/Spacer";
import { Text } from "@/components/common/Text";
import usePersistentRedirect from "@/hooks/usePersistentRedirect";
import { useUserData } from "@/hooks/useUserData";
import { NextPageContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import styled from "styled-components";
import ConnectStep from "../components/Auth/ConnectStep";
import Head from "../components/Head";
import Link from "../components/Link";
import { CustomNextPage } from "./_app";

interface LoginProps {
    referer: string | null;
}

const Login: CustomNextPage = ({ referer }: LoginProps) => {
    const { user } = useUserData();

    const { redirectToLastSavedUrl, setRedirectUrl } = usePersistentRedirect();

    useEffect(() => {
        const refererUrl = referer ? new URL(referer).pathname : null;

        if (
            refererUrl &&
            refererUrl !== "/login" &&
            refererUrl !== "/login-redirect"
        ) {
            setRedirectUrl(refererUrl);
        }
    }, [referer, setRedirectUrl]);

    useEffect(() => {
        if (user) redirectToLastSavedUrl();
    }, [redirectToLastSavedUrl, user]);

    return (
        <>
            <Head title="Login" />

            <Flex flexDirection="column" flex={1}>
                <Link href="/" passHref>
                    <Brand>
                        <Logo>
                            <img src="/img/wov-logo.svg" alt="World of V" />
                        </Logo>

                        <Text variant="h4">World of V</Text>
                    </Brand>
                </Link>

                <Flex
                    marginY={4}
                    flexDirection="column"
                    flex={1}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text
                        variant="h3"
                        fontSize={{ _: 32, a: 48 }}
                        textAlign="center"
                    >
                        Sign in to World&nbsp;of&nbsp;V
                    </Text>

                    <Spacer y size={2} />

                    <Text variant="caption2" color="neutral" textAlign="center">
                        The first and largest #GreenNFTs marketplace on VeChain.
                        <br />
                        Create & collect with 0 gas fees.
                    </Text>

                    <Spacer y size={5} />

                    <ConnectStep />
                </Flex>
            </Flex>
        </>
    );
};

Login.noHeader = true;

const Brand = styled.div`
    display: flex;
    padding-top: 24px;
    padding-inline: 16px;
    margin-right: 8px;
    justify-content: center;

    > * {
        cursor: pointer;
    }

    @media only screen and (min-width: ${({ theme }) => theme.breakpoints.a}) {
        justify-content: flex-start;
    }
`;

const Logo = styled.div`
    height: 50px;
    width: 50px;
    margin-top: -6px;
    margin-right: 8px;

    img {
        position: relative;
        width: 100%;
    }
`;

export async function getServerSideProps(context: NextPageContext) {
    const locale = context.locale || "en";

    return {
        props: {
            referer: context.req?.headers?.referer ?? null,
            ...(await serverSideTranslations(locale, ["connect_step"])),
        },
    };
}

export default Login;
