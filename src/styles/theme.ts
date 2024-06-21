import { css, DefaultTheme } from "styled-components";

//================================================
// Following theme spec from styled-system
// https://styled-system.com/theme-specification/
//================================================

// See: https://github.com/styled-system/styled-system/issues/1318
export type BreakpointsKeys = Array<string> & {
    s?: string;
    p?: string;
    a?: string;
    m?: string;
    f?: string;
    t?: string;
    d?: string;
    x?: string;
    w?: string;
    z?: string;
};

const breakpoints: BreakpointsKeys = [
    "447px",
    "519px",
    "639px",
    "767px",
    "920px",
    "1023px",
    "1179px",
    "1339px",
    "1419px",
    "1600px",
];

// aliases
breakpoints.s = breakpoints[0];
breakpoints.p = breakpoints[1];
breakpoints.a = breakpoints[2];
breakpoints.m = breakpoints[3];
breakpoints.f = breakpoints[4];
breakpoints.t = breakpoints[5];
breakpoints.d = breakpoints[6];
breakpoints.x = breakpoints[7];
breakpoints.w = breakpoints[8];
breakpoints.z = breakpoints[9];

// TODO: not sure if we need it
// export const mediaQueries = (
//     Object.keys(breakpoints) as (number | BreakpointsKeys)[]
// )
//     .filter((k) => !isNumber(k))
//     .map((k) => `@media screen and (min-width: ${breakpoints[k]})`);

export const space = [0, 4, 8, 16, 24, 32, 64, 128, 256, 512];
// indexes ->        [0, 1, 2, 3,  4,  5,  6,  7,   8,   9]

export const radii = [0, 4, 8, 12, 16, 20, 999];
// indexes ->        [0, 1, 2, 3,  4,  5,  6]

/*
Key:	      Description:
primary	    Primary brand color for links, buttons, etc.
secondary	  A secondary brand color for alternative styling
text	      Body foreground color
background	Body background color
highlight	  A background color for highlighting text
muted	      A faint color for borders, backgrounds, and accents that do not require high contrast with the background color
accent	    A contrast color for emphasizing UI
neutral     A neutral color
*/
export const colors = {
    transparent: `var(--color-transparent)`,
    white: `var(--color-white)`,
    black: `var(--color-black)`,
    silver: `var(--color-silver)`,
    gold: `var(--color-gold)`,
    primary: `var(--color-primary)`,
    primaryDark10: `var(--color-primary-dark-10)`,
    success: `var(--color-success)`,
    error: `var(--color-error)`,
    errorLight15: `var(--color-error-light-15)`,
    errorDark15: `var(--color-error-dark-15)`,
    warning: `var(--color-warning)`,
    warningLight15: `var(--color-warning-light-15)`,
    warningDark15: `var(--color-warning-dark-15)`,
    text: `var(--color-text)`,
    background: `var(--color-background)`,
    highlight: `var(--color-highlight)`,
    muted: `var(--color-muted)`,
    accent: `var(--color-accent)`,
    neutral: `var(--color-neutral)`,
};

export const fonts = {
    Poppins: '"Poppins", sans-serif',
    DM_Sans: '"DM Sans", sans-serif',
};

export const fontSizes = [8, 11, 12, 14, 16, 24, 32, 40, 48, 96];
// indexes ->            [0, 1,  2,  3,  4,  5,  6,  7,  8,  9]

export const fontWeights = {
    bold: 700,
    semibold: 600,
    medium: 500,
    regular: 400,
};

export const lineHeights = [
    0, // 0
    1, // 1
    56 / 48, // 2
    48 / 40, // 3
    40 / 32, // 4
    32 / 24, // 5
    24 / 16, // 6
    20 / 12, // 7
    24 / 14, // 8
];
// float ->                [0, 1, 1.16..., 1.2,     1.25,    1.33..., 1.5,     1.66..., 1.71...]
// indexes ->              [0, 1, 2,       3,       4,       5,       6,       7,       8]

export const letterSpacings = ["0em", "-0.01em", "-0.02em"];

const title = css`
    font-family: ${fonts.DM_Sans};
    font-weight: 700;
`;

export const typography = {
    body1: css`
        font-size: 24px;
        line-height: ${32 / 24};
        letter-spacing: -0.01em;
    `,
    bodyBold1: css`
        font-size: 24px;
        line-height: ${32 / 24};
        letter-spacing: -0.01em;
        font-weight: 600;
    `,
    body2: css`
        font-size: 16px;
        line-height: ${24 / 16};
    `,
    bodyBold2: css`
        font-size: 16px;
        line-height: ${24 / 16};
        font-weight: 500;
    `,
    caption1: css`
        font-size: 14px;
        line-height: ${24 / 14};
    `,
    captionBold1: css`
        font-size: 14px;
        line-height: ${24 / 14};
        font-weight: 500;
    `,
    caption2: css`
        font-size: 12px;
        line-height: ${20 / 12};
    `,
    captionBold2: css`
        font-size: 12px;
        line-height: ${20 / 12};
        font-weight: 600;
    `,
    caption3: css`
        font-size: 11px;
        line-height: ${24 / 14};
    `,
    captionBold3: css`
        font-size: 11px;
        line-height: ${24 / 14};
        font-weight: 600;
    `,
    hairline1: css`
        font-size: 16px;
        line-height: 1;
        font-weight: 700;
        text-transform: uppercase;
    `,
    hairline2: css`
        font-size: 12px;
        line-height: 1;
        font-weight: 700;
        text-transform: uppercase;
    `,
    // hero: css`
    //     ${title}
    //     font-size: 96px;
    //     line-height: 1;
    //     letter-spacing: -0.02em;
    // `,
    h1: css`
        ${title}
        font-size: 64px;
        line-height: 1;
        letter-spacing: -0.02em;
    `,
    h2: css`
        ${title}
        font-size: 48px;
        line-height: ${56 / 48};
        letter-spacing: -0.02em;
    `,
    h3: css`
        ${title}
        font-size: 40px;
        line-height: ${48 / 40};
        letter-spacing: -0.01em;
    `,
    h4: css`
        ${title}
        font-size: 32px;
        line-height: ${40 / 32};
        letter-spacing: -0.01em;
    `,
};

/**
 * Associate typography to tag to be used in Text component
 */
export const typo2tag = {
    body1: "p",
    bodyBold1: "p",
    body2: "p",
    bodyBold2: "p",
    caption1: "p",
    captionBold1: "p",
    caption2: "p",
    captionBold2: "p",
    caption3: "p",
    captionBold3: "p",
    hairline1: "p",
    hairline2: "p",
    hero: "h1",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
};

// Stolen from https://mui.com/material-ui/customization/default-theme/
export const shadows = [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)",
    "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
    "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)",
    "0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)",
    "0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)",
    "0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)",
    "0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)",
    "0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)",
    "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)",
    "0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)",
    "0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)",
    "0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)",
    "0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)",
    "0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)",
    "0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)",
    "0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)",
];

export const theme: DefaultTheme = {
    colors,
    fonts,
    fontSizes,
    fontWeights,
    lineHeights,
    letterSpacings,
    typography,
    breakpoints,
    space,
    radii,
    shadows,
};
