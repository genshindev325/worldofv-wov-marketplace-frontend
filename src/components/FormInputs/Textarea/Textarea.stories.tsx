import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Textarea } from "./Textarea";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/Textarea",
    component: Textarea,
    argTypes: {},
} as ComponentMeta<typeof Textarea>;

const Template: ComponentStory<typeof Textarea> = ({
    label = "I'm the label",
    inputProps = { name: "test" },
    ...args
}) => <Textarea label={label} inputProps={inputProps} {...args} />;

export const Default = Template.bind({});
