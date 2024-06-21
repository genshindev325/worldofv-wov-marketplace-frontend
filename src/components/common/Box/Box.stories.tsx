import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Box } from "./Box";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/Box",
    component: Box,
    argTypes: {},
} as ComponentMeta<typeof Box>;

export const PrimaryBg: ComponentStory<typeof Box> = (args) => (
    <Box bg="primary" debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with bg color</p>
    </Box>
);

export const FixedHeight: ComponentStory<typeof Box> = (args) => (
    <Box height={100} debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with fixed height</p>
    </Box>
);

export const Padding: ComponentStory<typeof Box> = (args) => (
    <Box p={3} debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with padding</p>
    </Box>
);

export const PaddingX: ComponentStory<typeof Box> = (args) => (
    <Box px={3} debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with horizontal padding</p>
    </Box>
);

export const PaddingY: ComponentStory<typeof Box> = (args) => (
    <Box py={3} debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with vertical padding</p>
    </Box>
);

export const TopPadding: ComponentStory<typeof Box> = (args) => (
    <Box pt={3} debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with top padding</p>
    </Box>
);

export const RigthPadding: ComponentStory<typeof Box> = (args) => (
    <Box pr={3} debug>
        <p style={{ textAlign: "right" }}>I&apos;m inside a Box :)</p>
        <p style={{ textAlign: "right" }}>with rigth padding</p>
    </Box>
);

export const BottomPadding: ComponentStory<typeof Box> = (args) => (
    <Box pb={3} debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with bottom padding</p>
    </Box>
);

export const LeftPadding: ComponentStory<typeof Box> = (args) => (
    <Box pl={3} debug>
        <p>I&apos;m inside a Box :)</p>
        <p>with left padding</p>
    </Box>
);

export const Border: ComponentStory<typeof Box> = (args) => (
    <Box border="1px solid" borderColor="success">
        <p>I&apos;m inside a Box :)</p>
        <p>with border</p>
    </Box>
);

export const Rounded: ComponentStory<typeof Box> = (args) => (
    <Box border="1px solid" borderColor="success" borderRadius={5}>
        <p>I&apos;m inside a Box :)</p>
        <p>with rounded border</p>
    </Box>
);
