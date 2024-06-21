import { css } from "styled-components";
import mixins from "./_mixins";

const { media } = mixins;

const outer = css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    // overflow: hidden;
`;

const outerInner = css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const containerFluid = css`
    width: 100%;
    margin: 0 auto;
    padding: 0 40px;

    ${media.t`
        padding: 0 32px;
    `}

    ${media.m`
        padding: 0 24px;
    `}
    
    ${media.a`
        padding: 0 16px;
    `}
`;

const container = css`
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0;

    ${media.x`
        padding: 0 40px;
    `}

    ${media.m`
        padding: 0 32px;
    `}
`;

const containerLarge = css`
    ${container}
    max-width: 1400px;
`;

const common = {
    outer,
    outerInner,
    container,
    containerLarge,
    containerFluid,
};

export default common;
