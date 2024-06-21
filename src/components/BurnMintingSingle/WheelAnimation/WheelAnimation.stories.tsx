import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WheelAnimation } from "./WheelAnimation";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/burn-minting-single/WheelAnimation",
    component: WheelAnimation,
    argTypes: {},
} as ComponentMeta<typeof WheelAnimation>;

export const Default: ComponentStory<typeof WheelAnimation> = () => (
    <WheelAnimation />
);
