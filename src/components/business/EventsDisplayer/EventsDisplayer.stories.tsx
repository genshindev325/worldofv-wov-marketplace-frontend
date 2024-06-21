import { VerifiedStatus } from "@/generated/graphql";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TbScan } from "react-icons/tb";
import { EventsDisplayer } from "./EventsDisplayer";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/business/EventsDisplayer",
    component: EventsDisplayer,
    argTypes: {},
} as ComponentMeta<typeof EventsDisplayer>;

const Template: ComponentStory<typeof EventsDisplayer> = (args) => {
    return <EventsDisplayer {...args} />;
};

export const Default = Template.bind({});
Default.args = {
    Icon: TbScan,
    title: "Hottest venues",
    users: [
        {
            dateTime: "2023-03-15T14:17:30.000Z",
            user: {
                address: "0x982AB73320807E3cD27Ca94BB0B02C2E586eD1F6",
                profileImageUrl:
                    "https://wov-images.ams3.digitaloceanspaces.com/users/0x982AB73320807E3cD27Ca94BB0B02C2E586eD1F6/avatar/original.webp",
                verifiedLevel: VerifiedStatus.NotVerified,
                verified: false,
                name: "Alexandra Wunderlich",
            },
        },
        {
            dateTime: "2023-03-15T12:01:10.000Z",
            user: {
                address: "0xDd273cAeC44D6d11d3D643Bd3fdC996b8A7642B4",
                profileImageUrl:
                    "https://wov-images.ams3.digitaloceanspaces.com/users/0xDd273cAeC44D6d11d3D643Bd3fdC996b8A7642B4/avatar/original.webp",
                verifiedLevel: VerifiedStatus.Verified,
                verified: false,
                name: "Kneo",
            },
        },
    ],
};
