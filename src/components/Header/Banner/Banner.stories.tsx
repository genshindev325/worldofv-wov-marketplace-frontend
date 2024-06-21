import { ComponentMeta, ComponentStory } from "@storybook/react";
import { deleteCookie } from "cookies-next";
import { useState } from "react";
import { Banner, COOKIE } from "./Banner";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/header/Banner",
    component: Banner,
    argTypes: {},
} as ComponentMeta<typeof Banner>;

export const Default: ComponentStory<typeof Banner> = () => {
    const [bool, setBool] = useState(false);

    const handleClear = () => {
        deleteCookie(COOKIE);
        setBool((b) => !b);
    };

    return (
        <>
            <button onClick={handleClear}>Clear cookie</button>
            {/*
              Force a re-render so that Banner state is reset
              and therefore cookie refetch
            */}
            {bool && <Banner />}
            {!bool && <Banner />}
        </>
    );
};
