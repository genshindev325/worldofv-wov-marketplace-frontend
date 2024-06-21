import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Field } from "./Field";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/Field",
    component: Field,
    argTypes: {},
} as ComponentMeta<typeof Field>;

const Template: ComponentStory<typeof Field> = ({
    label = "I'm the label",
    description = "I'm the description",
    ...args
}) => <Field label={label} description={description} {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
    error: true,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    readOnly: true,
};

export const Description: ComponentStory<typeof Field> = () => (
    <Field
        label="I'm the label"
        description={
            <ul>
                <li>
                    1. Step one <a>link</a>
                </li>
                <li>2. Step two</li>
            </ul>
        }
    />
);
