import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Popup } from "./Popup";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Popup",
    component: Popup,
    argTypes: {},
} as ComponentMeta<typeof Popup>;

const Template: ComponentStory<typeof Popup> = (args) => (
    <Popup
        placement="bottom"
        interactive
        content={<p>I&apos;m inside a popup</p>}
    >
        <button>Hover me!</button>
    </Popup>
);

export const Default = Template.bind({});
