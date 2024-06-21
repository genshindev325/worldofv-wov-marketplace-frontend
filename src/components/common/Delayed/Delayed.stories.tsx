import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Delayed } from "./Delayed";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Delayed",
    component: Delayed,
    argTypes: {},
} as ComponentMeta<typeof Delayed>;

const Template: ComponentStory<typeof Delayed> = (args) => (
    <Delayed {...args} />
);

export const Default = Template.bind({});
Default.args = {
    wait: 2000,
    children: <p>Show me after 2 sec</p>,
};
