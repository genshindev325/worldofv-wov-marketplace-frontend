import { darken, lighten } from "polished";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --color-transparent: transparent;
    --color-white: #ffffff;
    --color-black: #000000;
    --color-silver: #6b7284;
    --color-gold: #ffa400;
    --color-primary: #3772FF; /* blue */
    --color-primary-dark-10: ${darken(0.1, "#3772FF")};
    --color-success: #45B26B; /* green */
    --color-error: #EF466F; /* red */
    --color-error-light-15: ${lighten(0.15, "#EF466F")};
    --color-error-dark-15: ${darken(0.15, "#EF466F")};
    --color-warning: #FFD166; /* yellow */
    --color-warning-light-15: ${lighten(0.15, "#FFD166")};
    --color-warning-dark-15: ${darken(0.15, "#FFD166")};
    --color-text: #23262F; /* neutrals[2] */
    --color-background: #FCFCFD; /* neutrals[8] */
    --color-highlight: #FCFCFD; /* neutrals[7] */
    --color-muted: #E6E8EC; /* neutrals[6] */
    --color-accent: #777E90; /* neutrals[4] */
    --color-neutral: #B1B5C3; /* neutrals[5] */
  }

  [data-theme="dark"] {
    --color-primary: #3772FF; /* blue */
    --color-primary-dark-10: ${darken(0.1, "#3772FF")};
    --color-success: #45B26B; /* green */
    --color-error: #EF466F; /* red */
    --color-error-light-15: ${lighten(0.15, "#EF466F")};
    --color-error-dark-15: ${darken(0.15, "#EF466F")};
    --color-warning: #FFD166; /* yellow */
    --color-warning-light-15: ${lighten(0.15, "#FFD166")};
    --color-warning-dark-15: ${darken(0.15, "#FFD166")};
    --color-text: #FCFCFD; /* neutrals[8] */
    --color-background: #141416; /* neutrals[1] */
    --color-highlight: #23262F; /* neutrals[2] */
    --color-muted: #353945; /* neutrals[3] */
    --color-accent: #777E90; /* neutrals[4] */
    --color-neutral: #B1B5C3; /* neutrals[5] */
  }
`;

export default GlobalStyle;
