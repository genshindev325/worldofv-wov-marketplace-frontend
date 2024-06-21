// import original module declarations
import "styled-components";
import { BreakpointsKeys, colors, shadows } from "./src/styles/theme";

// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        colors: typeof colors;
        fonts: typeof fontscolors;
        fontSizes: number[];
        fontWeights: typeof fontWeightscolors;
        lineHeights: number[];
        letterSpacings: string[];
        typography: typeof typographycolors;
        breakpoints: BreakpointsKeys;
        space: number[];
        radii: number[];
        shadows: typeof shadows;
    }
}
