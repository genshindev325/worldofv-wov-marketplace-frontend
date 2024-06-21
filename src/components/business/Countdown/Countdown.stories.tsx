import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Countdown } from "./Countdown";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/business/Countdown",
    component: Countdown,
    argTypes: {},
} as ComponentMeta<typeof Countdown>;

export const Default: ComponentStory<typeof Countdown> = () => (
    <Countdown duration={15} />
);
