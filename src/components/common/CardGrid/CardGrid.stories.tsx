import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CardGrid } from "./CardGrid";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/CardGrid",
    component: CardGrid,
    argTypes: {},
} as ComponentMeta<typeof CardGrid>;

const Template: ComponentStory<typeof CardGrid> = (args) => (
    <CardGrid {...args} />
);

const Card = () => (
    <div>
        <img
            src="https://via.placeholder.com/150.png"
            width={80}
            height={100}
            alt="Card"
        />
        <h3>Title</h3>
    </div>
);

const items = [...new Array(24).fill(0)].map((v, idx) => ({
    tokenId: idx,
    smartContractAddress: `${v}_${idx}`,
}));

export const Loading = Template.bind({});
Loading.args = {
    variant: "wide",
    gridType: "large",
    CardComponent: Card,
    loading: true,
    pageSize: 24,
};

export const Items = Template.bind({});
Items.args = {
    variant: "wide",
    gridType: "large",
    CardComponent: Card,
    loading: false,
    // @ts-ignore
    items,
    pageSize: 24,
};

export const NoItems = Template.bind({});
NoItems.args = {
    variant: "wide",
    gridType: "large",
    CardComponent: Card,
    loading: false,
    items: [],
    pageSize: 24,
    onNoResultsButtonClick: undefined,
};

export const NoItemsOnReset = Template.bind({});
NoItemsOnReset.args = {
    variant: "wide",
    gridType: "large",
    CardComponent: Card,
    loading: false,
    items: [],
    pageSize: 24,
    onNoResultsButtonClick: () => {
        console.log("Reset!");
    },
};
