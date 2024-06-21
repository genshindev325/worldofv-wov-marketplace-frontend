import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { TOKEN_TYPE_FILTER_OPTIONS } from "../../../constants/marketplaceFilterOptions";
import { OptionItemProps } from "../Select";
import { TokenTypeSelect } from "./TokenTypeSelect";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/form-inputs/TokenTypeSelect",
    component: TokenTypeSelect,
    argTypes: {},
} as ComponentMeta<typeof TokenTypeSelect>;

export const Default: ComponentStory<typeof TokenTypeSelect> = () => {
    const [value, setValue] = useState<OptionItemProps>(
        TOKEN_TYPE_FILTER_OPTIONS[0]
    );

    return (
        <div style={{ padding: 8 }}>
            <TokenTypeSelect value={value} onChange={setValue} />
        </div>
    );
};
