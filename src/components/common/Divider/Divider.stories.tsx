import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Divider } from "./Divider";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Divider",
    component: Divider,
    argTypes: {},
} as ComponentMeta<typeof Divider>;

export const Default: ComponentStory<typeof Divider> = (args) => (
    <div>
        <p>Above</p>
        <Divider />
        <p>Below</p>
    </div>
);

export const Horizontal: ComponentStory<typeof Divider> = (args) => (
    <div>
        <span>Left</span>
        <Divider x color="error" />
        <span>Right</span>
    </div>
);

export const Color: ComponentStory<typeof Divider> = (args) => (
    <div>
        <p>Above</p>
        <Divider color="error" />
        <p>Below</p>
    </div>
);
