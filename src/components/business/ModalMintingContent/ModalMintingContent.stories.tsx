import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ModalMintingContent } from "./ModalMintingContent";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/business/ModalMintingContent",
    component: ModalMintingContent,
    argTypes: {},
} as ComponentMeta<typeof ModalMintingContent>;

const Template: ComponentStory<typeof ModalMintingContent> = (args) => {
    return <ModalMintingContent {...args} />;
};

export const Default = Template.bind({});
Default.args = {
    setIsOpen: () => {},
    onSubmit: async () => {},
    alt: "alt",
    src: "https://via.placeholder.com/150",
    RedirectButton: () => <button>Hello</button>,
};

export const NoButton = Template.bind({});
NoButton.args = {
    setIsOpen: () => {},
    onSubmit: async () => {},
    alt: "alt",
    src: "https://via.placeholder.com/150",
};
