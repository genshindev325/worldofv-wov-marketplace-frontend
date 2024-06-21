import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { StackItem } from "./StackItem";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/StackItem",
    component: StackItem,
    argTypes: {},
} as ComponentMeta<typeof StackItem>;

export const Default: ComponentStory<typeof StackItem> = () => {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ border: "1px solid red" }}>
            <StackItem
                text="I'm the text"
                open={open}
                onClick={() => {
                    setOpen((state) => !state);
                }}
            />
        </div>
    );
};
