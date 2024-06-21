import { ComponentMeta, ComponentStory } from "@storybook/react";
import { StakingIcon } from "./StakingIcon";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/StakingIcon",
    component: StakingIcon,
    argTypes: {},
} as ComponentMeta<typeof StakingIcon>;

const Template: ComponentStory<typeof StakingIcon> = (args) => (
    <StakingIcon {...args} />
);

export const Default = Template.bind({});
Default.args = {
    size: 128,
};
