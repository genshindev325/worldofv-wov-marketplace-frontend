import { ComponentMeta, ComponentStory } from "@storybook/react";
import { FaqCard } from "./FaqCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/FaqCard",
    component: FaqCard,
    argTypes: {},
} as ComponentMeta<typeof FaqCard>;

export const Default: ComponentStory<typeof FaqCard> = (args) => (
    <div style={{ width: 200 }}>
        <FaqCard
            question="Is this a question?"
            answer="Yes, that's a question
        Yes, that's a question
        Yes, that's a question"
        />
    </div>
);
