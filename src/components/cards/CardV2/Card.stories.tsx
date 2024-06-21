import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useMockToken, useMockUser } from "../../../mocks";
import { Card } from "./Card";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/CardV2",
    component: Card,
    argTypes: {},
} as ComponentMeta<typeof Card>;

export const Default: ComponentStory<typeof Card> = () => {
    useMockUser();
    const token = useMockToken();

    return (
        <div style={{ height: 527, width: 378 }}>
            <Card {...token} />
        </div>
    );
};
