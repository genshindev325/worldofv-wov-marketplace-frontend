import BlockchainProvider from "@/blockchain/BlockchainProvider";
import { RefreshProvider } from "@/components/RefreshContext";
import type { NextComponentType, NextPage } from "next";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import {
    AppContext,
    AppInitialProps,
    AppLayoutProps,
    AppProps,
} from "next/app";
import { useRouter } from "next/router";
import nProgress from "nprogress";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { RecoilRoot } from "recoil";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { SWRConfig } from "swr";
import BalanceProvider from "../components/BalanceProvider";
import ConnexProvider from "../components/ConnexProvider";
import GlobalLayout from "../components/GlobalLayout";
import RecoilNexus from "../components/RecoilNexus";
import useBuildData from "../hooks/useBuildData";
import { GlobalConfigProvider } from "../providers/GlobalConfigProvider";
import GlobalStyle from "../styles/GlobalStyle";
import "../styles/index.scss";
import { theme } from "../styles/theme";
import "../utils/replaceAll.polyfill";

nProgress.configure({ showSpinner: false });

export type CustomNextPage<T = any> = NextPage<T> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
    noHeader?: boolean;
    noFooter?: boolean;
};

type AppGlobalLayoutProps = AppProps & {
    Component: CustomNextPage;
};

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
    Component,
    pageProps,
}: AppGlobalLayoutProps) => {
    const router = useRouter();

    const { buildId } = useBuildData();

    const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

    React.useEffect(() => {
        if (process.browser) {
            const appHeight = () => {
                const doc = document.documentElement;
                doc.style.setProperty(
                    "--app-height",
                    `${window.innerHeight}px`
                );
            };

            window.addEventListener("resize", appHeight);
            appHeight();

            return () => window.removeEventListener("resize", appHeight);
        }
    }, []);

    React.useEffect(() => {
        const handleStart = (_: string, options: { shallow: boolean }) => {
            if (!options.shallow) nProgress.start();
        };

        const handleStop = () => nProgress.done();

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router]);

    const reCaptchaKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY!;

    return (
        <RecoilRoot>
            <RecoilNexus />

            <SWRConfig>
                <RefreshProvider>
                    <BlockchainProvider>
                        <ConnexProvider {...{ buildId }}>
                            <BalanceProvider>
                                <ThemeProvider>
                                    <SCThemeProvider theme={theme}>
                                        <GoogleReCaptchaProvider
                                            reCaptchaKey={reCaptchaKey}
                                            scriptProps={{
                                                async: true,
                                                defer: true,
                                            }}
                                        >
                                            <GlobalConfigProvider>
                                                <GlobalStyle />
                                                <GlobalLayout
                                                    noHeader={
                                                        Component.noHeader
                                                    }
                                                    noFooter={
                                                        Component.noFooter
                                                    }
                                                >
                                                    {getLayout(
                                                        <Component
                                                            {...pageProps}
                                                        />
                                                    )}
                                                </GlobalLayout>
                                            </GlobalConfigProvider>
                                        </GoogleReCaptchaProvider>
                                    </SCThemeProvider>
                                </ThemeProvider>
                            </BalanceProvider>
                        </ConnexProvider>
                    </BlockchainProvider>
                </RefreshProvider>
            </SWRConfig>
        </RecoilRoot>
    );
};

export default appWithTranslation(MyApp);
