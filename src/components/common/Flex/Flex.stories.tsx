import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Flex } from "./Flex";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Flex",
    component: Flex,
    argTypes: {},
} as ComponentMeta<typeof Flex>;

export const Row: ComponentStory<typeof Flex> = () => (
    <Flex debug>
        <div>I&apos;m inside a row.</div>
        <div>Me too!</div>
    </Flex>
);

export const Column: ComponentStory<typeof Flex> = () => (
    <Flex flexDirection="column" debug>
        <div>I&apos;m inside a column.</div>
        <div>Me too!</div>
    </Flex>
);

export const RowSpaceBetween: ComponentStory<typeof Flex> = () => (
    <Flex justifyContent={{ _: "center", m: "space-around" }} debug>
        <div>I&apos;m inside a row.</div>
        <div>Me too!</div>
    </Flex>
);
