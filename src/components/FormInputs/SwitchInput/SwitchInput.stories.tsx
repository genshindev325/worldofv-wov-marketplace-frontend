import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { SwitchInput } from "./SwitchInput";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/SwitchInput",
    component: SwitchInput,
    argTypes: {},
} as ComponentMeta<typeof SwitchInput>;

export const Default: ComponentStory<typeof SwitchInput> = () => {
    const [checked, setChecked] = useState(false);

    return (
        <SwitchInput
            label="hide"
            checked={checked}
            onChange={() => {
                setChecked(!checked);
            }}
        />
    );
};
