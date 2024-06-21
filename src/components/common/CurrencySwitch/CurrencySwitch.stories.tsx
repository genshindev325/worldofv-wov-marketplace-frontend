import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Currency } from "../../../types/Currencies";
import { CurrencySwitch } from "./CurrencySwitch";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/CurrencySwitch",
    component: CurrencySwitch,
    argTypes: {},
} as ComponentMeta<typeof CurrencySwitch>;

const Template: ComponentStory<typeof CurrencySwitch> = ({ currencies }) => {
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
        currencies[0]
    );
    return (
        <CurrencySwitch
            currencies={currencies}
            selectedCurrency={selectedCurrency}
            onClick={setSelectedCurrency}
        />
    );
};

export const TwoOptions = Template.bind({});
TwoOptions.args = {
    currencies: ["WoV", "vVET"],
};

export const ThreeOptions = Template.bind({});
ThreeOptions.args = {
    currencies: ["WoV", "vVET", "VET"],
};
