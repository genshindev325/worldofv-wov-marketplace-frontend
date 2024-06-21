import { ComponentMeta, ComponentStory } from "@storybook/react";
import { GlobalSearchBar } from "./GlobalSearchBar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/GlobalSearchBar",
    component: GlobalSearchBar,
    argTypes: {},
} as ComponentMeta<typeof GlobalSearchBar>;

// TODO  Study how to mock and pass the data
export const Default: ComponentStory<typeof GlobalSearchBar> = () => {
    const mockedData = {
        collections: null,
        tokens: null,
        users: null,
    };
    return (
        <div>
            <GlobalSearchBar />
        </div>
    );
};
