import { ComponentMeta, ComponentStory } from "@storybook/react";
import { VideoPlayer } from "./VideoPlayer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/burn-minting-single/VideoPlayer",
    component: VideoPlayer,
    argTypes: {},
} as ComponentMeta<typeof VideoPlayer>;

export const Default: ComponentStory<typeof VideoPlayer> = () => (
    <VideoPlayer src="https://player.vimeo.com/video/766808899?h=6b2e018f13" />
);
