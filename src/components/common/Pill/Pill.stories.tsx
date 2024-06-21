import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Pill } from "./Pill";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Pill",
    component: Pill,
    argTypes: {},
} as ComponentMeta<typeof Pill>;

const Template: ComponentStory<typeof Pill> = (args) => <Pill {...args} />;

export const Default = Template.bind({});
Default.args = {
    left: "I'm the left",
    right: "right",
    bg: "gold",
    color: "white",
    width: 300,
};

export const WithBorder = Template.bind({});
WithBorder.args = {
    left: "I'm the left",
    right: "right",
    bg: "white",
    color: "silver",
    border: true,
    width: 300,
};
