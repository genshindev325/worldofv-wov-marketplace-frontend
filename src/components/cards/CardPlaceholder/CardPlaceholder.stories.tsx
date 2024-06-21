import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CardPlaceholder } from "./CardPlaceholder";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/CardPlaceholder",
    component: CardPlaceholder,
    argTypes: {},
} as ComponentMeta<typeof CardPlaceholder>;

export const Default: ComponentStory<typeof CardPlaceholder> = () => (
    <div style={{ height: 527, width: 378 }}>
        <CardPlaceholder />
    </div>
);
