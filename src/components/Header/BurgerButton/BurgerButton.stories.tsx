import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { BurgerButton } from "./BurgerButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/header/BurgerButton",
    component: BurgerButton,
    argTypes: {},
} as ComponentMeta<typeof BurgerButton>;

export const Default: ComponentStory<typeof BurgerButton> = () => {
    const [open, setOpen] = useState(false);

    return (
        <BurgerButton
            // @ts-ignore
            open={open}
            onClick={() => {
                setOpen((o) => !o);
            }}
        />
    );
};
