import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useMockToken, useMockUser } from "../../../mocks";
import { PhygitalsCard } from "./PhygitalsCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/phygitals/PhygitalsCard",
    component: PhygitalsCard,
    argTypes: {},
} as ComponentMeta<typeof PhygitalsCard>;

export const Default: ComponentStory<typeof PhygitalsCard> = () => {
    useMockUser();
    const token = useMockToken();

    return (
        <div style={{ height: 527, width: 378 }}>
            <PhygitalsCard {...token} />
        </div>
    );
};
