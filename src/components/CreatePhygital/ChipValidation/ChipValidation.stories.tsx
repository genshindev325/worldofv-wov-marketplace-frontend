import { ComponentMeta, ComponentStory } from "@storybook/react";
import { rest } from "msw";
import { ChipValidation, url } from "./ChipValidation";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/create-phygital/ChipValidation",
    component: ChipValidation,
    argTypes: {},
} as ComponentMeta<typeof ChipValidation>;

const Template: ComponentStory<typeof ChipValidation> = () => (
    <ChipValidation>
        {({ validated, error, nfcChip }) => (
            <div>
                <p>
                    Validated: {validated?.toString()}, Error: {error}, NFC
                    Chip: {nfcChip}
                </p>
            </div>
        )}
    </ChipValidation>
);

export const Valid = Template.bind({});
Valid.args = {};
Valid.parameters = {
    msw: {
        handlers: {
            profile: rest.post(url, (req, res, ctx) => {
                return res(
                    ctx.json({
                        success: true,
                        code: 200,
                        message: "Product Details Found!",
                    })
                );
            }),
        },
    },
};

export const Invalid = Template.bind({});
Invalid.args = {};
Invalid.parameters = {
    msw: {
        handlers: {
            profile: rest.post(url, (req, res, ctx) => {
                return res(
                    ctx.json({
                        success: false,
                        code: 201,
                        message: "Product Details Not Found!",
                    })
                );
            }),
        },
    },
};
