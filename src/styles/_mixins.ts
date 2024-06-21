import { css, FlattenSimpleInterpolation } from "styled-components";
import variables from "./_variables";

const media = Object.entries(variables.breakpoints).reduce(
    (acc, [label, value]) => {
        acc[label] = (literals: TemplateStringsArray, ...args: any[]) => css`
            @media only screen and (max-width: ${value}) {
                ${css(literals, ...args)};
            }
        `;

        return acc;
    },
    {} as { [k: string]: (...args: any) => FlattenSimpleInterpolation }
);

const dark = (literals: TemplateStringsArray, ...args: any) => css`
    [data-theme="dark"] &,
    [data-theme="dark"] body & {
        ${css(literals, ...args)}
    }
`;

const mixins = {
    /**
     * @deprecated
     * Use instead:
     * [at]media only screen and (min-width: ${({ theme }) => theme.breakpoints.p}) {
     *    ...
     * }
     */
    media,
    dark,
};

export default mixins;
