import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ThemeButton } from "./ThemeButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/header/ThemeButton",
    component: ThemeButton,
    argTypes: {},
} as ComponentMeta<typeof ThemeButton>;

const Template: ComponentStory<typeof ThemeButton> = (args) => (
    <ThemeButton {...args} />
);

export const Button = Template.bind({});

export const Circle = Template.bind({});
Circle.args = {
    variant: "circle",
};

export const Switch = Template.bind({});
Switch.args = {
    variant: "switch",
};
