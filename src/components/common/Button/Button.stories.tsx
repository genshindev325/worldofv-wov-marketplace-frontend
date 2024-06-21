import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Button } from "./Button";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Button",
    component: Button,
    argTypes: {},
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: "I'm the child",
};

export const Outline = Template.bind({});
Outline.args = {
    children: "I'm the child",
    outline: true,
};

export const Error = Template.bind({});
Error.args = {
    children: "I'm the child",
    error: true,
};

export const Warning = Template.bind({});
Warning.args = {
    children: "I'm the child",
    warning: true,
};

export const Impact = Template.bind({});
Impact.args = {
    children: "I'm the child",
    impact: true,
};

export const Loader = Template.bind({});
Loader.args = {
    loader: true,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
    children: "I'm the child",
    fullWidth: true,
};
