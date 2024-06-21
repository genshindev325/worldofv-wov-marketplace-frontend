import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Spacer } from "./Spacer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Spacer",
    component: Spacer,
    argTypes: {},
} as ComponentMeta<typeof Spacer>;

export const Horizontal: ComponentStory<typeof Spacer> = (args) => (
    <div>
        <span>I&apos;m on the left</span>
        <Spacer size={5} debug />
        <span>I&apos;m on the right</span>
    </div>
);

export const HorizontalFlex: ComponentStory<typeof Spacer> = (args) => (
    <div style={{ display: "flex" }}>
        <div>I&apos;m on the left</div>
        <Spacer size={5} debug />
        <div>I&apos;m on the right</div>
    </div>
);

export const Vertical: ComponentStory<typeof Spacer> = (args) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
        <div>I&apos;m at the top</div>
        <Spacer y size={5} debug />
        <div>I&apos;m at the bottom</div>
    </div>
);
