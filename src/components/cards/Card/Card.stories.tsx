import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Card } from "./Card";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Card",
    component: Card,
    argTypes: {},
} as ComponentMeta<typeof Card>;

export const PrimaryBg: ComponentStory<typeof Card> = (args) => (
    <Card>
        <p>I&apos;m inside a Card :)</p>
    </Card>
);
