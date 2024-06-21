import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WhatsappButton } from "./WhatsappButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/WhatsappButton",
    component: WhatsappButton,
    argTypes: {},
} as ComponentMeta<typeof WhatsappButton>;

const Template: ComponentStory<typeof WhatsappButton> = () => (
    <WhatsappButton />
);

export const Default = Template.bind({});
