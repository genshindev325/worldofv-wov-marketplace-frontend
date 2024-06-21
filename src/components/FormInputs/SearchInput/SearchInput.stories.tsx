import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { SearchInput } from "./SearchInput";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/SearchInput",
    component: SearchInput,
    argTypes: {},
} as ComponentMeta<typeof SearchInput>;

export const Default: ComponentStory<typeof SearchInput> = () => {
    const [value, setValue] = useState("");

    return (
        <div style={{ padding: 8 }}>
            <SearchInput
                value={value}
                placeholder="Search by Title, Artist, Collection"
                onSearch={setValue}
            />
        </div>
    );
};

export const SetOnFocus: ComponentStory<typeof SearchInput> = () => {
    const [value, setValue] = useState("");

    return (
        <div style={{ padding: 8 }}>
            <SearchInput
                value={value}
                placeholder="Search by Title, Artist, Collection"
                onSearch={setValue}
            />
        </div>
    );
};
