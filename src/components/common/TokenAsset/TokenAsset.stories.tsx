import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TokenAsset } from "./TokenAsset";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/TokenAsset",
    component: TokenAsset,
    argTypes: {},
} as ComponentMeta<typeof TokenAsset>;

const asset = {
    mimeType: "image/jpeg",
    url: "https://via.placeholder.com/150",
    // size: "STATIC_COVER_256",
};

export const Deafault: ComponentStory<typeof TokenAsset> = () => (
    <TokenAsset asset={asset} sizePx={150} />
);
