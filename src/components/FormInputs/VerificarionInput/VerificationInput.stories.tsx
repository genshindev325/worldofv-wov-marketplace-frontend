import { ComponentMeta, ComponentStory } from "@storybook/react";
import { VerificationInput } from "./VerificationInput";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/VerificationInput",
    component: VerificationInput,
    argTypes: {},
} as ComponentMeta<typeof VerificationInput>;

const Template: ComponentStory<typeof VerificationInput> = ({
    label = "I'm the label",
    description = "I'm the description",
    inputProps = { name: "test" },
    register = () => ({
        onBlur: () => {},
        onChange: () => {},
    }),
    ...args
}) => (
    <VerificationInput
        label={label}
        description={description}
        inputProps={inputProps}
        register={register}
        {...args}
    />
);

export const Default = Template.bind({});
