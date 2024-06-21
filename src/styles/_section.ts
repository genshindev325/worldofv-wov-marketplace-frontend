import { css } from "styled-components";
import mixins from "./_mixins";

const { media } = mixins;

const section = css`
    padding: 64px 0;

    ${media.d`
        padding: 48px 0;
    `}

    ${media.m`
        padding: 32px 0;
    `}
`;

const sections = {
    section,
};

export default sections;
