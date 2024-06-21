import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Tooltip } from "./Tooltip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Tooltip",
    component: Tooltip,
    argTypes: {},
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
    <Tooltip
        content="Wrap your VET and leverage on vVET to make bulk offers"
        placement="bottom"
        {...args}
    >
        <button>Hover me!</button>
    </Tooltip>
);

export const Default = Template.bind({});

export const Silver = Template.bind({});
Silver.args = {
    bg: "silver",
    borderColor: "transparent",
    color: "white",
    visible: true,
};
