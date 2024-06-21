import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/ProgressBar",
    component: ProgressBar,
    argTypes: {},
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = (args) => (
    <ProgressBar {...args} />
);

export const Default = Template.bind({});
Default.args = {
    percentage: 80,
};

export const Full = Template.bind({});
Full.args = {
    percentage: 100,
};

export const Empty = Template.bind({});
Empty.args = {
    percentage: 0,
};
