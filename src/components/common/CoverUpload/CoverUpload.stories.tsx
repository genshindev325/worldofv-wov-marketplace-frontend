import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CoverUpload } from "./CoverUpload";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/CoverUpload",
    component: CoverUpload,
    argTypes: {},
} as ComponentMeta<typeof CoverUpload>;

const Template: ComponentStory<typeof CoverUpload> = (args) => (
    <CoverUpload {...args} />
);

export const CanEdit = Template.bind({});
CanEdit.args = {
    canEdit: true,
};

export const CannotEdit = Template.bind({});
CannotEdit.args = {
    canEdit: false,
};

export const Cover = Template.bind({});
Cover.args = {
    cover: "https://via.placeholder.com/350x150",
};

export const Children = Template.bind({});
Children.args = {
    canEdit: true,
    children: <p>I&apos;m the child</p>,
};

export const Throw = Template.bind({});
Throw.args = {
    canEdit: true,
    onUpload: () => {
        throw new Error();
    },
};
