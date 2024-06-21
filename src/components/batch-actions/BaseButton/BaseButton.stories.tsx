import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { BaseButton } from "./BaseButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/batch-actions/BaseButton",
    component: BaseButton,
    argTypes: {},
} as ComponentMeta<typeof BaseButton>;

const Template: ComponentStory<typeof BaseButton> = ({
    selectionTarget,
    label,
    context,
    ...args
}) => {
    const [isSelecting, setSelecting] = useState(false);

    const setSelectionTarget = () => {};

    return (
        <BaseButton
            selectionTarget={selectionTarget}
            label="Batch Buy"
            context={{ setSelecting, setSelectionTarget, isSelecting }}
            {...args}
        />
    );
};

export const Default = Template.bind({});

export const FullWidth = Template.bind({});
FullWidth.args = {
    fullWidth: true,
};
