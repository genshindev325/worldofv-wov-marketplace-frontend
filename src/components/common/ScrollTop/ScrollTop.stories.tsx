import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Spacer } from "../Spacer";
import { ScrollTop } from "./ScrollTop";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: "components/common/ScrollTop",
    component: ScrollTop,
    argTypes: {},
} as ComponentMeta<typeof ScrollTop>;

export const Default: ComponentStory<typeof ScrollTop> = () => (
    <div>
        <header>I&apos;m the header</header>
        <ScrollTop>
            {(scrollTop) => (
                <div>
                    <Spacer y size={1024} />
                    <button onClick={scrollTop}>Scroll me</button>
                </div>
            )}
        </ScrollTop>
    </div>
);
