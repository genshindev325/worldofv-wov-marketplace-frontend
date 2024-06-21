import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Nav } from "./Nav";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/header/Nav",
    component: Nav,
    argTypes: {},
} as ComponentMeta<typeof Nav>;

const Template: ComponentStory<typeof Nav> = (args) => <Nav {...args} />;

export const NotLoggedIn = Template.bind({});

export const LoggedIn = Template.bind({});
LoggedIn.args = {
    loggedIn: true,
};
