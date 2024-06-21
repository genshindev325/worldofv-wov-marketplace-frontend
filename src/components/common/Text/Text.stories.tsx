import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Text } from "./Text";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Text",
    component: Text,
    argTypes: {},
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof Text> = (args) => (
    <div style={{ border: "1px solid red" }}>
        <Text {...args}>Hello</Text>
    </div>
);

export const H1 = Template.bind({});
H1.args = {
    variant: "h1",
};

export const Body1 = Template.bind({});
Body1.args = {
    variant: "body1",
};

export const Body1FontSize = Template.bind({});
Body1FontSize.args = {
    variant: "body1",
    fontSize: { _: 1, a: 2, x: 3 },
};

export const H1Style = Template.bind({});
H1Style.args = {
    variant: "h1",
    style: { color: "springgreen" },
};

export const H1Uppercase = Template.bind({});
H1Uppercase.args = {
    variant: "h1",
    uppercase: true,
};

export const H1Color = Template.bind({});
H1Color.args = {
    variant: "h1",
    color: "primary",
};

export const Caption1 = Template.bind({});
Caption1.args = {
    variant: "caption1",
};

export const H2Regular = Template.bind({});
H2Regular.args = {
    variant: "h2",
    fontWeight: "regular",
};

export const LetterSpacing = Template.bind({});
LetterSpacing.args = {
    variant: "h1",
    letterSpacing: 1,
};

export const Italic = Template.bind({});
Italic.args = {
    variant: "h1",
    italic: true,
};

export const Margin = Template.bind({});
Margin.args = {
    variant: "h1",
    m: 5,
};

export const MarginTop = Template.bind({});
MarginTop.args = {
    variant: "h1",
    mt: 5,
};

export const Strong: ComponentStory<typeof Text> = () => (
    <div style={{ border: "1px solid red" }}>
        <Text variant="body1">
            Hello I&apos;m{" "}
            <Text variant="body1" as="strong" color="primary">
                strong
            </Text>
        </Text>
    </div>
);
