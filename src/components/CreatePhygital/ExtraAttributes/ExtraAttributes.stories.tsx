import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ExtraAttributes } from "./ExtraAttributes";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/create-phygital/ExtraAttributes",
    component: ExtraAttributes,
    argTypes: {},
} as ComponentMeta<typeof ExtraAttributes>;

const Template: ComponentStory<typeof ExtraAttributes> = (args) => (
    <ExtraAttributes {...args} />
);

export const NoTraits = Template.bind({});
NoTraits.args = {};

export const WithTraits = Template.bind({});
WithTraits.args = {
    traits: [
        {
            trait_type: "Gender",
            value: "Female",
        },
        {
            trait_type: "Color",
            value: "Red",
        },
    ],
};
