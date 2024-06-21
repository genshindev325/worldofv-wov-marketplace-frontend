import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TbScan } from "react-icons/tb";
import { CounterCard } from "./CounterCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/business/CounterCard",
    component: CounterCard,
    argTypes: {},
} as ComponentMeta<typeof CounterCard>;

const Template: ComponentStory<typeof CounterCard> = (args) => {
    return <CounterCard {...args} />;
};

export const Default = Template.bind({});
Default.args = {
    Icon: TbScan,
    text: "Points claimed",
    count: 56254,
};
