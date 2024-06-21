import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CreateItem } from "./CreateItem";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/header/CreateItem",
    component: CreateItem,
    argTypes: {},
} as ComponentMeta<typeof CreateItem>;

const Template: ComponentStory<typeof CreateItem> = (args) => (
    <CreateItem {...args} />
);

export const Desktop = Template.bind({});
Desktop.args = {
    variant: "desktop",
};

export const Mobile = Template.bind({});
Mobile.args = {
    variant: "mobile",
};
