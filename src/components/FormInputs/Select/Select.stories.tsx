import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Select } from "./Select";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/Select",
    component: Select,
    argTypes: {},
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = ({
    label = "I'm the label",
    inputProps = {
        name: "test",
        options: [
            { label: "Label 1", id: 1 },
            { label: "Label 2", id: 2 },
            { label: "Label 3", id: 3 },
        ],
    },
    ...args
}) => <Select label={label} inputProps={inputProps} {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
    errors: { test: { message: "I'm the error msg", type: "required" } },
};
