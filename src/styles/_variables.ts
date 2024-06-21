import { css } from "styled-components";

const breakpoints = {
    s: "447px",
    p: "519px",
    a: "639px",
    m: "767px",
    f: "920px",
    t: "1023px",
    d: "1179px",
    x: "1339px",
    w: "1419px",
    z: "1600px",
};

const colors = {
    white: "#ffffff",
    blue: "#3772FF",
    blueLight: "#4BC9F0",
    purple: "#9757D7",
    purpleLight: "#CDB4DB",
    red: "#EF466F",
    green: "#45B26B",
    asphalt: "#E4D7CF",
    yellow: "#FFD166",
    neutrals: [
        "#000000",
        "#141416",
        "#23262F",
        "#353945",
        "#777E90",
        "#B1B5C3",
        "#E6E8EC",
        "#F4F5F6",
        "#FCFCFD",
    ],
};

const fonts = {
    Poppins: css`
        font-family: "Poppins", sans-serif;
    `,
    DM_Sans: css`
        font-family: "DM Sans", sans-serif;
    `,
};

const title = css`
    ${fonts.DM_Sans}
    font-weight: 700;
`;

const typography = {
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
    hero: css`
        ${title}
        font-size: 96px;
        line-height: 1;
        letter-spacing: -0.02em;
    `,
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
 * @deprecated
 * Use theme from style components or global CSS vars from GlobalStyle
 */
const variables = {
    breakpoints,
    colors,
    fonts,
    typography,
};

export default variables;
