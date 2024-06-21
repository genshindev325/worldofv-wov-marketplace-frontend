import { initialize, mswDecorator } from "msw-storybook-addon";
import { ThemeProvider } from "next-themes";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 12
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import GlobalStyle from "../src/styles/GlobalStyle";
import "../src/styles/index.scss";
import { theme } from "../src/styles/theme";
import ThemeChanger from "./ThemeChanger";

// Initialize MSW
initialize();

export const decorators = [
    (Story, { globals }) => {
        const themeMode =
            globals?.backgrounds?.value == null ||
            globals.backgrounds.value === "#F8F8F8"
                ? "light"
                : "dark";

        return (
            <RecoilRoot>
                <ThemeProvider>
                    <GlobalStyle />
                    <ThemeChanger theme={themeMode} />
                    <SCThemeProvider theme={theme}>
                        <Story />
                    </SCThemeProvider>
                    <ToastContainer position="top-center" theme={themeMode} />
                </ThemeProvider>
            </RecoilRoot>
        );
    },
    // Provide the MSW addon decorator globally
    mswDecorator,
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    nextRouter: {
        Provider: RouterContext.Provider,
    },
};
