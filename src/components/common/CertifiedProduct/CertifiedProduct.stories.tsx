import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CertifiedProduct } from "./CertifiedProduct";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/CertifiedProduct",
    component: CertifiedProduct,
    argTypes: {},
} as ComponentMeta<typeof CertifiedProduct>;

export const Default: ComponentStory<typeof CertifiedProduct> = () => (
    <CertifiedProduct isAuthenticated />
);
