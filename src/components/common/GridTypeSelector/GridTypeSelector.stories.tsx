import { ComponentMeta, ComponentStory } from "@storybook/react";
import { GridTypeSelector } from "./GridTypeSelector";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/GridTypeSelector",
    component: GridTypeSelector,
    argTypes: {},
} as ComponentMeta<typeof GridTypeSelector>;

export const Default: ComponentStory<typeof GridTypeSelector> = () => (
    <GridTypeSelector />
);
