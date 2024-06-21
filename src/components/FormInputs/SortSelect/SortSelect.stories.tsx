import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { PROFILE_TAB_SORT_OPTIONS } from "../../../constants/profileFilterOptions";
import { OptionItemProps } from "../Select";
import { SortSelect } from "./SortSelect";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/SortSelect",
    component: SortSelect,
    argTypes: {},
} as ComponentMeta<typeof SortSelect>;

export const Default: ComponentStory<typeof SortSelect> = () => {
    const [value, setValue] = useState<OptionItemProps>(
        PROFILE_TAB_SORT_OPTIONS[0]
    );

    return (
        <div style={{ padding: 8 }}>
            <SortSelect
                options={PROFILE_TAB_SORT_OPTIONS}
                value={value}
                onChange={setValue}
            />
        </div>
    );
};
