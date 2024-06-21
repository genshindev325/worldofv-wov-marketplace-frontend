import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Input } from "./Input";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/Input",
    component: Input,
    argTypes: {},
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = ({
    label = "I'm the label",
    description = "I'm the description",
    inputProps = { name: "test" },
    ...args
}) => (
    <Input
        label={label}
        description={description}
        inputProps={inputProps}
        {...args}
    />
);

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
    errors: { test: { message: "I'm the error msg", type: "required" } },
};

export const RightDecoration = Template.bind({});
RightDecoration.args = {
    rightDecoration: <small>RIGHT</small>,
};
