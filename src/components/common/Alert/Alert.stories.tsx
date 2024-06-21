import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Alert } from "./Alert";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Alert",
    component: Alert,
    argTypes: {},
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (args) => <Alert {...args} />;

export const Title = Template.bind({});
Title.args = {
    title: "Something bad will happen!",
};
