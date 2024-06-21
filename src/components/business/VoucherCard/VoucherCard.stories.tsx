import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useMockToken, useMockUser } from "../../../mocks";
import { VoucherCard } from "./VoucherCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/business/VoucherCard",
    component: VoucherCard,
    argTypes: {},
} as ComponentMeta<typeof VoucherCard>;

export const Default: ComponentStory<typeof VoucherCard> = () => {
    useMockUser();
    const token = useMockToken();

    return (
        <div style={{ height: 527, width: 378 }}>
            <VoucherCard onClick={() => {}} {...token} />
        </div>
    );
};
